import crypto from "crypto";
import { prisma } from "@/shared/db";
import { ReserveSlotInput } from "../types/appointments.types";
import {
  hasBufferedBookingConflict,
  isWithinCreatorSchedule,
} from "./appointments.scheduler";
import { enqueueBookingWebhookTx } from "./booking-notifications.service";
import { isValidSafeHttpsUrl } from "../validators/appointments.validator";
import {
  getUtcBoundsForCreatorDate,
  getZonedDateParts,
  normalizeTimezone,
} from "../utils/timezone";

export function createManageTokenPair() {
  const rawToken = crypto.randomBytes(24).toString("hex");
  const tokenHash = hashManageToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashManageToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
}

export function verifyManageToken(rawToken: string, storedHash?: string | null): boolean {
  if (!rawToken || !storedHash) return false;
  const candidate = hashManageToken(rawToken);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function generateMeetingUrl(
  customUrl?: string | null,
  meetingType = "ONLINE"
): string | null {
  if (meetingType === "PHONE" || meetingType === "IN_PERSON") {
    return null;
  }
  if (isValidSafeHttpsUrl(customUrl)) {
    return customUrl!.trim();
  }
  const token = crypto.randomBytes(8).toString("hex");
  return `https://meet.jit.si/ANLinks-${token}`;
}

export async function acquireCreatorBookingLock(tx: any, creatorId: string) {
  if (typeof tx?.$executeRawUnsafe === "function") {
    await tx.$executeRawUnsafe(
      "SELECT pg_advisory_xact_lock(1001, hashtext($1))",
      creatorId
    );
  }
}

export async function reserveSlotAtomic(input: ReserveSlotInput) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();
    await acquireCreatorBookingLock(tx, input.creatorId);

    const service = tx.consultationService?.findFirst
      ? await tx.consultationService.findFirst({
          where: { id: input.serviceId, creatorId: input.creatorId, isActive: true },
        })
      : null;

    if (!input.skipScheduleCheck && !service) {
      throw new Error("SERVICE_UNAVAILABLE");
    }

    const durationMinutes = service?.durationMinutes ?? 30;
    const bufferMinutes = service?.bufferMinutes ?? 0;
    const endTime =
      input.endTime || new Date(input.startTime.getTime() + durationMinutes * 60_000);

    const creatorProfile = tx.profile?.findUnique
      ? await tx.profile.findUnique({
          where: { userId: input.creatorId },
          select: { timezone: true },
        })
      : null;
    const creatorTimezone = normalizeTimezone(creatorProfile?.timezone);

    if (!input.skipScheduleCheck && service) {
      const slotParts = getZonedDateParts(input.startTime, creatorTimezone);
      const [rule, exception] = await Promise.all([
        tx.availabilityRule.findFirst({
          where: {
            creatorId: input.creatorId,
            dayOfWeek: slotParts.dayOfWeek,
            isActive: true,
          },
        }),
        tx.availabilityException.findFirst({
          where: { creatorId: input.creatorId, date: slotParts.dateStr },
        }),
      ]);

      const check = isWithinCreatorSchedule({
        startTime: input.startTime,
        durationMinutes,
        creatorTimezone,
        rule: rule || null,
        isBlockedDate: Boolean(exception),
        now,
      });

      if (!check.ok) {
        throw new Error(check.error || "OUTSIDE_SCHEDULE");
      }
    }

    const slotDay = getZonedDateParts(input.startTime, creatorTimezone).dateStr;
    const { dayStartUtc, dayEndUtc } = getUtcBoundsForCreatorDate(slotDay, creatorTimezone);
    const windowStart = new Date(dayStartUtc.getTime() - 4 * 3600_000);
    const windowEnd = new Date(dayEndUtc.getTime() + 12 * 3600_000);

    const existingBookings = tx.appointmentBooking?.findMany
      ? await tx.appointmentBooking.findMany({
          where: {
            creatorId: input.creatorId,
            startTime: { lt: windowEnd },
            endTime: { gt: windowStart },
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            lockedUntil: true,
            bufferMinutes: true,
          },
        })
      : [];

    if (existingBookings.length > 0) {
      const hasConflict = hasBufferedBookingConflict(
        input.startTime,
        endTime,
        bufferMinutes,
        existingBookings,
        now
      );
      if (hasConflict) {
        throw new Error("SLOT_ALREADY_RESERVED");
      }
    } else if (tx.appointmentBooking?.findFirst) {
      const conflict = await tx.appointmentBooking.findFirst({
        where: {
          creatorId: input.creatorId,
          startTime: { lt: endTime },
          endTime: { gt: input.startTime },
          OR: [
            { status: "CONFIRMED" },
            { status: "PENDING_PAYMENT", lockedUntil: { gt: now } },
          ],
        },
      });
      if (conflict) throw new Error("SLOT_ALREADY_RESERVED");
    }

    const price = service?.price ?? 0;
    const sub = tx.userSubscription?.findFirst
      ? await tx.userSubscription.findFirst({
          where: { userId: input.creatorId, status: { in: ["ACTIVE", "TRIAL"] } },
          include: { plan: { include: { quotas: true } } },
        })
      : null;

    const commissionRate = sub?.plan?.quotas?.storeCommissionRate ?? (sub ? 5.0 : 10.0);
    const platformCommission = Math.round(price * (commissionRate / 100) * 100) / 100;
    const creatorNetAmount = Math.round((price - platformCommission) * 100) / 100;

    const { rawToken, tokenHash } = createManageTokenPair();
    const meetingUrl = generateMeetingUrl(
      input.customMeetingUrl ?? service?.meetingLocation,
      service?.meetingType || "ONLINE"
    );

    const booking = await tx.appointmentBooking.create({
      data: {
        serviceId: input.serviceId,
        creatorId: input.creatorId,
        clientName: input.clientName.trim(),
        clientEmail: input.clientEmail.trim().toLowerCase(),
        clientPhone: input.clientPhone?.trim() || null,
        clientNotes: input.clientNotes?.trim() || null,
        clientTimezone: input.clientTimezone || creatorTimezone,
        startTime: input.startTime,
        endTime,
        status: "CONFIRMED",
        lockedUntil: null,
        paymentId: price > 0 ? `pay_${crypto.randomUUID()}` : null,
        gatewayCode: input.gatewayCode || (price > 0 ? "mada" : "free"),
        amountPaid: price,
        platformCommission,
        creatorNetAmount,
        bufferMinutes,
        manageTokenHash: tokenHash,
        meetingUrl,
      },
    });

    await enqueueBookingWebhookTx(tx, input.creatorId, "booking.confirmed", {
      bookingId: booking.id,
      serviceId: booking.serviceId,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      startTime: booking.startTime,
      endTime: booking.endTime,
      amountPaid: price,
      currency: service?.currency || "SAR",
      meetingUrl,
    });

    return { booking, manageToken: rawToken, creatorTimezone };
  });
}
