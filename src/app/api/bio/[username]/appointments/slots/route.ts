import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import {
  calculateAvailableSlots,
  getUtcBoundsForCreatorDate,
  isValidCalendarDateStr,
  normalizeTimezone,
} from "@/features/appointments";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const rateLimit = enforceRateLimit(req, "bio-slots", {
    maxAttempts: 45,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const { username } = await params;
    const cleanUsername = username.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      include: { profile: { select: { isPublished: true, timezone: true } } },
    });

    if (!user || user.isSuspended || !user.profile?.isPublished) {
      return NextResponse.json({ success: false, error: "المستخدم غير متاح" }, { status: 404 });
    }

    const creatorTimezone = normalizeTimezone(user.profile.timezone);
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const dateStr = searchParams.get("date");

    if (!serviceId || !dateStr || !isValidCalendarDateStr(dateStr)) {
      return NextResponse.json(
        { success: false, error: "معرف الخدمة وتاريخ الحجز الصالح مطلوبان" },
        { status: 400 }
      );
    }

    const service = await prisma.consultationService.findFirst({
      where: { id: serviceId, creatorId: user.id, isActive: true },
    });
    if (!service) {
      return NextResponse.json({ success: false, error: "الخدمة غير متوفرة" }, { status: 404 });
    }

    const { dayStartUtc, dayEndUtc, dayOfWeek } = getUtcBoundsForCreatorDate(
      dateStr,
      creatorTimezone
    );

    const [allRules, exceptions, existingBookings, gateways] = await Promise.all([
      prisma.availabilityRule.findMany({
        where: { creatorId: user.id },
        select: { dayOfWeek: true, startTime: true, endTime: true, slotMinutes: true, isActive: true },
      }),
      prisma.availabilityException.findMany({
        where: { creatorId: user.id },
        select: { date: true, reason: true },
      }),
      prisma.appointmentBooking.findMany({
        where: {
          creatorId: user.id,
          startTime: { lt: new Date(dayEndUtc.getTime() + 12 * 3600_000) },
          endTime: { gt: new Date(dayStartUtc.getTime() - 4 * 3600_000) },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          lockedUntil: true,
          bufferMinutes: true,
        },
      }),
      service.price > 0
        ? prisma.paymentGateway.findMany({
            where: {
              isEnabled: true,
              supportedCurrencies: { has: service.currency },
            },
            orderBy: { sortOrder: "asc" },
            select: {
              code: true,
              nameAr: true,
              nameEn: true,
              category: true,
              isTestMode: true,
              supportedCurrencies: true,
            },
          })
        : Promise.resolve([]),
    ]);

    const activeRule = allRules.find((r) => r.dayOfWeek === dayOfWeek && r.isActive);
    const matchedException = exceptions.find((ex) => ex.date === dateStr);
    const availableDaysMask = allRules.filter((r) => r.isActive).map((r) => r.dayOfWeek);
    const blockedDates = exceptions.map((ex) => ex.date);

    const slots = activeRule && !matchedException
      ? calculateAvailableSlots({
          date: dayStartUtc,
          dateStr,
          creatorTimezone,
          rule: activeRule,
          existingBookings,
          durationMinutes: service.durationMinutes,
          bufferMinutes: service.bufferMinutes,
        })
      : [];

    return NextResponse.json({
      success: true,
      slots,
      creatorTimezone,
      timezone: creatorTimezone,
      isBlockedDate: Boolean(matchedException),
      blockReason: matchedException?.reason || null,
      availableDaysMask,
      blockedDates,
      gateways,
    });
  } catch (error) {
    console.error("Calculate slots error:", error);
    return NextResponse.json(
      { success: false, error: "فشل استخراج الفترات المتاحة" },
      { status: 500 }
    );
  }
}
