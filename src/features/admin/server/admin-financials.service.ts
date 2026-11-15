import { prisma } from "@/shared/db";
import { Prisma } from "@prisma/client";
import { encryptSecret } from "@/shared/lib/crypto";
import {
  AdminGatewayDetails,
  UpdateGatewayInput,
  AdminSubscriptionPlanItem,
  UpsertPlanInput,
  UpsertQuotaInput,
  AdminCurrencyItem,
  UpdateCurrencyInput,
  AdminCouponItem,
  CreateCouponInput,
  FinancialOverviewStats,
  AdminTransactionsQuery,
  AdminTransactionsResult,
  AdminTransactionItem,
} from "../types/admin.types";

/**
 * 1. Financial Overview Summary
 * Computes high-level counts and total paid revenue.
 */
export async function getFinancialOverview(): Promise<FinancialOverviewStats> {
  const [
    totalGateways,
    activeGateways,
    totalPlans,
    totalCurrencies,
    totalCoupons,
    totalInvoices,
    paidAggregate,
  ] = await Promise.all([
    prisma.paymentGateway.count(),
    prisma.paymentGateway.count({ where: { isEnabled: true } }),
    prisma.subscriptionPlan.count(),
    prisma.currencyConfig.count(),
    prisma.promotionCoupon.count(),
    prisma.financialInvoice.count(),
    prisma.financialInvoice.aggregate({
      _sum: { amountTotal: true },
      where: { status: "PAID" },
    }),
  ]);

  return {
    totalGateways,
    activeGateways,
    totalPlans,
    totalCurrencies,
    totalCoupons,
    totalInvoices,
    totalRevenue: paidAggregate._sum.amountTotal ?? 0,
  };
}

/**
 * 2. Get Gateways
 * Returns all configured gateways with secret key presence flags.
 */
export async function getAdminGateways(): Promise<AdminGatewayDetails[]> {
  const gateways = await prisma.paymentGateway.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return gateways.map((gw) => ({
    id: gw.id,
    code: gw.code,
    nameAr: gw.nameAr,
    nameEn: gw.nameEn,
    category: gw.category as "NATIONAL" | "INTERNATIONAL" | "BNPL" | "WALLET",
    isEnabled: gw.isEnabled,
    isTestMode: gw.isTestMode,
    publishableKey: gw.publishableKey,
    hasSecretKey: !!gw.secretKeyEncrypted,
    hasWebhookSecret: !!gw.webhookSecret,
    feePercentage: gw.feePercentage,
    feeFixed: gw.feeFixed,
    supportedCurrencies: gw.supportedCurrencies,
    sortOrder: gw.sortOrder,
    updatedAt: gw.updatedAt.toISOString(),
  }));
}

/**
 * 3. Update Gateway
 * Updates gateway configuration, encrypts secret key with AES-256-GCM, and logs audit action.
 */
export async function updateAdminGateway(
  id: string,
  input: UpdateGatewayInput,
  adminId: string
): Promise<AdminGatewayDetails> {
  const existing = await prisma.paymentGateway.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error(`بوابة الدفع غير موجودة: ${id}`);
  }

  const updateData: Prisma.PaymentGatewayUpdateInput = {};

  if (input.isEnabled !== undefined) updateData.isEnabled = input.isEnabled;
  if (input.isTestMode !== undefined) updateData.isTestMode = input.isTestMode;
  if (input.publishableKey !== undefined) updateData.publishableKey = input.publishableKey;
  if (input.feePercentage !== undefined) updateData.feePercentage = input.feePercentage;
  if (input.feeFixed !== undefined) updateData.feeFixed = input.feeFixed;
  if (input.supportedCurrencies !== undefined) updateData.supportedCurrencies = input.supportedCurrencies;

  if (input.secretKey !== undefined) {
    const raw = input.secretKey.trim();
    if (raw && !raw.includes("••")) {
      updateData.secretKeyEncrypted = encryptSecret(raw);
    } else if (raw === "") {
      updateData.secretKeyEncrypted = null;
    }
  }

  if (input.webhookSecret !== undefined) {
    const raw = input.webhookSecret.trim();
    if (raw && !raw.includes("••")) {
      updateData.webhookSecret = raw;
    } else if (raw === "") {
      updateData.webhookSecret = null;
    }
  }

  const updated = await prisma.paymentGateway.update({
    where: { id },
    data: updateData,
  });

  await logFinancialAudit(adminId, "UPDATE_GATEWAY", "PaymentGateway", id, {
    changed: Object.keys(input),
    gatewayCode: existing.code,
  });

  return {
    id: updated.id,
    code: updated.code,
    nameAr: updated.nameAr,
    nameEn: updated.nameEn,
    category: updated.category as "NATIONAL" | "INTERNATIONAL" | "BNPL" | "WALLET",
    isEnabled: updated.isEnabled,
    isTestMode: updated.isTestMode,
    publishableKey: updated.publishableKey,
    hasSecretKey: !!updated.secretKeyEncrypted,
    hasWebhookSecret: !!updated.webhookSecret,
    feePercentage: updated.feePercentage,
    feeFixed: updated.feeFixed,
    supportedCurrencies: updated.supportedCurrencies,
    sortOrder: updated.sortOrder,
    updatedAt: updated.updatedAt.toISOString(),
  };
}

