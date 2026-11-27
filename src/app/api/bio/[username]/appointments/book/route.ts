import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import { reserveSlotAtomic } from "@/features/appointments";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const rateLimit = enforceRateLimit(req, "bio-book", {
    maxAttempts: 15,
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

    const body = await req.json();
    const { serviceId, clientName, clientEmail, clientPhone, startTime } = body;

    if (!serviceId || !clientName || !clientEmail || !startTime) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول الإلزامية مطلوبة" },
        { status: 400 }
      );
    }

    const service = await prisma.consultationService.findFirst({
      where: { id: serviceId, creatorId: user.id, isActive: true },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "باقة الخدمة غير متوفرة" },
        { status: 404 }
      );
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime()) || start.getTime() <= Date.now()) {
      return NextResponse.json(
        { success: false, error: "وقت بدء الموعد غير صالح أو في الماضي" },
        { status: 400 }
      );
    }

    // Server-enforced end time strictly based on service duration
    const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000);

    const booking = await reserveSlotAtomic({
      serviceId,
      creatorId: user.id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone?.trim() || null,
      startTime: start,
      endTime: end,
      autoConfirm: true,
    });

    return NextResponse.json({
      success: true,
      booking,
      meetingUrl: booking.meetingUrl,
      calendarUrls: {
        google: `/api/appointments/${booking.id}/calendar?format=google`,
        outlook: `/api/appointments/${booking.id}/calendar?format=outlook`,
        ics: `/api/appointments/${booking.id}/calendar`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل حجز الموعد";
    if (message === "SLOT_ALREADY_RESERVED") {
      return NextResponse.json(
        { success: false, error: "هذا الموعد محجوز مسبقاً، يرجى اختيار موعد آخر" },
        { status: 409 }
      );
    }
    console.error("Book appointment error:", error);
    return NextResponse.json(
      { success: false, error: "تعذر إتمام الحجز حالياً" },
      { status: 500 }
    );
  }
}
