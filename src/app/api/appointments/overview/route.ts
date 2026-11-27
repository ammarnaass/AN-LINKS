import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getCreatorBookingsOverview,
  getCreatorServices,
  getCreatorAvailabilityConfig,
  getCreatorAppointmentQuota,
} from "@/features/appointments";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const creatorId = session.user.id;

    const [{ bookings, stats }, services, availConfig, quota] = await Promise.all([
      getCreatorBookingsOverview(creatorId),
      getCreatorServices(creatorId),
      getCreatorAvailabilityConfig(creatorId),
      getCreatorAppointmentQuota(creatorId),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      bookings,
      services,
      availability: availConfig.availability,
      timezone: availConfig.timezone,
      exceptions: availConfig.exceptions,
      quota,
    });
  } catch (error) {
    console.error("Appointments overview error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب بيانات المواعيد" },
      { status: 500 }
    );
  }
}
