import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import {
  updateCreatorBookingStatus,
  dispatchBookingSideEffects,
  normalizeTimezone,
} from "@/features/appointments";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (body.status !== "COMPLETED" && body.status !== "CANCELLED") {
      return NextResponse.json(
        { success: false, error: "حالة الموعد غير صالحة" },
        { status: 400 }
      );
    }

    const updated = await updateCreatorBookingStatus(
      session.user.id,
      id,
      body.status,
      body.cancelReason
    );

    if (body.status === "CANCELLED") {
      const creator = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, username: true, profile: { select: { displayName: true, timezone: true } } },
      });

      await dispatchBookingSideEffects({
        kind: "cancelled",
        bookingId: updated.id,
        clientName: updated.clientName,
        clientEmail: updated.clientEmail,
        creatorEmail: creator?.email,
        creatorName: creator?.profile?.displayName || creator?.username || "مقدم الاستشارة",
        serviceTitle: updated.service?.title || "جلسة استشارية",
        startTime: updated.startTime,
        endTime: updated.endTime,
        creatorTimezone: normalizeTimezone(creator?.profile?.timezone),
        cancelReason: updated.cancelReason,
      });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تحديث حالة الموعد";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
