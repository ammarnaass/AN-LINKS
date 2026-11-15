import { NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { getFinancialOverview } from "@/features/admin/server/admin-financials.service";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const data = await getFinancialOverview();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "فشل جلب النظرة العامة للبيانات المالية";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
