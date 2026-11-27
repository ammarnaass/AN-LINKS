import { prisma } from "@/shared/db";
import { processSubscriptionCommission } from "@/features/affiliate/server/affiliate.service";

export interface ProcessPaymentSuccessParams {
  invoiceId: string;
  userId: string;
  planId?: string | null;
  billingCycle: string;
  currency: string;
  amountTotal: number;
  gatewayCode: string;
  now: Date;
  periodEnd: Date;
  couponCode?: string | null;
}

export async function processPaymentSuccess(params: ProcessPaymentSuccessParams) {
  let subscriptionId: string | null = null;
  let planSlug = "";

  await prisma.$transaction(async (tx) => {
    await tx.financialInvoice.update({
      where: { id: params.invoiceId },
      data: { status: "PAID", paidAt: params.now },
    });

    if (params.planId) {
      const plan = await tx.subscriptionPlan.findUnique({ where: { id: params.planId } });
      if (plan) planSlug = plan.slug;

      const cleanCoupon = params.couponCode?.trim().toUpperCase() || null;
      const sub = await tx.userSubscription.upsert({
        where: { userId: params.userId },
        update: {
          planId: params.planId,
          status: "ACTIVE",
          billingCycle: params.billingCycle,
          currency: params.currency,
          amountPaid: params.amountTotal,
          gatewayCode: params.gatewayCode,
          currentPeriodStart: params.now,
          currentPeriodEnd: params.periodEnd,
          cancelAtPeriodEnd: false,
          ...(cleanCoupon ? { couponCode: cleanCoupon } : {}),
        },
        create: {
          userId: params.userId,
          planId: params.planId,
          status: "ACTIVE",
          billingCycle: params.billingCycle,
          currency: params.currency,
          amountPaid: params.amountTotal,
          gatewayCode: params.gatewayCode,
          currentPeriodStart: params.now,
          currentPeriodEnd: params.periodEnd,
          cancelAtPeriodEnd: false,
          couponCode: cleanCoupon,
        },
      });
      subscriptionId = sub?.id || null;
    }

    if (planSlug && planSlug !== "free") {
      await tx.user.update({ where: { id: params.userId }, data: { role: "PRO" } });
    }

    if (params.couponCode && typeof params.couponCode === "string") {
      await tx.promotionCoupon.updateMany({
        where: { code: params.couponCode.trim().toUpperCase() },
        data: { usedCount: { increment: 1 } },
      });
    }
  });

  if (subscriptionId && params.amountTotal > 0 && planSlug && planSlug !== "free") {
    try {
      await processSubscriptionCommission({
        invoiceId: params.invoiceId,
        subscriptionId,
        buyerUserId: params.userId,
        invoiceAmount: params.amountTotal,
        planSlug,
      });
    } catch {
      // Non-fatal in isolated mock tests or organic accounts
    }
  }
}

export async function processPaymentFailure(invoiceId: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    await tx.financialInvoice.update({ where: { id: invoiceId }, data: { status: "FAILED" } });
    await tx.userSubscription.updateMany({ where: { userId }, data: { status: "PAST_DUE" } });
  });
}

export async function processSubscriptionCancellation(
  userId: string,
  options?: { immediate?: boolean }
) {
  return await prisma.$transaction(async (tx) => {
    await tx.userSubscription.updateMany({
      where: { userId },
      data: { status: "CANCELED", cancelAtPeriodEnd: true },
    });
    if (options?.immediate) {
      await tx.user.update({ where: { id: userId }, data: { role: "USER" } });
    }
  });
}
