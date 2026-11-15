import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  toggleAdminCoupon,
  deleteAdminCoupon,
} from "@/features/admin/server/admin-financials.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const body = await request.json();
    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "حقل isActive مطلوب ويجب أن يكون قيمة منطقية" },
        { status: 400 }
      );
    }

    const updated = await toggleAdminCoupon(id, body.isActive, guard.user.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل تعديل حالة الكوبون";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const result = await deleteAdminCoupon(id, guard.user.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل حذف الكوبون";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
