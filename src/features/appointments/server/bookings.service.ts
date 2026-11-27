import { prisma } from "@/shared/db";
import { BookingOverviewStats } from "../types/appointments.types";

export async function getCreatorBookingsOverview(creatorId: string) {
  const now = new Date();

  const [bookings, services] = await Promise.all([
    prisma.appointmentBooking.findMany({
      where: {
        creatorId,
        // Exclude abandoned/expired temporary locks
        NOT: {
          status: "PENDING_PAYMENT",
          lockedUntil: { lte: now },
        },
      },
      include: { service: true },
      orderBy: { startTime: "desc" },
      take: 100,
    }),
    prisma.consultationService.findMany({
      where: { creatorId, isActive: true },
      select: { currency: true },
    }),
  ]);

  const defaultCurrency = services[0]?.currency || "SAR";

  let upcomingConfirmed = 0;
  let completedBookings = 0;
  let totalRevenue = 0;

  for (const b of bookings) {
    if (b.status === "CONFIRMED") {
      if (b.startTime > now) {
        upcomingConfirmed++;
      } else {
        completedBookings++;
      }
      totalRevenue += b.service?.price || 0;
    }
  }

  const stats: BookingOverviewStats = {
    totalBookings: bookings.length,
    upcomingConfirmed,
    completedBookings,
    totalRevenue,
    currency: defaultCurrency,
  };

  return { bookings, stats };
}

export async function updateCreatorBookingStatus(
  creatorId: string,
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  const booking = await prisma.appointmentBooking.findFirst({
    where: { id: bookingId, creatorId },
  });

  if (!booking) {
    throw new Error("BOOKING_NOT_FOUND");
  }

  return await prisma.appointmentBooking.update({
    where: { id: bookingId },
    data: {
      status,
      lockedUntil: null,
    },
  });
}
