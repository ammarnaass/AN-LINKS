import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

interface CheckoutRequestBody {
  planId?: string;
  billingCycle?: "MONTHLY" | "YEARLY" | "LIFETIME";
  currency?: string;
  couponCode?: string;
  gatewayCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "غير مصرح، يرجى تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // 2. Parse body
    let body: CheckoutRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "صيغة الطلب غير صحيحة" },
        { status: 400 }
      );
    }

    const { planId, billingCycle, gatewayCode, currency: rawCurrency, couponCode } = body;

    if (!planId || !billingCycle || !gatewayCode) {
      return NextResponse.json(
        { success: false, error: "بيانات الاشتراك غير مكتملة" },
        { status: 400 }
      );
    }

    // 3. Verify plan exists and is active
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: { prices: true },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { success: false, error: "الباقة المطلوبة غير متوفرة أو غير نشطة" },
        { status: 400 }
      );
    }

    // 4. Verify gateway exists and is enabled
    const gateway = await prisma.paymentGateway.findUnique({
      where: { code: gatewayCode },
    });

    if (!gateway || !gateway.isEnabled) {
      return NextResponse.json(
        { success: false, error: "بوابة الدفع المحددة غير مفعلة أو غير متوفرة" },
        { status: 400 }
      );
    }

    // 5. Determine currency & base price
    const currency = (rawCurrency || "SAR").trim().toUpperCase();
    const matchedPrice =
      plan.prices?.find(
        (p) =>
          p.currency.toUpperCase() === currency &&
          p.billingCycle.toUpperCase() === billingCycle.toUpperCase() &&
          p.isActive !== false
      ) ||
      plan.prices?.find(
        (p) =>
          p.billingCycle.toUpperCase() === billingCycle.toUpperCase() &&
          p.isActive !== false
      );

    const amountSubtotal = matchedPrice ? matchedPrice.amount : 0;

    // 6. Validate coupon if provided
    let discountAmount = 0;
    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const code = couponCode.trim().toUpperCase();
      const coupon = await prisma.promotionCoupon.findUnique({ where: { code } });
      const now = new Date();

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.validFrom || new Date(coupon.validFrom) <= now) &&
        (!coupon.validUntil || new Date(coupon.validUntil) >= now) &&
        (coupon.maxUses === null || coupon.maxUses === undefined || coupon.usedCount < coupon.maxUses)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allowedPlans = coupon.applicablePlanSlugs || (coupon as any).allowedPlans;
        const isPlanAllowed =
          !allowedPlans ||
          allowedPlans.length === 0 ||
          allowedPlans.some(
            (s: string) => s.trim().toLowerCase() === plan.slug.trim().toLowerCase()
          );

        if (isPlanAllowed) {
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (amountSubtotal * coupon.discountValue) / 100;
          } else {
            // FIXED_AMOUNT
            discountAmount = Math.min(coupon.discountValue, amountSubtotal);
          }
          discountAmount = Math.round(discountAmount * 100) / 100;
        }
      }
    }

    const amountTotal = Math.max(0, Math.round((amountSubtotal - discountAmount) * 100) / 100);

    // 7. Generate invoice number and gateway transaction ID
    const invoiceNumber = `INV-${Date.now()}`;
    const gatewayTxId = `tx_${gatewayCode}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 8. Create pending invoice
    const invoice = await prisma.financialInvoice.create({
      data: {
        userId,
        planId: plan.id,
        billingCycle,
        invoiceNumber,
        amountSubtotal,
        discountAmount,
        taxAmount: 0.0,
        amountTotal,
        currency,
        status: "PENDING",
        gatewayCode,
        gatewayTxId,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: `/checkout/session/${invoice.id}`,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amountTotal: invoice.amountTotal,
        currency: invoice.currency,
      },
      gatewayTxId,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, error: "فشل في إنشاء جلسة الدفع" },
      { status: 500 }
    );
  }
}
