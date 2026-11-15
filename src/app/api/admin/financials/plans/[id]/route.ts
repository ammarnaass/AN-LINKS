import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  upsertAdminPlan,
  deleteAdminPlan,
} from "@/features/admin/server/admin-financials.service";
import { UpsertPlanInput } from "@/features/admin/types/admin.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const body: UpsertPlanInput = await request.json();
    body.id = id;

    const plan = await upsertAdminPlan(body, guard.user.id);
    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل تحديث باقة الاشتراك";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  const { id } = await params;
  try {
    const result = await deleteAdminPlan(id, guard.user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل حذف أو تعطيل باقة الاشتراك";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
