import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAdminCoupons,
  createAdminCoupon,
} from "@/features/admin/server/admin-financials.service";
import { CreateCouponInput } from "@/features/admin/types/admin.types";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const data = await getAdminCoupons();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل جلب كوبونات الخصم";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body: CreateCouponInput = await request.json();
    if (!body || !body.code || !body.discountType || body.discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: "بيانات الكوبون غير مكتملة (الرمز ونوع وقيمة الخصم مطلوبة)" },
        { status: 400 }
      );
    }

    const coupon = await createAdminCoupon(body, guard.user.id);
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل إنشاء كوبون الخصم";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
