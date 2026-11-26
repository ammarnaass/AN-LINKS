import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import {
  generateIcsCalendarEvent,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
} from "@/features/appointments";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.appointmentBooking.findUnique({
      where: { id },
      include: {
        service: true,
        creator: {
          select: {
            username: true,
            profile: { select: { displayName: true } },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "الحجز غير موجود" },
        { status: 404 }
      );
    }

    const eventInput = {
      bookingId: booking.id,
      title: `${booking.service?.title || "جلسة استشارية"} | AN LINKS`,
      description: booking.service?.description || undefined,
      startTime: booking.startTime,
      endTime: booking.endTime,
      meetingUrl: booking.meetingUrl || undefined,
      creatorName:
        booking.creator?.profile?.displayName ||
        booking.creator?.username ||
        undefined,
      clientName: booking.clientName,
    };

    const url = new URL(req.url);
    const format = url.searchParams.get("format");

    if (format === "google") {
      const googleUrl = generateGoogleCalendarUrl(eventInput);
      return NextResponse.redirect(googleUrl);
    }

    if (format === "outlook") {
      const outlookUrl = generateOutlookCalendarUrl(eventInput);
      return NextResponse.redirect(outlookUrl);
    }

    const icsContent = generateIcsCalendarEvent(eventInput);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="appointment-${booking.id}.ics"`,
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل توليد ملف التقويم";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
