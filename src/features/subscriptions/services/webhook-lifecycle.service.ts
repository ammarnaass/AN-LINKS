import { prisma } from "@/shared/db";

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
  return await prisma.$transaction(async (tx) => {
    // 1. Mark invoice as PAID
    await tx.financialInvoice.update({
      where: { id: params.invoiceId },
      data: {
        status: "PAID",
        paidAt: params.now,
      },
    });

    // 2. Resolve plan to check slug
    let planSlug = "";
    if (params.planId) {
      const plan = await tx.subscriptionPlan.findUnique({
        where: { id: params.planId },
      });
      if (plan) {
        planSlug = plan.slug;
      }
    }

    // 3. Upsert UserSubscription
    if (params.planId) {
      await tx.userSubscription.upsert({
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
        },
      });
    }

    // 4. Update user role to "PRO" if plan slug is not "free"
    if (planSlug && planSlug !== "free") {
      await tx.user.update({
        where: { id: params.userId },
        data: { role: "PRO" },
      });
    }

    // 5. If coupon code exists, increment coupon usedCount
    if (params.couponCode && typeof params.couponCode === "string") {
      await tx.promotionCoupon.updateMany({
        where: { code: params.couponCode.trim().toUpperCase() },
        data: { usedCount: { increment: 1 } },
      });
    }
  });
}

export async function processPaymentFailure(invoiceId: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    // Mark invoice as FAILED
    await tx.financialInvoice.update({
      where: { id: invoiceId },
      data: { status: "FAILED" },
    });

    // Mark user subscription as PAST_DUE
    await tx.userSubscription.updateMany({
      where: { userId },
      data: { status: "PAST_DUE" },
    });
  });
}

export async function processSubscriptionCancellation(
  userId: string,
  options?: { immediate?: boolean }
) {
  return await prisma.$transaction(async (tx) => {
    // Mark subscription as CANCELED
    await tx.userSubscription.updateMany({
      where: { userId },
      data: {
        status: "CANCELED",
        cancelAtPeriodEnd: true,
      },
    });

    // If immediate cancellation requested, downgrade user role to USER
    if (options?.immediate) {
      await tx.user.update({
        where: { id: userId },
        data: { role: "USER" },
      });
    }
  });
}
