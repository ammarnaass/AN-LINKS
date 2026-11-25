import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { getActiveNotificationsForUser } from "@/features/notifications/server/notification.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = Boolean(session?.user);
    const role = session?.user?.role || "USER";

    const notifications = await getActiveNotificationsForUser({
      role,
      isAuthenticated,
    });

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("GET /api/notifications/active error:", error);
    return NextResponse.json(
      { success: false, error: "تعذر جلب الإشعارات النشطة" },
      { status: 500 }
    );
  }
}
