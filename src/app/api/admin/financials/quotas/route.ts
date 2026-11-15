import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { updateAdminPlanQuotas } from "@/features/admin/server/admin-financials.service";
import { UpsertQuotaInput } from "@/features/admin/types/admin.types";

export async function PUT(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body: UpsertQuotaInput = await request.json();
    if (!body || !body.planId) {
      return NextResponse.json(
        { success: false, error: "معرف الباقة planId مطلوب" },
        { status: 400 }
      );
    }

    const updated = await updateAdminPlanQuotas(body.planId, body, guard.user.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل تحديث حصص الباقة ومميزاتها";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
