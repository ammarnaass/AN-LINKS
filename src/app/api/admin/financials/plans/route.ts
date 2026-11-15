import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAdminPlans,
  upsertAdminPlan,
} from "@/features/admin/server/admin-financials.service";
import { UpsertPlanInput } from "@/features/admin/types/admin.types";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const data = await getAdminPlans();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل جلب باقات الاشتراك";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body: UpsertPlanInput = await request.json();
    if (!body || !body.slug || !body.nameAr || !body.nameEn) {
      return NextResponse.json(
        { success: false, error: "بيانات الباقة غير مكتملة (المعرف والاسم بالعربية والإنجليزية مطلوبة)" },
        { status: 400 }
      );
    }

    const plan = await upsertAdminPlan(body, guard.user.id);
    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل إنشاء باقة الاشتراك";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