/**
 * 4. Get Subscription Plans
 * Returns all subscription plans with prices, quotas, and subscriber counts.
 */
export async function getAdminPlans(): Promise<AdminSubscriptionPlanItem[]> {
  const plans = await prisma.subscriptionPlan.findMany({
    include: {
      prices: {
        orderBy: { amount: "asc" },
      },
      quotas: true,
      _count: {
        select: { subscriptions: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return plans.map((plan) => ({
    id: plan.id,
    slug: plan.slug,
    nameAr: plan.nameAr,
    nameEn: plan.nameEn,
    descriptionAr: plan.descriptionAr,
    badgeAr: plan.badgeAr,
    isActive: plan.isActive,
    sortOrder: plan.sortOrder,
    prices: plan.prices.map((p) => ({
      id: p.id,
      currency: p.currency,
      billingCycle: p.billingCycle as "MONTHLY" | "YEARLY" | "LIFETIME",
      amount: p.amount,
      originalAmount: p.originalAmount,
      isActive: p.isActive,
    })),
    quotas: plan.quotas
      ? {
          maxLinks: plan.quotas.maxLinks,
          allowCustomDomain: plan.quotas.allowCustomDomain,
          allowRemoveBranding: plan.quotas.allowRemoveBranding,
          allowAdvancedThemes: plan.quotas.allowAdvancedThemes,
          allowDetailedAnalytics: plan.quotas.allowDetailedAnalytics,
          allowPrioritySupport: plan.quotas.allowPrioritySupport,
          customCssAllowed: plan.quotas.customCssAllowed,
          storeCommissionRate: plan.quotas.storeCommissionRate,
        }
      : {
          maxLinks: 10,
          allowCustomDomain: false,
          allowRemoveBranding: false,
          allowAdvancedThemes: false,
          allowDetailedAnalytics: false,
          allowPrioritySupport: false,
          customCssAllowed: false,
          storeCommissionRate: 5.0,
        },
    subscribersCount: plan._count.subscriptions,
  }));
}

/**
 * 5. Upsert Plan
 * Transactionally creates or updates a plan, its quotas, and its pricing models.
 */
export async function upsertAdminPlan(
  input: UpsertPlanInput,
  adminId: string
) {
  return await prisma.$transaction(async (tx) => {
    let plan;
    const planData = {
      slug: input.slug.trim().toLowerCase(),
      nameAr: input.nameAr,
      nameEn: input.nameEn,
      descriptionAr: input.descriptionAr,
      badgeAr: input.badgeAr,
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    };

    if (input.id) {
      plan = await tx.subscriptionPlan.update({
        where: { id: input.id },
        data: planData,
      });
    } else {
      const existing = await tx.subscriptionPlan.findUnique({
        where: { slug: planData.slug },
      });
      if (existing) {
        plan = await tx.subscriptionPlan.update({
          where: { id: existing.id },
          data: planData,
        });
      } else {
        plan = await tx.subscriptionPlan.create({
          data: {
            ...planData,
            isActive: input.isActive ?? true,
            sortOrder: input.sortOrder ?? 0,
          },
        });
      }
    }

    if (input.quotas) {
      await tx.planQuota.upsert({
        where: { planId: plan.id },
        create: {
          planId: plan.id,
          maxLinks: input.quotas.maxLinks ?? 10,
          allowCustomDomain: input.quotas.allowCustomDomain ?? false,
          allowRemoveBranding: input.quotas.allowRemoveBranding ?? false,
          allowAdvancedThemes: input.quotas.allowAdvancedThemes ?? false,
          allowDetailedAnalytics: input.quotas.allowDetailedAnalytics ?? false,
          allowPrioritySupport: input.quotas.allowPrioritySupport ?? false,
          customCssAllowed: input.quotas.customCssAllowed ?? false,
          storeCommissionRate: input.quotas.storeCommissionRate ?? 5.0,
        },
        update: {
          ...(input.quotas.maxLinks !== undefined && { maxLinks: input.quotas.maxLinks }),
          ...(input.quotas.allowCustomDomain !== undefined && {
            allowCustomDomain: input.quotas.allowCustomDomain,
          }),
          ...(input.quotas.allowRemoveBranding !== undefined && {
            allowRemoveBranding: input.quotas.allowRemoveBranding,
          }),
          ...(input.quotas.allowAdvancedThemes !== undefined && {
            allowAdvancedThemes: input.quotas.allowAdvancedThemes,
          }),
          ...(input.quotas.allowDetailedAnalytics !== undefined && {
            allowDetailedAnalytics: input.quotas.allowDetailedAnalytics,
          }),
          ...(input.quotas.allowPrioritySupport !== undefined && {
            allowPrioritySupport: input.quotas.allowPrioritySupport,
          }),
          ...(input.quotas.customCssAllowed !== undefined && {
            customCssAllowed: input.quotas.customCssAllowed,
          }),
          ...(input.quotas.storeCommissionRate !== undefined && {
            storeCommissionRate: input.quotas.storeCommissionRate,
          }),
        },
      });
    }

    if (input.prices && input.prices.length > 0) {
      for (const p of input.prices) {
        await tx.planPrice.upsert({
          where: {
            planId_currency_billingCycle: {
              planId: plan.id,
              currency: p.currency,
              billingCycle: p.billingCycle,
            },
          },
          create: {
            planId: plan.id,
            currency: p.currency,
            billingCycle: p.billingCycle,
            amount: p.amount,
            originalAmount: p.originalAmount ?? null,
            isActive: p.isActive ?? true,
          },
          update: {
            amount: p.amount,
            originalAmount: p.originalAmount ?? null,
            isActive: p.isActive ?? true,
          },
        });
      }
    }

    await logFinancialAudit(
      adminId,
      input.id ? "UPDATE_PLAN" : "CREATE_PLAN",
      "SubscriptionPlan",
      plan.id,
      { slug: plan.slug, nameAr: plan.nameAr },
      tx
    );

    return await tx.subscriptionPlan.findUnique({
      where: { id: plan.id },
      include: {
        prices: true,
        quotas: true,
        _count: { select: { subscriptions: true } },
      },
    });
  });
}

/**
 * 6. Delete Plan
 * Sets isActive to false if subscriptions exist, or permanently deletes if 0 subscriptions.
 */
export async function deleteAdminPlan(id: string, adminId: string) {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id },
    include: { _count: { select: { subscriptions: true } } },
  });

  if (!plan) {
    throw new Error("الباقة غير موجودة");
  }

  if (plan._count.subscriptions > 0) {
    await prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });
    await logFinancialAudit(adminId, "DEACTIVATE_PLAN", "SubscriptionPlan", id, {
      reason: "Has active subscribers",
      slug: plan.slug,
      subscriptionsCount: plan._count.subscriptions,
    });
    return {
      deleted: false,
      deactivated: true,
      message: "تم تعطيل الباقة بدلاً من الحذف لوجود مشتركين مرتبطين بها",
    };
  } else {
    await prisma.subscriptionPlan.delete({
      where: { id },
    });
    await logFinancialAudit(adminId, "DELETE_PLAN", "SubscriptionPlan", id, {
      slug: plan.slug,
    });
    return {
      deleted: true,
      deactivated: false,
      message: "تم حذف الباقة بنجاح",
    };
  }
}

