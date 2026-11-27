import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getCreatorBookingsOverview,
  getCreatorServices,
  getCreatorAvailability,
} from "@/features/appointments";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const creatorId = session.user.id;

    const [{ bookings, stats }, services, availability] = await Promise.all([
      getCreatorBookingsOverview(creatorId),
      getCreatorServices(creatorId),
      getCreatorAvailability(creatorId),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      bookings,
      services,
      availability,
    });
  } catch (error) {
    console.error("Appointments overview error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب بيانات المواعيد" },
      { status: 500 }
    );
  }
}
