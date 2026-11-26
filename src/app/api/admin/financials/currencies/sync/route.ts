import { NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { syncAllCurrencyRates } from "@/features/subscriptions";

export async function POST() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const result = await syncAllCurrencyRates(guard.user.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل مزامنة أسعار الصرف الحية";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
