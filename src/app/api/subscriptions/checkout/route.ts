import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { processPaymentSuccess } from "@/features/subscriptions/services/webhook-lifecycle.service";

interface CheckoutRequestBody {
  planId?: string;
  planSlug?: string;
  billingCycle?: "MONTHLY" | "YEARLY" | "LIFETIME";
  interval?: string;
  currency?: string;
  couponCode?: string;
  gatewayCode?: string;
  gatewayId?: string;
}

const FALLBACK_USD_MAP: Record<string, number> = {
  free: 0,
  creator: 8,
  pro: 14,
  agency: 39,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "غير مصرح، يرجى تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    const body: CheckoutRequestBody | null = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: "صيغة الطلب غير صحيحة" }, { status: 400 });
    }

    const cycle = String(body.billingCycle || body.interval || "MONTHLY").toUpperCase();
    const rawGateway = (body.gatewayCode || body.gatewayId || "mada").trim();
    const currency = (body.currency || "SAR").trim().toUpperCase();

    const plan = body.planId
      ? await prisma.subscriptionPlan.findUnique({ where: { id: body.planId }, include: { prices: true } })
      : body.planSlug
        ? await prisma.subscriptionPlan.findFirst({
            where: { slug: body.planSlug.toLowerCase().trim(), isActive: true },
            include: { prices: true },
          })
        : null;

    if (!plan || !plan.isActive) {
      return NextResponse.json({ success: false, error: "الباقة المطلوبة غير متوفرة أو غير نشطة" }, { status: 400 });
    }

    const gateway =
      (await prisma.paymentGateway.findFirst({
        where: { code: rawGateway, isEnabled: true },
      })) || (await prisma.paymentGateway.findFirst({ where: { isEnabled: true } }));

    if (!gateway) {
      return NextResponse.json({ success: false, error: "بوابة الدفع المطلوبة غير مفعلة" }, { status: 400 });
    }

    if (
      gateway.supportedCurrencies?.length > 0 &&
      !gateway.supportedCurrencies.includes(currency)
    ) {
      return NextResponse.json(
        { success: false, error: `بوابة ${gateway.nameAr} لا تدعم عملة ${currency}` },
        { status: 400 }
      );
    }

    const currConfig = await prisma.currencyConfig.findUnique({ where: { code: currency } });
    const usdToTarget = currConfig?.exchangeRateToUSD
      ? 1 / currConfig.exchangeRateToUSD
      : currency === "USD"
        ? 1.0
        : 3.75;

    const matchedPrice =
      plan.prices?.find(
        (p) => p.currency.toUpperCase() === currency && p.billingCycle.toUpperCase() === cycle && p.isActive !== false
      ) || plan.prices?.find((p) => p.billingCycle.toUpperCase() === cycle && p.isActive !== false);

    let amountSubtotal: number;
    if (matchedPrice) {
      if (matchedPrice.currency.toUpperCase() === currency) {
        amountSubtotal = matchedPrice.amount;
      } else {
        const srcCfg = await prisma.currencyConfig.findUnique({ where: { code: matchedPrice.currency.toUpperCase() } });
        const usdVal = matchedPrice.currency.toUpperCase() === "USD"
          ? matchedPrice.amount
          : matchedPrice.amount * (srcCfg?.exchangeRateToUSD || 0.2667);
        amountSubtotal = Math.round(usdVal * usdToTarget * 100) / 100;
      }
    } else {
      const baseUsd = FALLBACK_USD_MAP[plan.slug.toLowerCase()] ?? 14;
      const mult = cycle === "YEARLY" ? 10 : 1;
      amountSubtotal = Math.round(baseUsd * mult * usdToTarget * 100) / 100;
    }

    let discountAmount = 0;
    let validCouponCode: string | undefined;
    if (body.couponCode && typeof body.couponCode === "string" && body.couponCode.trim()) {
      const code = body.couponCode.trim().toUpperCase();
      const coupon = await prisma.promotionCoupon.findUnique({ where: { code } });
      const now = new Date();
      const userUses =
        coupon && typeof prisma.userSubscription?.count === "function"
          ? await prisma.userSubscription.count({ where: { userId, couponCode: code } })
          : 0;

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.validFrom || new Date(coupon.validFrom) <= now) &&
        (!coupon.validUntil || new Date(coupon.validUntil) >= now) &&
        (coupon.maxUses === null || coupon.maxUses === undefined || coupon.usedCount < coupon.maxUses) &&
        userUses < (coupon.maxUsesPerUser || 1)
      ) {
        const allowedPlans = coupon.applicablePlanSlugs;
        const isPlanAllowed =
          !allowedPlans ||
          allowedPlans.length === 0 ||
          allowedPlans.some((s) => s.trim().toLowerCase() === plan.slug.trim().toLowerCase());

        if (isPlanAllowed) {
          discountAmount =
            coupon.discountType === "PERCENTAGE"
              ? (amountSubtotal * coupon.discountValue) / 100
              : Math.min(coupon.discountValue, amountSubtotal);
          discountAmount = Math.round(discountAmount * 100) / 100;
          validCouponCode = code;
        }
      }
    }

    const amountTotal = Math.max(0, Math.round((amountSubtotal - discountAmount) * 100) / 100);
    if (gateway.isTestMode === false && amountTotal > 0) {
      return NextResponse.json(
        { success: false, error: "تتطلب بوابات الدفع الحية إتمام جلسة مزود الدفع الخارجي" },
        { status: 402 }
      );
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const gatewayTxId = `tx_${gateway.code}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + (cycle === "YEARLY" ? 365 : 30));

    const shouldInstantActivate =
      amountTotal === 0 || (gateway.isTestMode === true && process.env.NODE_ENV !== "production");

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
        status: shouldInstantActivate ? "PAID" : "PENDING",
        ...(shouldInstantActivate ? { paidAt: now } : {}),
        gatewayCode: gateway.code,
        gatewayTxId,
      },
    });

    if (shouldInstantActivate) {
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
        couponCode: validCouponCode,
      });
    }

    return NextResponse.json({
      success: true,
      activated: shouldInstantActivate,
      isSandbox: Boolean(gateway.isTestMode),
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
    return NextResponse.json({ success: false, error: "فشل في إنشاء جلسة الدفع" }, { status: 500 });
  }
}
