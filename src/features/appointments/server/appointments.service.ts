import { prisma } from "@/shared/db";
import { ReserveSlotInput } from "../types/appointments.types";

const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes lock

export async function reserveSlotAtomic(input: ReserveSlotInput) {
  return await prisma.$transaction(async (tx) => {
    const now = new Date();

    // Check for conflicting active reservations
    const conflict = await tx.appointmentBooking.findFirst({
      where: {
        creatorId: input.creatorId,
        startTime: input.startTime,
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

    const lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS);

    return await tx.appointmentBooking.create({
      data: {
        serviceId: input.serviceId,
        creatorId: input.creatorId,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone,
        startTime: input.startTime,
        endTime: input.endTime,
        status: "PENDING_PAYMENT",
        lockedUntil,
      },
    });
  });
}

export async function confirmBooking(bookingId: string, paymentId: string) {
  const meetingCode = Math.random().toString(36).substring(2, 8);
  const meetingUrl = `https://meet.google.com/anl-${meetingCode}`;

  return await prisma.appointmentBooking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
      paymentId,
      lockedUntil: null,
      meetingUrl,
    },
  });
}

export async function getCreatorAppointments(creatorId: string) {
  return await prisma.appointmentBooking.findMany({
    where: { creatorId },
    include: { service: true },
    orderBy: { startTime: "desc" },
    take: 50,
  });
}
