import crypto from "crypto";
import { prisma } from "@/shared/db";
import {
  acquireCreatorBookingLock,
  verifyManageToken,
} from "./slot-locker.service";
import {
  hasBufferedBookingConflict,
  isWithinCreatorSchedule,
  DEFAULT_MIN_NOTICE_MINUTES,
} from "./appointments.scheduler";
import { enqueueBookingWebhookTx } from "./booking-notifications.service";
import {
  getUtcBoundsForCreatorDate,
  getZonedDateParts,
  normalizeTimezone,
} from "../utils/timezone";

export async function confirmBookingAtomic(bookingId: string, paymentId?: string) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();
    const booking = await tx.appointmentBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("BOOKING_NOT_FOUND");
    if (booking.status === "CONFIRMED") return { booking, transitioned: false };

    await acquireCreatorBookingLock(tx, booking.creatorId);

    const updated = await tx.appointmentBooking.updateMany({
      where: {
        id: bookingId,
        status: "PENDING_PAYMENT",
        OR: [{ lockedUntil: null }, { lockedUntil: { gt: now } }],
      },
      data: {
        status: "CONFIRMED",
        paymentId: paymentId || `pay_${crypto.randomUUID()}`,
        lockedUntil: null,
      },
    });

    if (updated.count === 0) throw new Error("LOCK_EXPIRED");

    const refreshed = await tx.appointmentBooking.findUnique({ where: { id: bookingId } });
    return { booking: refreshed!, transitioned: true };
  });
}

export async function rescheduleBookingAtomic(
  bookingId: string,
  rawToken: string,
  newStartTime: Date
) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();
    const existing = await tx.appointmentBooking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!existing) throw new Error("BOOKING_NOT_FOUND");
    if (!verifyManageToken(rawToken, existing.manageTokenHash)) {
      throw new Error("UNAUTHORIZED_TOKEN");
    }
    if (existing.status !== "CONFIRMED") {
      throw new Error("INVALID_BOOKING_STATE");
    }
    if (existing.startTime.getTime() <= now.getTime() + DEFAULT_MIN_NOTICE_MINUTES * 60_000) {
      throw new Error("NOTICE_WINDOW_PASSED");
    }

    await acquireCreatorBookingLock(tx, existing.creatorId);

    const profile = await tx.profile.findUnique({
      where: { userId: existing.creatorId },
      select: { timezone: true },
    });
    const creatorTimezone = normalizeTimezone(profile?.timezone);
    const slotParts = getZonedDateParts(newStartTime, creatorTimezone);

    const [rule, exception] = await Promise.all([
      tx.availabilityRule.findFirst({
        where: { creatorId: existing.creatorId, dayOfWeek: slotParts.dayOfWeek, isActive: true },
      }),
      tx.availabilityException.findFirst({
        where: { creatorId: existing.creatorId, date: slotParts.dateStr },
      }),
    ]);

    const duration = existing.service.durationMinutes;
    const scheduleOk = isWithinCreatorSchedule({
      startTime: newStartTime,
      durationMinutes: duration,
      creatorTimezone,
      rule: rule || null,
      isBlockedDate: Boolean(exception),
      now,
    });
    if (!scheduleOk.ok) throw new Error(scheduleOk.error || "OUTSIDE_SCHEDULE");

    const newEndTime = new Date(newStartTime.getTime() + duration * 60_000);
    const { dayStartUtc, dayEndUtc } = getUtcBoundsForCreatorDate(slotParts.dateStr, creatorTimezone);
    const overlaps = await tx.appointmentBooking.findMany({
      where: {
        creatorId: existing.creatorId,
        startTime: { lt: new Date(dayEndUtc.getTime() + 12 * 3600_000) },
        endTime: { gt: new Date(dayStartUtc.getTime() - 4 * 3600_000) },
      },
      select: { id: true, startTime: true, endTime: true, status: true, lockedUntil: true, bufferMinutes: true },
    });

    if (
      hasBufferedBookingConflict(
        newStartTime,
        newEndTime,
        existing.bufferMinutes,
        overlaps,
        now,
        existing.id
      )
    ) {
      throw new Error("SLOT_ALREADY_RESERVED");
    }

    const updated = await tx.appointmentBooking.update({
      where: { id: existing.id },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
        rescheduleCount: { increment: 1 },
      },
      include: { service: true },
    });

    await enqueueBookingWebhookTx(tx, existing.creatorId, "booking.rescheduled", {
      bookingId: updated.id,
      clientName: updated.clientName,
      startTime: updated.startTime,
      endTime: updated.endTime,
      rescheduleCount: updated.rescheduleCount,
    });

    return { booking: updated, creatorTimezone };
  });
}

export async function cancelBookingAtomic(
  bookingId: string,
  rawToken: string,
  cancelReason?: string
) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.appointmentBooking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });
    if (!existing) throw new Error("BOOKING_NOT_FOUND");
    if (!verifyManageToken(rawToken, existing.manageTokenHash)) {
      throw new Error("UNAUTHORIZED_TOKEN");
    }
    if (existing.status === "CANCELLED") throw new Error("ALREADY_CANCELLED");
    if (existing.status !== "CONFIRMED") throw new Error("INVALID_BOOKING_STATE");

    await acquireCreatorBookingLock(tx, existing.creatorId);

    const updated = await tx.appointmentBooking.update({
      where: { id: existing.id },
      data: {
        status: "CANCELLED",
        cancelReason: cancelReason?.trim() || "تم الإلغاء بطلب العميل",
      },
      include: { service: true },
    });

    await enqueueBookingWebhookTx(tx, existing.creatorId, "booking.cancelled", {
      bookingId: updated.id,
      clientName: updated.clientName,
      cancelReason: updated.cancelReason,
    });

    return updated;
  });
}
