import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import {
  BOOKING_EMAIL_REGEX,
  dispatchBookingSideEffects,
  getCreatorAppointmentQuota,
  reserveSlotAtomic,
} from "@/features/appointments";

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
      include: { profile: { select: { displayName: true, isPublished: true, timezone: true } } },
    });

    if (!user || user.isSuspended || !user.profile?.isPublished) {
      return NextResponse.json({ success: false, error: "المستخدم غير متاح" }, { status: 404 });
    }

    const body = await req.json();
    const { serviceId, clientName, clientEmail, clientPhone, clientNotes, clientTimezone, gatewayCode, startTime } = body;

    if (!serviceId || !clientName || clientName.trim().length < 2 || !startTime) {
      return NextResponse.json({ success: false, error: "الاسم ووقت البدء والخدمة مطلوبة" }, { status: 400 });
    }
    if (!clientEmail || !BOOKING_EMAIL_REGEX.test(String(clientEmail).trim())) {
      return NextResponse.json({ success: false, error: "صيغة البريد الإلكتروني غير صالحة" }, { status: 400 });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ success: false, error: "وقت بدء الموعد غير صالح" }, { status: 400 });
    }

    const service = await prisma.consultationService.findFirst({
      where: { id: serviceId, creatorId: user.id, isActive: true },
    });
    if (!service) {
      return NextResponse.json({ success: false, error: "باقة الخدمة غير متوفرة" }, { status: 404 });
    }

    if (service.price > 0) {
      const quota = await getCreatorAppointmentQuota(user.id);
      if (!quota.allowPaidServices) {
        return NextResponse.json({ success: false, error: "الاستشارات المدفوعة غير مفعلة على باقة هذا الحساب حالياً" }, { status: 403 });
      }
      const gwCode = typeof gatewayCode === "string" ? gatewayCode.trim() : "";
      const gateway = await prisma.paymentGateway.findFirst({
        where: { code: gwCode, isEnabled: true, supportedCurrencies: { has: service.currency } },
      });
      if (!gateway) {
        return NextResponse.json({ success: false, error: "يرجى اختيار بوابة دفع متاحة ومفعلة لهذه العملة" }, { status: 400 });
      }
      if (!gateway.isTestMode) {
        return NextResponse.json(
          { success: false, error: "تتطلب بوابات الدفع الحية إتمام المصادقة عبر مزود الدفع الخارجي" },
          { status: 402 }
        );
      }
    }

    const { booking, manageToken, creatorTimezone } = await reserveSlotAtomic({
      serviceId,
      creatorId: user.id,
      clientName: String(clientName),
      clientEmail: String(clientEmail),
      clientPhone: clientPhone ? String(clientPhone) : undefined,
      clientNotes: clientNotes ? String(clientNotes) : undefined,
      clientTimezone: clientTimezone ? String(clientTimezone) : undefined,
      gatewayCode: service.price > 0 ? String(gatewayCode) : "free",
      startTime: start,
    });

    await dispatchBookingSideEffects({
      kind: "confirmed",
      bookingId: booking.id,
      manageToken,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      creatorEmail: user.email,
      creatorName: user.profile.displayName || user.username,
      serviceTitle: service.title,
      meetingType: service.meetingType,
      meetingUrl: booking.meetingUrl,
      meetingLocation: service.meetingLocation,
      startTime: booking.startTime,
      endTime: booking.endTime,
      creatorTimezone,
    });

    const tokenParam = encodeURIComponent(manageToken);
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        clientName: booking.clientName,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        amountPaid: booking.amountPaid,
        currency: service.currency,
        meetingType: service.meetingType,
        meetingLocation: service.meetingLocation,
        meetingUrl: booking.meetingUrl,
      },
      manageToken,
      manageUrl: `/bookings/${booking.id}?token=${tokenParam}`,
      meetingUrl: booking.meetingUrl,
      calendarUrls: {
        google: `/api/appointments/${booking.id}/calendar?format=google&token=${tokenParam}`,
        outlook: `/api/appointments/${booking.id}/calendar?format=outlook&token=${tokenParam}`,
        ics: `/api/appointments/${booking.id}/calendar?token=${tokenParam}`,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل حجز الموعد";
    if (msg === "SLOT_ALREADY_RESERVED") {
      return NextResponse.json({ success: false, error: "هذا الموعد محجوز مسبقاً، يرجى اختيار موعد آخر" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
