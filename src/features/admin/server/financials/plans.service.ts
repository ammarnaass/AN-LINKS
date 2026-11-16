import { prisma } from "@/shared/db";
import { Prisma } from "@prisma/client";
import type {
  AdminSubscriptionPlanItem,
  AdminPlanQuotaConfig,
  AdminPlanPriceItem,
  UpsertPlanInput,
  UpsertQuotaInput,
} from "../../types/admin.types";
import { logFinancialAudit } from "./audit.service";

const DEFAULT_QUOTAS: AdminPlanQuotaConfig = {
  maxLinks: 10, allowCustomDomain: false, allowRemoveBranding: false, allowAdvancedThemes: false,
  allowDetailedAnalytics: false, allowPrioritySupport: false, customCssAllowed: false, storeCommissionRate: 5.0,
};

const QUOTA_FIELDS = [
  "maxLinks", "allowCustomDomain", "allowRemoveBranding", "allowAdvancedThemes",
  "allowDetailedAnalytics", "allowPrioritySupport", "customCssAllowed", "storeCommissionRate",
] as const;

function buildQuotaUpdate(q?: Partial<AdminPlanQuotaConfig>): Prisma.PlanQuotaUpdateInput {
  if (!q) return {};
  const data: Record<string, unknown> = {};
  for (const k of QUOTA_FIELDS) if (q[k] !== undefined) data[k] = q[k];
  return data as Prisma.PlanQuotaUpdateInput;
}

function buildQuotaCreate(planId: string, q?: Partial<AdminPlanQuotaConfig>): Prisma.PlanQuotaUncheckedCreateInput {
  const quotas: AdminPlanQuotaConfig = { ...DEFAULT_QUOTAS };
  for (const k of QUOTA_FIELDS) if (q?.[k] !== undefined) (quotas as any)[k] = q[k];
  return { planId, ...quotas };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractQuotas(q: any): AdminPlanQuotaConfig {
  if (!q) return DEFAULT_QUOTAS;
  const { maxLinks, allowCustomDomain, allowRemoveBranding, allowAdvancedThemes,
    allowDetailedAnalytics, allowPrioritySupport, customCssAllowed, storeCommissionRate } = q;
  return { maxLinks, allowCustomDomain, allowRemoveBranding, allowAdvancedThemes,
    allowDetailedAnalytics, allowPrioritySupport, customCssAllowed, storeCommissionRate };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncPlanPrices(tx: any, planId: string, prices: AdminPlanPriceItem[]) {
  for (const { currency, billingCycle, amount, originalAmount = null, isActive = true } of prices) {
    await tx.planPrice.upsert({
      where: { planId_currency_billingCycle: { planId, currency, billingCycle } },
      create: { planId, currency, billingCycle, amount, originalAmount, isActive },
      update: { amount, originalAmount, isActive },
    });
  }
}

export async function getAdminPlans(): Promise<AdminSubscriptionPlanItem[]> {
  const plans = await prisma.subscriptionPlan.findMany({
    include: { prices: { orderBy: { amount: "asc" } }, quotas: true, _count: { select: { subscriptions: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return plans.map((p) => ({
    id: p.id, slug: p.slug, nameAr: p.nameAr, nameEn: p.nameEn, descriptionAr: p.descriptionAr,
    badgeAr: p.badgeAr, isActive: p.isActive, sortOrder: p.sortOrder,
    prices: p.prices.map((pr) => ({
      id: pr.id, currency: pr.currency, billingCycle: pr.billingCycle as "MONTHLY" | "YEARLY" | "LIFETIME",
      amount: pr.amount, originalAmount: pr.originalAmount, isActive: pr.isActive,
    })),
    quotas: extractQuotas(p.quotas),
    subscribersCount: p._count.subscriptions,
  }));
}

export async function upsertAdminPlan(input: UpsertPlanInput, adminId: string) {
  return await prisma.$transaction(async (tx) => {
    const slug = input.slug.trim().toLowerCase();
    const data = {
      slug, nameAr: input.nameAr, nameEn: input.nameEn, descriptionAr: input.descriptionAr,
      badgeAr: input.badgeAr, ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    };

    let plan = input.id ? await tx.subscriptionPlan.update({ where: { id: input.id }, data }) : null;
    if (!plan) {
      const existing = await tx.subscriptionPlan.findUnique({ where: { slug } });
      plan = existing
        ? await tx.subscriptionPlan.update({ where: { id: existing.id }, data })
        : await tx.subscriptionPlan.create({
            data: { ...data, isActive: input.isActive ?? true, sortOrder: input.sortOrder ?? 0 },
          });
    }

    if (input.quotas) {
      await tx.planQuota.upsert({
        where: { planId: plan.id },
        create: buildQuotaCreate(plan.id, input.quotas),
        update: buildQuotaUpdate(input.quotas),
      });
    }

    if (input.prices?.length) await syncPlanPrices(tx, plan.id, input.prices);

    await logFinancialAudit(
      adminId, input.id ? "UPDATE_PLAN" : "CREATE_PLAN", "SubscriptionPlan",
      plan.id, { slug: plan.slug, nameAr: plan.nameAr }, tx
    );

    return await tx.subscriptionPlan.findUnique({
      where: { id: plan.id },
      include: { prices: true, quotas: true, _count: { select: { subscriptions: true } } },
    });
  });
}

export async function deleteAdminPlan(id: string, adminId: string) {
  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id }, include: { _count: { select: { subscriptions: true } } },
  });
  if (!plan) throw new Error("الباقة غير موجودة");

  if (plan._count.subscriptions > 0) {
    await prisma.subscriptionPlan.update({ where: { id }, data: { isActive: false } });
    await logFinancialAudit(adminId, "DEACTIVATE_PLAN", "SubscriptionPlan", id, {
      reason: "Has active subscribers", slug: plan.slug, subscriptionsCount: plan._count.subscriptions,
    });
    return { deleted: false, deactivated: true, message: "تم تعطيل الباقة بدلاً من الحذف لوجود مشتركين مرتبطين بها" };
  }

  await prisma.subscriptionPlan.delete({ where: { id } });
  await logFinancialAudit(adminId, "DELETE_PLAN", "SubscriptionPlan", id, { slug: plan.slug });
  return { deleted: true, deactivated: false, message: "تم حذف الباقة بنجاح" };
}

export async function updateAdminPlanQuotas(
  planId: string,
  quotas: Partial<AdminPlanQuotaConfig> | UpsertQuotaInput,
  adminId: string
) {
  const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("الباقة غير موجودة");

  const updated = await prisma.planQuota.upsert({
    where: { planId },
    create: buildQuotaCreate(planId, quotas),
    update: buildQuotaUpdate(quotas),
  });

  await logFinancialAudit(adminId, "UPDATE_QUOTAS", "PlanQuota", planId, quotas);
  return updated;
}
