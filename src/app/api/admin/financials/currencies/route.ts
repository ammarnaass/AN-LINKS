import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAdminCurrencies,
  updateAdminCurrency,
} from "@/features/admin/server/admin-financials.service";
import { UpdateCurrencyInput } from "@/features/admin/types/admin.types";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const data = await getAdminCurrencies();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل جلب إعدادات العملات";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body: UpdateCurrencyInput = await request.json();
    if (!body || !body.code) {
      return NextResponse.json(
        { success: false, error: "رمز العملة code مطلوب" },
        { status: 400 }
      );
    }

    const updated = await updateAdminCurrency(body.code, body, guard.user.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل تحديث إعدادات العملة";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
