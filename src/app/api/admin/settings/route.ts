import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getPlatformSettings, updatePlatformSettings } from "@/features/admin/services/admin.service";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const settings = getPlatformSettings();
  return NextResponse.json({ success: true, settings }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body = await request.json();
    const result = updatePlatformSettings(body);
    return NextResponse.json(
      { success: true, message: "تم تحديث إعدادات المنصة بنجاح", settings: result.settings },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "فشل في معالجة طلب تحديث الإعدادات" },
      { status: 400 }
    );
  }
}
