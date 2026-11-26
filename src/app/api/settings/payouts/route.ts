import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getPayoutProfile,
  updatePayoutProfile,
  getPayoutBalance,
  requestPayout,
  getPayoutHistory,
} from "@/features/settings/server/payouts.service";
import { getCreatorAffiliateSummary } from "@/features/affiliate/server/affiliate.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const [profile, balance, history, affiliate] = await Promise.all([
      getPayoutProfile(session.user.id),
      getPayoutBalance(session.user.id),
      getPayoutHistory(session.user.id),
      getCreatorAffiliateSummary(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      data: { profile, balance, history, affiliate },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل جلب بيانات تحصيل الأرباح";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { action, iban, beneficiaryName, amount } = body;

    if (action === "update-iban") {
      const updated = await updatePayoutProfile(session.user.id, iban, beneficiaryName);
      return NextResponse.json({ success: true, data: updated, message: "تم حفظ بيانات الحساب البنكي بنجاح" });
    }

    if (action === "withdraw") {
      const payout = await requestPayout(session.user.id, Number(amount));
      return NextResponse.json({ success: true, data: payout, message: "تم إرسال طلب السحب بنجاح وهو قيد المعالجة" });
    }

    return NextResponse.json({ success: false, error: "إجراء غير صالح" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل معالجة طلب تحصيل الأرباح";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