/**
 * 7. Update Plan Quotas
 * Updates quotas/features associated with a plan.
 */
export async function updateAdminPlanQuotas(
  planId: string,
  quotas: UpsertQuotaInput,
  adminId: string
) {
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) {
    throw new Error("الباقة غير موجودة");
  }

  const updated = await prisma.planQuota.upsert({
    where: { planId },
    create: {
      planId,
      maxLinks: quotas.maxLinks ?? 10,
      allowCustomDomain: quotas.allowCustomDomain ?? false,
      allowRemoveBranding: quotas.allowRemoveBranding ?? false,
      allowAdvancedThemes: quotas.allowAdvancedThemes ?? false,
      allowDetailedAnalytics: quotas.allowDetailedAnalytics ?? false,
      allowPrioritySupport: quotas.allowPrioritySupport ?? false,
      customCssAllowed: quotas.customCssAllowed ?? false,
      storeCommissionRate: quotas.storeCommissionRate ?? 5.0,
    },
    update: {
      ...(quotas.maxLinks !== undefined && { maxLinks: quotas.maxLinks }),
      ...(quotas.allowCustomDomain !== undefined && {
        allowCustomDomain: quotas.allowCustomDomain,
      }),
      ...(quotas.allowRemoveBranding !== undefined && {
        allowRemoveBranding: quotas.allowRemoveBranding,
      }),
      ...(quotas.allowAdvancedThemes !== undefined && {
        allowAdvancedThemes: quotas.allowAdvancedThemes,
      }),
      ...(quotas.allowDetailedAnalytics !== undefined && {
        allowDetailedAnalytics: quotas.allowDetailedAnalytics,
      }),
      ...(quotas.allowPrioritySupport !== undefined && {
        allowPrioritySupport: quotas.allowPrioritySupport,
      }),
      ...(quotas.customCssAllowed !== undefined && {
        customCssAllowed: quotas.customCssAllowed,
      }),
      ...(quotas.storeCommissionRate !== undefined && {
        storeCommissionRate: quotas.storeCommissionRate,
      }),
    },
  });

  await logFinancialAudit(adminId, "UPDATE_QUOTAS", "PlanQuota", planId, quotas);

  return updated;
}

