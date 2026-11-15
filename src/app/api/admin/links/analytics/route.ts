import { NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getAdminPlatformAnalytics } from "@/features/admin/server/admin-links.service";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const analytics = await getAdminPlatformAnalytics();
    return NextResponse.json({
      success: true,
      ...analytics,
      data: analytics,
    });
  } catch (error) {
    console.error("Admin links analytics GET error:", error);
    const message = error instanceof Error ? error.message : "فشل جلب تحليلات المنصات";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

