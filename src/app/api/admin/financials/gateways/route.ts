import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAdminGateways,
  updateAdminGateway,
} from "@/features/admin/server/admin-financials.service";
import { UpdateGatewayInput } from "@/features/admin/types/admin.types";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const data = await getAdminGateways();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل جلب بوابات الدفع";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body: UpdateGatewayInput = await request.json();
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: "معرف بوابة الدفع مطلوب" },
        { status: 400 }
      );
    }

    const updated = await updateAdminGateway(body.id, body, guard.user.id);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "فشل تحديث بوابة الدفع";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