/**
 * 8. Get Currencies
 * Returns list of configured currencies.
 */
export async function getAdminCurrencies(): Promise<AdminCurrencyItem[]> {
  const currencies = await prisma.currencyConfig.findMany({
    orderBy: [{ isBaseCurrency: "desc" }, { code: "asc" }],
  });

  return currencies.map((c) => ({
    code: c.code,
    nameAr: c.nameAr,
    symbol: c.symbol,
    exchangeRateToUSD: c.exchangeRateToUSD,
    isBaseCurrency: c.isBaseCurrency,
    isActive: c.isActive,
    autoDetectCountries: c.autoDetectCountries,
    updatedAt: c.updatedAt.toISOString(),
  }));
}

/**
 * 9. Update Currency
 * Updates currency details (exchange rate, auto-detection countries, status).
 */
export async function updateAdminCurrency(
  code: string,
  input: UpdateCurrencyInput,
  adminId: string
): Promise<AdminCurrencyItem> {
  const existing = await prisma.currencyConfig.findUnique({
    where: { code },
  });
  if (!existing) {
    throw new Error(`العملة غير موجودة: ${code}`);
  }

  const updateData: Prisma.CurrencyConfigUpdateInput = {};
  if (input.nameAr !== undefined) updateData.nameAr = input.nameAr;
  if (input.symbol !== undefined) updateData.symbol = input.symbol;
  if (input.exchangeRateToUSD !== undefined) updateData.exchangeRateToUSD = input.exchangeRateToUSD;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;
  if (input.autoDetectCountries !== undefined) updateData.autoDetectCountries = input.autoDetectCountries;

  const updated = await prisma.currencyConfig.update({
    where: { code },
    data: updateData,
  });

  await logFinancialAudit(adminId, "UPDATE_CURRENCY", "CurrencyConfig", code, input);

  return {
    code: updated.code,
    nameAr: updated.nameAr,
    symbol: updated.symbol,
    exchangeRateToUSD: updated.exchangeRateToUSD,
    isBaseCurrency: updated.isBaseCurrency,
    isActive: updated.isActive,
    autoDetectCountries: updated.autoDetectCountries,
    updatedAt: updated.updatedAt.toISOString(),
  };
}

/**
 * 10. Get Coupons
 * Returns all promotional coupons.
 */
export async function getAdminCoupons(): Promise<AdminCouponItem[]> {
  const coupons = await prisma.promotionCoupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return coupons.map((c) => ({
    id: c.id,
    code: c.code,
    descriptionAr: c.descriptionAr,
    discountType: c.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: c.discountValue,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    maxUsesPerUser: c.maxUsesPerUser,
    validFrom: c.validFrom.toISOString(),
    validUntil: c.validUntil ? c.validUntil.toISOString() : null,
    isActive: c.isActive,
    applicablePlanSlugs: c.applicablePlanSlugs,
    createdAt: c.createdAt.toISOString(),
  }));
}

/**
 * 11. Create Coupon
 * Creates a promotion coupon with uniqueness validation.
 */
