import { prisma } from "@/shared/db";
import { BookingOverviewStats } from "../types/appointments.types";
import { acquireCreatorBookingLock } from "./slot-locker.service";
import { enqueueBookingWebhookTx } from "./booking-notifications.service";

export async function getCreatorBookingsOverview(creatorId: string) {
  const now = new Date();

  const [bookings, services] = await Promise.all([
    prisma.appointmentBooking.findMany({
      where: {
        creatorId,
        NOT: {
          status: "PENDING_PAYMENT",
          lockedUntil: { lte: now },
        },
      },
      select: {
        id: true,
        serviceId: true,
        clientName: true,
        clientEmail: true,
        clientPhone: true,
        clientNotes: true,
        clientTimezone: true,
        startTime: true,
        endTime: true,
        status: true,
        amountPaid: true,
        platformCommission: true,
        creatorNetAmount: true,
        gatewayCode: true,
        meetingUrl: true,
        cancelReason: true,
        rescheduleCount: true,
        createdAt: true,
        service: {
          select: {
            title: true,
            price: true,
            currency: true,
            durationMinutes: true,
            meetingType: true,
            meetingLocation: true,
          },
        },
      },
      orderBy: { startTime: "desc" },
      take: 100,
    }),
    prisma.consultationService.findMany({
      where: { creatorId },
      select: { currency: true },
    }),
  ]);

  const defaultCurrency = services[0]?.currency || "SAR";
  let upcomingConfirmed = 0;
  let completedBookings = 0;
  let totalRevenue = 0;
  let netRevenue = 0;

  for (const b of bookings) {
    if (b.status === "CONFIRMED" || b.status === "COMPLETED") {
      if (b.status === "COMPLETED" || b.startTime <= now) {
        completedBookings++;
      } else {
        upcomingConfirmed++;
      }
      const gross = b.amountPaid > 0 ? b.amountPaid : (b.service?.price ?? 0);
      const net = b.amountPaid > 0 || b.creatorNetAmount > 0 ? b.creatorNetAmount : gross * 0.95;
      totalRevenue += gross;
      netRevenue += net;
    }
  }

  const stats: BookingOverviewStats = {
    totalBookings: bookings.length,
    upcomingConfirmed,
    completedBookings,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    netRevenue: Math.round(netRevenue * 100) / 100,
    currency: defaultCurrency,
  };

  return { bookings, stats };
}

export async function updateCreatorBookingStatus(
  creatorId: string,
  bookingId: string,
  nextStatus: "COMPLETED" | "CANCELLED",
  cancelReason?: string
) {
  return await prisma.$transaction(async (tx) => {
    const booking = await tx.appointmentBooking.findFirst({
      where: { id: bookingId, creatorId },
      include: { service: true },
    });
    if (!booking) throw new Error("BOOKING_NOT_FOUND");

    if (booking.status === "CANCELLED") {
      throw new Error("ALREADY_CANCELLED");
    }
    if (booking.status === "COMPLETED") {
      throw new Error("ALREADY_COMPLETED");
    }
    if (nextStatus === "COMPLETED" && booking.status !== "CONFIRMED") {
      throw new Error("INVALID_TRANSITION: لا يمكن إتمام موعد غير مؤكد");
    }

    await acquireCreatorBookingLock(tx, creatorId);

    const updated = await tx.appointmentBooking.update({
      where: { id: booking.id },
      data: {
        status: nextStatus,
        lockedUntil: null,
        ...(nextStatus === "CANCELLED"
          ? { cancelReason: cancelReason?.trim() || "تم الإلغاء من قبل مقدم الاستشارة" }
          : {}),
      },
      include: { service: true },
    });

    if (nextStatus === "CANCELLED") {
      await enqueueBookingWebhookTx(tx, creatorId, "booking.cancelled", {
        bookingId: updated.id,
        clientName: updated.clientName,
        cancelReason: updated.cancelReason,
      });
    }

    return updated;
  });
}
