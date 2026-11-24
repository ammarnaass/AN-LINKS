import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  getActiveSubscription,
  cancelSubscriptionAtPeriodEnd,
  getUserInvoices,
} from "@/features/settings/server/subscription.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const [subscription, invoices] = await Promise.all([
      getActiveSubscription(session.user.id),
      getUserInvoices(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      data: { subscription, invoices },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل جلب بيانات الاشتراك والفواتير";
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
    const { action } = body;

    if (action === "cancel") {
      const canceled = await cancelSubscriptionAtPeriodEnd(session.user.id);
      return NextResponse.json({
        success: true,
        data: canceled,
        message: "تم تعيين إلغاء الاشتراك بنهاية الفترة الحالية بنجاح",
      });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تعديل حالة الاشتراك";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
