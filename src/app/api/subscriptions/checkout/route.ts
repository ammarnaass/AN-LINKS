import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { processPaymentSuccess } from "@/features/subscriptions/services/webhook-lifecycle.service";

interface CheckoutRequestBody {
  planId?: string;
  planSlug?: string;
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

    const {
      planId,
      planSlug,
      billingCycle = "MONTHLY",
      gatewayCode = "mada",
      currency: rawCurrency,
      couponCode,
    } = body;

    // 3. Resolve plan by ID or by Slug
    const plan = planId
      ? await prisma.subscriptionPlan.findUnique({
          where: { id: planId },
          include: { prices: true },
        })
      : planSlug
        ? await prisma.subscriptionPlan.findFirst({
            where: { slug: planSlug.toLowerCase().trim(), isActive: true },
            include: { prices: true },
          })
        : null;

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { success: false, error: "الباقة المطلوبة غير متوفرة أو غير نشطة" },
        { status: 400 }
      );
    }

    // 4. Verify gateway exists
    const gateway = await prisma.paymentGateway.findFirst({
      where: { code: gatewayCode, isEnabled: true },
    }) || await prisma.paymentGateway.findFirst({
      where: { isEnabled: true },
    });

    if (!gateway) {
      return NextResponse.json(
        { success: false, error: "لا توجد بوابات دفع مفعلة حالياً" },
        { status: 400 }
      );
    }

    // 5. Determine currency & base price
    const currency = (rawCurrency || "SAR").trim().toUpperCase();
    const cycle = (billingCycle || "MONTHLY").toUpperCase();

    const matchedPrice =
      plan.prices?.find(
        (p) =>
          p.currency.toUpperCase() === currency &&
          p.billingCycle.toUpperCase() === cycle &&
          p.isActive !== false
      ) ||
      plan.prices?.find(
        (p) =>
          p.billingCycle.toUpperCase() === cycle &&
          p.isActive !== false
      );

    const amountSubtotal = matchedPrice ? matchedPrice.amount : (plan.slug === "pro" ? 49 : plan.slug === "agency" ? 149 : 0);

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
            discountAmount = Math.min(coupon.discountValue, amountSubtotal);
          }
          discountAmount = Math.round(discountAmount * 100) / 100;
        }
      }
    }

    const amountTotal = Math.max(0, Math.round((amountSubtotal - discountAmount) * 100) / 100);

    // 7. Generate invoice & transaction
    const invoiceNumber = `INV-${Date.now()}`;
    const gatewayTxId = `tx_${gateway.code}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const periodEnd = new Date(now);
    if (cycle === "YEARLY") {
      periodEnd.setDate(periodEnd.getDate() + 365);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 30);
    }

    const invoice = await prisma.financialInvoice.create({
      data: {
        userId,
        planId: plan.id,
        billingCycle: cycle,
        invoiceNumber,
        amountSubtotal,
        discountAmount,
        taxAmount: 0.0,
        amountTotal,
        currency,
        status: gateway.isTestMode ? "PAID" : "PENDING",
        paidAt: gateway.isTestMode ? now : null,
        gatewayCode: gateway.code,
        gatewayTxId,
      },
    });

    // 8. Auto-activate subscription if gateway is in test mode or zero amount
    if (gateway.isTestMode || amountTotal === 0) {
      await processPaymentSuccess({
        invoiceId: invoice.id,
        userId,
        planId: plan.id,
        billingCycle: cycle,
        currency,
        amountTotal,
        gatewayCode: gateway.code,
        now,
        periodEnd,
        couponCode,
      });
    }

    return NextResponse.json({
      success: true,
      activated: gateway.isTestMode || amountTotal === 0,
      checkoutUrl: `/dashboard/settings?tab=subscription&invoice=${invoice.id}`,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amountTotal: invoice.amountTotal,
        currency: invoice.currency,
        planName: plan.nameAr,
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
