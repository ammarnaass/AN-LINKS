import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { updateCreatorBookingStatus } from "@/features/appointments";

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

    if (body.status !== "CONFIRMED" && body.status !== "CANCELLED") {
      return NextResponse.json(
        { success: false, error: "حالة الموعد غير صالحة" },
        { status: 400 }
      );
    }

    const updated = await updateCreatorBookingStatus(
      session.user.id,
      id,
      body.status
    );

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("Update booking status error:", error);
    return NextResponse.json(
      { success: false, error: "فشل تحديث حالة الموعد" },
      { status: 500 }
    );
  }
}
