import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import {
  cancelBookingAtomic,
  dispatchBookingSideEffects,
  normalizeTimezone,
  rescheduleBookingAtomic,
  verifyManageToken,
} from "@/features/appointments";

function extractToken(req: NextRequest, bodyToken?: string): string {
  return (
    req.headers.get("x-manage-token") ||
    bodyToken ||
    new URL(req.url).searchParams.get("token") ||
    ""
  ).trim();
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimit = enforceRateLimit(req, "bio-manage-get", {
    maxAttempts: 40,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const { id } = await params;
    const rawToken = extractToken(req);

    const booking = await prisma.appointmentBooking.findUnique({
      where: { id },
      include: {
        service: true,
        creator: {
          select: {
            email: true,
            username: true,
            profile: { select: { displayName: true, avatarUrl: true, timezone: true } },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "الحجز غير موجود" }, { status: 404 });
    }
    if (!verifyManageToken(rawToken, booking.manageTokenHash)) {
      return NextResponse.json({ success: false, error: "رمز الإدارة غير صالح" }, { status: 403 });
    }

    const tokenParam = encodeURIComponent(rawToken);
    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          serviceId: booking.serviceId,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone,
          clientNotes: booking.clientNotes,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          amountPaid: booking.amountPaid,
          currency: booking.service.currency,
          meetingUrl: booking.meetingUrl,
          rescheduleCount: booking.rescheduleCount,
          cancelReason: booking.cancelReason,
          service: {
            id: booking.service.id,
            title: booking.service.title,
            durationMinutes: booking.service.durationMinutes,
            price: booking.service.price,
            currency: booking.service.currency,
            meetingType: booking.service.meetingType,
            meetingLocation: booking.service.meetingLocation,
          },
          creator: {
            username: booking.creator.username,
            displayName: booking.creator.profile?.displayName || booking.creator.username,
            avatarUrl: booking.creator.profile?.avatarUrl,
            timezone: normalizeTimezone(booking.creator.profile?.timezone),
          },
        },
        calendarUrls: {
          google: `/api/appointments/${booking.id}/calendar?format=google&token=${tokenParam}`,
          outlook: `/api/appointments/${booking.id}/calendar?format=outlook&token=${tokenParam}`,
          ics: `/api/appointments/${booking.id}/calendar?token=${tokenParam}`,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
        },
      }
    );
  } catch (error) {
    console.error("Client manage portal GET error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب بيانات الموعد" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimit = enforceRateLimit(req, "bio-manage-patch", {
    maxAttempts: 20,
    windowMs: 60000,
  });
  if (rateLimit) return rateLimit;

  try {
    const { id } = await params;
    const body = await req.json();
    const rawToken = extractToken(req, body.token);

    if (body.action === "reschedule") {
      const nextStart = new Date(body.newStartTime);
      if (isNaN(nextStart.getTime())) {
        return NextResponse.json({ success: false, error: "الموعد الجديد غير صالح" }, { status: 400 });
      }
      const { booking, creatorTimezone } = await rescheduleBookingAtomic(id, rawToken, nextStart);
      const creator = await prisma.user.findUnique({
        where: { id: booking.creatorId },
        select: { email: true, username: true, profile: { select: { displayName: true } } },
      });

      await dispatchBookingSideEffects({
        kind: "rescheduled",
        bookingId: booking.id,
        manageToken: rawToken,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        creatorEmail: creator?.email,
        creatorName: creator?.profile?.displayName || creator?.username || "مقدم الاستشارة",
        serviceTitle: booking.service.title,
        meetingType: booking.service.meetingType,
        meetingUrl: booking.meetingUrl,
        meetingLocation: booking.service.meetingLocation,
        startTime: booking.startTime,
        endTime: booking.endTime,
        creatorTimezone,
      });

      return NextResponse.json({ success: true, booking });
    }

    if (body.action === "cancel") {
      const updated = await cancelBookingAtomic(id, rawToken, body.cancelReason);
      const creator = await prisma.user.findUnique({
        where: { id: updated.creatorId },
        select: { email: true, username: true, profile: { select: { displayName: true, timezone: true } } },
      });

      await dispatchBookingSideEffects({
        kind: "cancelled",
        bookingId: updated.id,
        clientName: updated.clientName,
        clientEmail: updated.clientEmail,
        creatorEmail: creator?.email,
        creatorName: creator?.profile?.displayName || creator?.username || "مقدم الاستشارة",
        serviceTitle: updated.service.title,
        startTime: updated.startTime,
        endTime: updated.endTime,
        creatorTimezone: normalizeTimezone(creator?.profile?.timezone),
        cancelReason: updated.cancelReason,
      });

      return NextResponse.json({ success: true, booking: updated });
    }

    return NextResponse.json({ success: false, error: "إجراء غير مدعوم" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تحديث الحجز";
    const status = msg === "UNAUTHORIZED_TOKEN" ? 403 : msg === "ALREADY_CANCELLED" || msg === "SLOT_ALREADY_RESERVED" ? 409 : 400;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
