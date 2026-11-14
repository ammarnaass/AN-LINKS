import { NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getPlatformAnalyticsData } from "@/features/admin/services/admin.service";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const analytics = await getPlatformAnalyticsData();
    return NextResponse.json({ success: true, analytics }, { status: 200 });
  } catch (error) {
    console.error("Admin analytics fetch error:", error);
    return NextResponse.json(
      { success: false, error: "فشل في جلب إحصائيات المنصة" },
      { status: 500 }
    );
  }
}
