import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import { calculateAvailableSlots } from "@/features/appointments";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const rateLimit = enforceRateLimit(req, "bio-slots", {
    maxAttempts: 40,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const { username } = await params;
    const cleanUsername = username.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      include: { profile: true },
    });

    if (!user || user.isSuspended || !user.profile?.isPublished) {
      return NextResponse.json(
        { success: false, error: "المستخدم غير متاح" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!serviceId || !dateStr) {
      return NextResponse.json(
        { success: false, error: "معرف الخدمة وتاريخ الحجز مطلوبان" },
        { status: 400 }
      );
    }

    const service = await prisma.consultationService.findFirst({
      where: { id: serviceId, creatorId: user.id, isActive: true },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "الخدمة غير متوفرة" },
        { status: 404 }
      );
    }

    const targetDate = new Date(`${dateStr}T00:00:00.000Z`);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "صيغة التاريخ غير صالحة" },
        { status: 400 }
      );
    }

    const dayOfWeek = targetDate.getUTCDay();

    const [rule, existingBookings] = await Promise.all([
      prisma.availabilityRule.findFirst({
        where: { creatorId: user.id, dayOfWeek, isActive: true },
      }),
      prisma.appointmentBooking.findMany({
        where: {
          creatorId: user.id,
          startTime: {
            gte: new Date(`${dateStr}T00:00:00.000Z`),
            lt: new Date(`${dateStr}T23:59:59.999Z`),
          },
        },
        select: {
          startTime: true,
          endTime: true,
          status: true,
          lockedUntil: true,
        },
      }),
    ]);

    if (!rule) {
      return NextResponse.json({
        success: true,
        slots: [],
        timezone: "Asia/Riyadh",
      });
    }

    const slots = calculateAvailableSlots({
      date: targetDate,
      rule: {
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.startTime,
        endTime: rule.endTime,
        slotMinutes: rule.slotMinutes,
      },
      existingBookings,
      durationMinutes: service.durationMinutes,
    });

    return NextResponse.json({
      success: true,
      slots,
      timezone: "Asia/Riyadh",
    });
  } catch (error) {
    console.error("Calculate slots error:", error);
    return NextResponse.json(
      { success: false, error: "فشل استخراج الفترات المتاحة" },
      { status: 500 }
    );
  }
}
