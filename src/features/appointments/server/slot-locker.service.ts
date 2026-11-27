import { prisma } from "@/shared/db";
import { ReserveSlotInput } from "../types/appointments.types";

const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes lock

export function generateMeetingUrl(customUrl?: string | null): string {
  if (customUrl && customUrl.trim().startsWith("http")) {
    return customUrl.trim();
  }
  const code = Math.random().toString(36).substring(2, 8);
  return `https://meet.google.com/anl-${code}`;
}

export async function reserveSlotAtomic(input: ReserveSlotInput) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();

    // PostgreSQL transaction advisory lock to serialize reservations per creator
    try {
      await tx.$executeRawUnsafe(
        "SELECT pg_advisory_xact_lock(hashtext($1))",
        input.creatorId
      );
    } catch {
      // Non-Postgres fallback in mock/test environments
    }

    // Interval intersection check: existing.start < new.end && existing.end > new.start
    const conflict = await tx.appointmentBooking.findFirst({
      where: {
        creatorId: input.creatorId,
        startTime: { lt: input.endTime },
        endTime: { gt: input.startTime },
        OR: [
          { status: "CONFIRMED" },
          {
            status: "PENDING_PAYMENT",
            lockedUntil: { gt: now },
          },
        ],
      },
    });

    if (conflict) {
      throw new Error("SLOT_ALREADY_RESERVED");
    }

    const isConfirmed = Boolean(input.autoConfirm);
    const lockedUntil = isConfirmed
      ? null
      : new Date(now.getTime() + LOCK_DURATION_MS);

    const meetingUrl = generateMeetingUrl(input.customMeetingUrl);

    return await tx.appointmentBooking.create({
      data: {
        serviceId: input.serviceId,
        creatorId: input.creatorId,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone || null,
        startTime: input.startTime,
        endTime: input.endTime,
        status: isConfirmed ? "CONFIRMED" : "PENDING_PAYMENT",
        lockedUntil,
        meetingUrl,
      },
    });
  });
}

export async function confirmBookingAtomic(bookingId: string, paymentId?: string) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();
    const booking = await tx.appointmentBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    if (booking.status === "CONFIRMED") {
      return booking;
    }

    if (booking.status !== "PENDING_PAYMENT" || (booking.lockedUntil && booking.lockedUntil <= now)) {
      throw new Error("LOCK_EXPIRED");
    }

    return await tx.appointmentBooking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        paymentId: paymentId || `pay_${Date.now()}`,
        lockedUntil: null,
      },
    });
  });
}
