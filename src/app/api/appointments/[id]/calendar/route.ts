import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import {
  generateIcsCalendarEvent,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  verifyManageToken,
} from "@/features/appointments";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const token =
      req.headers.get("x-manage-token") || url.searchParams.get("token") || "";

    const booking = await prisma.appointmentBooking.findUnique({
      where: { id },
      include: {
        service: true,
        creator: {
          select: {
            id: true,
            username: true,
            profile: { select: { displayName: true } },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "الحجز غير موجود" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const isCreatorOrAdmin =
      session?.user?.id === booking.creatorId || session?.user?.role === "ADMIN";
    const isClientAuthorized = Boolean(token && verifyManageToken(token, booking.manageTokenHash));

    if (!isCreatorOrAdmin && !isClientAuthorized && booking.manageTokenHash) {
      return NextResponse.json({ success: false, error: "غير مصرح بالوصول لتفاصيل الموعد" }, { status: 403 });
    }

    const eventInput = {
      bookingId: booking.id,
      title: `${booking.service?.title || "جلسة استشارية"} | AN LINKS`,
      description: booking.service?.description || undefined,
      startTime: booking.startTime,
      endTime: booking.endTime,
      meetingUrl: booking.meetingUrl,
      meetingType: booking.service?.meetingType || "ONLINE",
      location: booking.service?.meetingLocation,
      status: (booking.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED") as "CONFIRMED" | "CANCELLED",
      sequence: booking.rescheduleCount || 0,
      creatorName:
        booking.creator?.profile?.displayName || booking.creator?.username || undefined,
      clientName: booking.clientName,
    };

    const format = url.searchParams.get("format");
    if (format === "google") {
      return NextResponse.redirect(generateGoogleCalendarUrl(eventInput));
    }
    if (format === "outlook") {
      return NextResponse.redirect(generateOutlookCalendarUrl(eventInput));
    }

    const icsContent = generateIcsCalendarEvent(eventInput);
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="appointment-${booking.id}.ics"`,
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل توليد ملف التقويم";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