export async function createAdminCoupon(
  input: CreateCouponInput,
  adminId: string
): Promise<AdminCouponItem> {
  const code = input.code.trim().toUpperCase();
  if (!code) {
    throw new Error("رمز الكوبون مطلوب");
  }

  const existing = await prisma.promotionCoupon.findUnique({
    where: { code },
  });
  if (existing) {
    throw new Error("رمز الكوبون مستخدم مسبقاً");
  }

  const coupon = await prisma.promotionCoupon.create({
    data: {
      code,
      descriptionAr: input.descriptionAr,
      discountType: input.discountType,
      discountValue: input.discountValue,
      maxUses: input.maxUses ?? null,
      maxUsesPerUser: input.maxUsesPerUser ?? 1,
      validFrom: input.validFrom ? new Date(input.validFrom) : new Date(),
      validUntil: input.validUntil ? new Date(input.validUntil) : null,
      isActive: true,
      applicablePlanSlugs: input.applicablePlanSlugs ?? [],
    },
  });

  await logFinancialAudit(adminId, "CREATE_COUPON", "PromotionCoupon", coupon.id, {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });

  return {
    id: coupon.id,
    code: coupon.code,
    descriptionAr: coupon.descriptionAr,
    discountType: coupon.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: coupon.discountValue,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    maxUsesPerUser: coupon.maxUsesPerUser,
    validFrom: coupon.validFrom.toISOString(),
    validUntil: coupon.validUntil ? coupon.validUntil.toISOString() : null,
    isActive: coupon.isActive,
    applicablePlanSlugs: coupon.applicablePlanSlugs,
    createdAt: coupon.createdAt.toISOString(),
  };
}

/**
 * 12. Toggle Coupon Active Status
 */
export async function toggleAdminCoupon(
  id: string,
  isActive: boolean,
  adminId: string
): Promise<AdminCouponItem> {
  const coupon = await prisma.promotionCoupon.update({
    where: { id },
    data: { isActive },
  });

  await logFinancialAudit(adminId, "TOGGLE_COUPON", "PromotionCoupon", id, { isActive });

  return {
    id: coupon.id,
    code: coupon.code,
    descriptionAr: coupon.descriptionAr,
    discountType: coupon.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: coupon.discountValue,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    maxUsesPerUser: coupon.maxUsesPerUser,
    validFrom: coupon.validFrom.toISOString(),
    validUntil: coupon.validUntil ? coupon.validUntil.toISOString() : null,
    isActive: coupon.isActive,
    applicablePlanSlugs: coupon.applicablePlanSlugs,
    createdAt: coupon.createdAt.toISOString(),
  };
}

/**
 * 13. Delete Coupon
 */
export async function deleteAdminCoupon(
  id: string,
  adminId: string
): Promise<{ success: boolean; id: string }> {
  const coupon = await prisma.promotionCoupon.delete({
    where: { id },
  });

  await logFinancialAudit(adminId, "DELETE_COUPON", "PromotionCoupon", id, {
    code: coupon.code,
  });

  return { success: true, id };
}

/**
 * 14. Get Admin Transactions (Paginated)
 */
export async function getAdminTransactions(
  query: AdminTransactionsQuery = {}
): Promise<AdminTransactionsResult> {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.max(1, Math.min(100, query.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.FinancialInvoiceWhereInput = {};
  if (query.status && query.status !== "all") {
    where.status = query.status;
  }
  if (query.gateway && query.gateway !== "all") {
    where.gatewayCode = query.gateway;
  }

  const [invoices, total] = await Promise.all([
    prisma.financialInvoice.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profile: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    }),
    prisma.financialInvoice.count({ where }),
  ]);

  const items: AdminTransactionItem[] = invoices.map((inv) => {
    const customerName =
      inv.user?.profile?.displayName || inv.user?.username || "Unknown";
    const customerEmail = inv.user?.email || "";

    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      userId: inv.userId,
      customerName,
      customerEmail,
      amountSubtotal: inv.amountSubtotal,
      discountAmount: inv.discountAmount,
      taxAmount: inv.taxAmount,
      amountTotal: inv.amountTotal,
      currency: inv.currency,
      gatewayCode: inv.gatewayCode,
      gatewayTxId: inv.gatewayTxId,
      status: inv.status,
      pdfUrl: inv.pdfUrl,
      createdAt: inv.createdAt.toISOString(),
    };
  });

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * 15. Financial Audit Logger
 */
export async function logFinancialAudit(
  adminId: string,
  action: string,
  entity: string,
  entityId?: string | null,
  details?: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any = prisma
) {
  try {
    return await client.financialAuditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId: entityId ?? null,
        details: (details ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("Failed to write FinancialAuditLog:", error);
    throw error;
  }
}
