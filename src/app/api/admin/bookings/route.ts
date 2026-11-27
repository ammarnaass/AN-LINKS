import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { updateCreatorBookingStatus } from "@/features/appointments";

export async function GET(req: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const url = new URL(req.url);
    const search = (url.searchParams.get("search") || "").trim();
    const statusFilter = (url.searchParams.get("status") || "ALL").toUpperCase();

    const whereClause: any = {};
    if (statusFilter !== "ALL") {
      whereClause.status = statusFilter;
    }
    if (search) {
      whereClause.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { clientEmail: { contains: search, mode: "insensitive" } },
        { creator: { username: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [bookings, totalServices, allPaidBookings, currencies] = await Promise.all([
      prisma.appointmentBooking.findMany({
        where: whereClause,
        select: {
          id: true,
          clientName: true,
          clientEmail: true,
          startTime: true,
          endTime: true,
          status: true,
          amountPaid: true,
          platformCommission: true,
          creatorNetAmount: true,
          gatewayCode: true,
          createdAt: true,
          service: { select: { title: true, price: true, currency: true, durationMinutes: true, meetingType: true } },
          creator: { select: { id: true, username: true, profile: { select: { displayName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.consultationService.count({ where: { isActive: true } }),
      prisma.appointmentBooking.findMany({
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        select: {
          amountPaid: true,
          platformCommission: true,
          status: true,
          service: { select: { price: true, currency: true } },
        },
      }),
      prisma.currencyConfig.findMany({ select: { code: true, exchangeRateToUSD: true } }),
    ]);

    const sarRate = currencies.find((c) => c.code === "SAR")?.exchangeRateToUSD || 0.2667;
    const toSar = (amount: number, currency: string) => {
      if (currency === "SAR") return amount;
      const r = currencies.find((c) => c.code === currency)?.exchangeRateToUSD || 1;
      return (amount * r) / sarRate;
    };

    let totalGmvSar = 0;
    let totalCommissionSar = 0;
    let completedCount = 0;
    for (const b of allPaidBookings) {
      const cur = b.service?.currency || "SAR";
      const gross = b.amountPaid > 0 ? b.amountPaid : (b.service?.price ?? 0);
      totalGmvSar += toSar(gross, cur);
      totalCommissionSar += toSar(b.platformCommission || 0, cur);
      if (b.status === "COMPLETED") completedCount++;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings: bookings.length,
        confirmedOrCompleted: allPaidBookings.length,
        completedCount,
        totalServices,
        totalGmvSar: Math.round(totalGmvSar * 100) / 100,
        totalCommissionSar: Math.round(totalCommissionSar * 100) / 100,
      },
      bookings,
    });
  } catch (error) {
    console.error("Admin bookings GET error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب سجلات المواعيد" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const { bookingId, action, cancelReason } = body;
    if (!bookingId || action !== "cancel") {
      return NextResponse.json({ success: false, error: "معرف الحجز والإجراء مطلوبان" }, { status: 400 });
    }

    const row = await prisma.appointmentBooking.findUnique({
      where: { id: bookingId },
      select: { creatorId: true },
    });
    if (!row) {
      return NextResponse.json({ success: false, error: "الحجز غير موجود" }, { status: 404 });
    }

    const updated = await updateCreatorBookingStatus(
      row.creatorId,
      bookingId,
      "CANCELLED",
      cancelReason || "إلغاء إداري من مشغل المنصة"
    );

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تحديث الحجز";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
