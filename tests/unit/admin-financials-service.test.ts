import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import {
  getFinancialOverview,
  getAdminGateways,
  updateAdminGateway,
  getAdminPlans,
  upsertAdminPlan,
  deleteAdminPlan,
  updateAdminPlanQuotas,
  getAdminCurrencies,
  updateAdminCurrency,
  getAdminCoupons,
  createAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
  getAdminTransactions,
  logFinancialAudit,
  refundAdminInvoice,
} from "@/features/admin/server/admin-financials.service";
import * as financialsBarrel from "@/features/admin/server/financials";
import { prisma } from "@/shared/db";
import { decryptSecret } from "@/shared/lib/crypto";
import { requireAdminSession } from "@/features/admin/server/admin.guard";

// Route handlers
import * as overviewRoute from "@/app/api/admin/financials/overview/route";
import * as gatewaysRoute from "@/app/api/admin/financials/gateways/route";
import * as plansRoute from "@/app/api/admin/financials/plans/route";
import * as planIdRoute from "@/app/api/admin/financials/plans/[id]/route";
import * as quotasRoute from "@/app/api/admin/financials/quotas/route";
import * as currenciesRoute from "@/app/api/admin/financials/currencies/route";
import * as couponsRoute from "@/app/api/admin/financials/coupons/route";
import * as couponIdRoute from "@/app/api/admin/financials/coupons/[id]/route";
import * as transactionsRoute from "@/app/api/admin/financials/transactions/route";

vi.mock("@/features/admin/server/admin.guard", () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock("@/shared/db", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockPrisma: any = {
    paymentGateway: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    subscriptionPlan: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    planQuota: {
      upsert: vi.fn(),
    },
    planPrice: {
      upsert: vi.fn(),
    },
    currencyConfig: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    promotionCoupon: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    financialInvoice: {
      count: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    financialAuditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction: vi.fn(async (cb: (tx: any) => Promise<any>) => {
      return await cb(mockPrisma);
    }),
  };
  return { prisma: mockPrisma };
});

describe("Admin Financials Service", () => {
  const originalEnv = process.env.PAYMENT_ENCRYPTION_KEY;
  const TEST_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const TEST_ADMIN_ID = "admin_user_uuid_123";

  beforeEach(() => {
    process.env.PAYMENT_ENCRYPTION_KEY = TEST_KEY;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.PAYMENT_ENCRYPTION_KEY = originalEnv;
  });

  describe("getFinancialOverview", () => {
    it("aggregates counts and revenue correctly", async () => {
      // Mock counts
      vi.mocked(prisma.paymentGateway.count)
        .mockResolvedValueOnce(9) // totalGateways
        .mockResolvedValueOnce(6); // activeGateways
      vi.mocked(prisma.subscriptionPlan.count).mockResolvedValueOnce(4);
      vi.mocked(prisma.currencyConfig.count).mockResolvedValueOnce(5);
      vi.mocked(prisma.promotionCoupon.count).mockResolvedValueOnce(12);
      vi.mocked(prisma.financialInvoice.count).mockResolvedValueOnce(150);
      vi.mocked(prisma.financialInvoice.aggregate).mockResolvedValueOnce({
        _sum: { amountTotal: 28500.5 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const overview = await getFinancialOverview();

      expect(overview).toEqual({
        totalGateways: 9,
        activeGateways: 6,
        totalPlans: 4,
        totalCurrencies: 5,
        totalCoupons: 12,
        totalInvoices: 150,
        totalRevenue: 28500.5,
      });

      expect(prisma.paymentGateway.count).toHaveBeenCalledTimes(2);
      expect(prisma.paymentGateway.count).toHaveBeenNthCalledWith(2, {
        where: { isEnabled: true },
      });
      expect(prisma.financialInvoice.aggregate).toHaveBeenCalledWith({
        _sum: { amountTotal: true },
        where: { status: "PAID" },
      });
    });

    it("defaults totalRevenue to 0 when no paid invoices exist", async () => {
      vi.mocked(prisma.paymentGateway.count).mockResolvedValue(0);
      vi.mocked(prisma.subscriptionPlan.count).mockResolvedValue(0);
      vi.mocked(prisma.currencyConfig.count).mockResolvedValue(0);
      vi.mocked(prisma.promotionCoupon.count).mockResolvedValue(0);
      vi.mocked(prisma.financialInvoice.count).mockResolvedValue(0);
      vi.mocked(prisma.financialInvoice.aggregate).mockResolvedValueOnce({
        _sum: { amountTotal: null },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const overview = await getFinancialOverview();
      expect(overview.totalRevenue).toBe(0);
    });
  });

  describe("getAdminGateways", () => {
    it("returns gateways formatted with secret key indicators", async () => {
      const now = new Date();
      vi.mocked(prisma.paymentGateway.findMany).mockResolvedValueOnce([
        {
          id: "gw_1",
          code: "mada",
          nameAr: "مدى",
          nameEn: "Mada",
          category: "NATIONAL",
          isEnabled: true,
          isTestMode: false,
          publishableKey: "pk_live_mada_123",
          secretKeyEncrypted: "encrypted_secret_data",
          webhookSecret: "whsec_mada_secret",
          feePercentage: 1.0,
          feeFixed: 1.0,
          supportedCurrencies: ["SAR"],
          sortOrder: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "gw_2",
          code: "tamara",
          nameAr: "تمارا",
          nameEn: "Tamara",
          category: "BNPL",
          isEnabled: false,
          isTestMode: true,
          publishableKey: null,
          secretKeyEncrypted: null,
          webhookSecret: null,
          feePercentage: 5.0,
          feeFixed: 0.0,
          supportedCurrencies: ["SAR", "AED"],
          sortOrder: 2,
          createdAt: now,
          updatedAt: now,
        },
      ]);

      const result = await getAdminGateways();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "gw_1",
        code: "mada",
        nameAr: "مدى",
        nameEn: "Mada",
        category: "NATIONAL",
        isEnabled: true,
        isTestMode: false,
        publishableKey: "pk_live_mada_123",
        hasSecretKey: true,
        hasWebhookSecret: true,
        feePercentage: 1.0,
        feeFixed: 1.0,
        supportedCurrencies: ["SAR"],
        sortOrder: 1,
        updatedAt: now.toISOString(),
      });
      expect(result[1].hasSecretKey).toBe(false);
      expect(result[1].hasWebhookSecret).toBe(false);
    });
  });

  describe("updateAdminGateway", () => {
    it("encrypts unmasked secret key and creates audit log", async () => {
      const now = new Date();
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValueOnce({
        id: "gw_stripe",
        code: "stripe",
        nameAr: "سترايب",
        nameEn: "Stripe",
        category: "INTERNATIONAL",
        isEnabled: false,
        isTestMode: true,
        publishableKey: "pk_test_old",
        secretKeyEncrypted: null,
        webhookSecret: null,
        feePercentage: 2.9,
        feeFixed: 1.0,
        supportedCurrencies: ["USD"],
        sortOrder: 5,
        createdAt: now,
        updatedAt: now,
      });

      (vi.mocked(prisma.paymentGateway.update) as any).mockImplementationOnce(async ({ data }: any) => ({
        id: "gw_stripe",
        code: "stripe",
        nameAr: "سترايب",
        nameEn: "Stripe",
        category: "INTERNATIONAL",
        isEnabled: data.isEnabled as boolean ?? false,
        isTestMode: data.isTestMode as boolean ?? true,
        publishableKey: data.publishableKey as string ?? "pk_live_new",
        secretKeyEncrypted: data.secretKeyEncrypted as string ?? null,
        webhookSecret: data.webhookSecret as string ?? null,
        feePercentage: 2.9,
        feeFixed: 1.0,
        supportedCurrencies: ["USD", "SAR"],
        sortOrder: 5,
        createdAt: now,
        updatedAt: now,
      }));

      const rawSecret = "sk_live_verySecretKey123456789";
      const result = await updateAdminGateway(
        "gw_stripe",
        {
          id: "gw_stripe",
          isEnabled: true,
          publishableKey: "pk_live_new",
          secretKey: rawSecret,
          webhookSecret: "whsec_live_webhook_secret",
        },
        TEST_ADMIN_ID
      );

      expect(result.isEnabled).toBe(true);
      expect(result.hasSecretKey).toBe(true);
      expect(result.hasWebhookSecret).toBe(true);

      // Verify what was sent to prisma.paymentGateway.update
      expect(prisma.paymentGateway.update).toHaveBeenCalledTimes(1);
      const updateCall = vi.mocked(prisma.paymentGateway.update).mock.calls[0][0];
      const encryptedValue = updateCall.data.secretKeyEncrypted as string;

      // Ensure it is encrypted format and decrypts back to original secret
      expect(encryptedValue).toMatch(/^[0-9a-fA-F]{24}:[0-9a-fA-F]{32}:[0-9a-fA-F]+$/);
      expect(decryptSecret(encryptedValue)).toBe(rawSecret);

      // Verify audit log creation
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          adminId: TEST_ADMIN_ID,
          action: "UPDATE_GATEWAY",
          entity: "PaymentGateway",
          entityId: "gw_stripe",
        }),
      });
    });

    it("does not re-encrypt or overwrite secret key when masked key is passed", async () => {
      const now = new Date();
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValueOnce({
        id: "gw_stripe",
        code: "stripe",
        nameAr: "سترايب",
        nameEn: "Stripe",
        category: "INTERNATIONAL",
        isEnabled: true,
        isTestMode: false,
        publishableKey: "pk_live_123",
        secretKeyEncrypted: "existing_encrypted_secret",
        webhookSecret: "whsec_existing",
        feePercentage: 2.9,
        feeFixed: 1.0,
        supportedCurrencies: ["USD"],
        sortOrder: 5,
        createdAt: now,
        updatedAt: now,
      });

      vi.mocked(prisma.paymentGateway.update).mockResolvedValueOnce({
        id: "gw_stripe",
        code: "stripe",
        nameAr: "سترايب",
        nameEn: "Stripe",
        category: "INTERNATIONAL",
        isEnabled: true,
        isTestMode: false,
        publishableKey: "pk_live_123",
        secretKeyEncrypted: "existing_encrypted_secret",
        webhookSecret: "whsec_existing",
        feePercentage: 3.5,
        feeFixed: 1.0,
        supportedCurrencies: ["USD"],
        sortOrder: 5,
        createdAt: now,
        updatedAt: now,
      });

      await updateAdminGateway(
        "gw_stripe",
        {
          id: "gw_stripe",
          secretKey: "sk_live_••••••••3a8f", // masked!
          feePercentage: 3.5,
        },
        TEST_ADMIN_ID
      );

      const updateCall = vi.mocked(prisma.paymentGateway.update).mock.calls[0][0];
      // secretKeyEncrypted should NOT be updated because it contained bullets
      expect(updateCall.data.secretKeyEncrypted).toBeUndefined();
      expect(updateCall.data.feePercentage).toBe(3.5);
    });

    it("throws an error if the gateway is not found", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValueOnce(null);

      await expect(
        updateAdminGateway("missing_gw", { id: "missing_gw" }, TEST_ADMIN_ID)
      ).rejects.toThrow(/بوابة الدفع غير موجودة/);
    });
  });

  describe("getAdminPlans", () => {
    it("returns plans with prices, quotas, and subscriber counts", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValueOnce([
        {
          id: "plan_pro",
          slug: "pro",
          nameAr: "الاحترافية",
          nameEn: "Pro",
          descriptionAr: "للمحترفين وصناع المحتوى",
          badgeAr: "الأكثر شعبية",
          isActive: true,
          sortOrder: 2,
          createdAt: now,
          updatedAt: now,
          prices: [
            {
              id: "price_monthly_sar",
              planId: "plan_pro",
              currency: "SAR",
              billingCycle: "MONTHLY",
              amount: 49,
              originalAmount: 69,
              isActive: true,
              externalPriceId: null,
            },
          ],
          quotas: {
            id: "quota_pro",
            planId: "plan_pro",
            maxLinks: 50,
            allowCustomDomain: true,
            allowRemoveBranding: true,
            allowAdvancedThemes: true,
            allowDetailedAnalytics: true,
            allowPrioritySupport: true,
            customCssAllowed: true,
            storeCommissionRate: 2.0,
          },
          _count: {
            subscriptions: 28,
          },
        },
      ] as any);

      const plans = await getAdminPlans();

      expect(plans).toHaveLength(1);
      expect(plans[0].slug).toBe("pro");
      expect(plans[0].prices).toHaveLength(1);
      expect(plans[0].prices[0].amount).toBe(49);
      expect(plans[0].quotas.maxLinks).toBe(50);
      expect(plans[0].quotas.allowCustomDomain).toBe(true);
      expect(plans[0].subscribersCount).toBe(28);
    });

    it("applies default quotas when plan.quotas is null", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValueOnce([
        {
          id: "plan_free",
          slug: "free",
          nameAr: "المجانية",
          nameEn: "Free",
          descriptionAr: null,
          badgeAr: null,
          isActive: true,
          sortOrder: 1,
          createdAt: now,
          updatedAt: now,
          prices: [],
          quotas: null,
          _count: {
            subscriptions: 100,
          },
        },
      ] as any);

      const plans = await getAdminPlans();
      expect(plans[0].quotas.maxLinks).toBe(10);
      expect(plans[0].quotas.allowCustomDomain).toBe(false);
      expect(plans[0].quotas.storeCommissionRate).toBe(5.0);
    });
  });

  describe("upsertAdminPlan", () => {
    it("creates plan, quotas, and prices in a transaction and writes audit log", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findUnique)
        .mockResolvedValueOnce(null) // Slug check: not existing
        .mockResolvedValueOnce({
          id: "plan_new_123",
          slug: "agency",
          nameAr: "الوكالات",
          nameEn: "Agency",
          descriptionAr: "لفرق العمل الكبيرة",
          badgeAr: "متميز",
          isActive: true,
          sortOrder: 3,
          createdAt: now,
          updatedAt: now,
          prices: [
            {
              id: "price_1",
              planId: "plan_new_123",
              currency: "SAR",
              billingCycle: "MONTHLY",
              amount: 199,
              originalAmount: 249,
              isActive: true,
              externalPriceId: null,
            },
          ],
          quotas: {
            id: "quota_1",
            planId: "plan_new_123",
            maxLinks: 500,
            allowCustomDomain: true,
            allowRemoveBranding: true,
            allowAdvancedThemes: true,
            allowDetailedAnalytics: true,
            allowPrioritySupport: true,
            customCssAllowed: true,
            storeCommissionRate: 1.0,
          },
          _count: { subscriptions: 0 },
        } as any);

      vi.mocked(prisma.subscriptionPlan.create).mockResolvedValueOnce({
        id: "plan_new_123",
        slug: "agency",
        nameAr: "الوكالات",
        nameEn: "Agency",
        descriptionAr: "لفرق العمل الكبيرة",
        badgeAr: "متميز",
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now,
      });

      const plan = await upsertAdminPlan(
        {
          slug: "Agency",
          nameAr: "الوكالات",
          nameEn: "Agency",
          descriptionAr: "لفرق العمل الكبيرة",
          badgeAr: "متميز",
          quotas: {
            maxLinks: 500,
            allowCustomDomain: true,
            storeCommissionRate: 1.0,
          },
          prices: [
            {
              currency: "SAR",
              billingCycle: "MONTHLY",
              amount: 199,
              originalAmount: 249,
              isActive: true,
            },
          ],
        },
        TEST_ADMIN_ID
      );

      expect(prisma.subscriptionPlan.create).toHaveBeenCalledTimes(1);
      expect(prisma.planQuota.upsert).toHaveBeenCalledTimes(1);
      expect(prisma.planPrice.upsert).toHaveBeenCalledTimes(1);
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          adminId: TEST_ADMIN_ID,
          action: "CREATE_PLAN",
          entity: "SubscriptionPlan",
          entityId: "plan_new_123",
        }),
      });
      expect(plan?.id).toBe("plan_new_123");
    });

    it("updates existing plan when id is provided", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.update).mockResolvedValueOnce({
        id: "plan_existing_123",
        slug: "pro-updated",
        nameAr: "الاحترافية المحدثة",
        nameEn: "Pro Updated",
        descriptionAr: "وصف محدث",
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      });

      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_existing_123",
        slug: "pro-updated",
        nameAr: "الاحترافية المحدثة",
        nameEn: "Pro Updated",
        descriptionAr: "وصف محدث",
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
        prices: [],
        quotas: null,
        _count: { subscriptions: 5 },
      } as any);

      const updated = await upsertAdminPlan(
        {
          id: "plan_existing_123",
          slug: "pro-updated",
          nameAr: "الاحترافية المحدثة",
          nameEn: "Pro Updated",
        },
        TEST_ADMIN_ID
      );

      expect(prisma.subscriptionPlan.update).toHaveBeenCalledTimes(1);
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "UPDATE_PLAN",
          entityId: "plan_existing_123",
        }),
      });
      expect(updated?.id).toBe("plan_existing_123");
    });
  });

  describe("deleteAdminPlan", () => {
    it("deactivates the plan if it has active subscribers", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_pro",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
        _count: { subscriptions: 15 },
      } as any);

      const res = await deleteAdminPlan("plan_pro", TEST_ADMIN_ID);

      expect(res.deleted).toBe(false);
      expect(res.deactivated).toBe(true);
      expect(prisma.subscriptionPlan.update).toHaveBeenCalledWith({
        where: { id: "plan_pro" },
        data: { isActive: false },
      });
      expect(prisma.subscriptionPlan.delete).not.toHaveBeenCalled();
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "DEACTIVATE_PLAN",
          entity: "SubscriptionPlan",
          entityId: "plan_pro",
        }),
      });
    });

    it("permanently deletes the plan if it has 0 subscribers", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_empty",
        slug: "empty",
        nameAr: "فارغة",
        nameEn: "Empty",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 9,
        createdAt: now,
        updatedAt: now,
        _count: { subscriptions: 0 },
      } as any);

      const res = await deleteAdminPlan("plan_empty", TEST_ADMIN_ID);

      expect(res.deleted).toBe(true);
      expect(res.deactivated).toBe(false);
      expect(prisma.subscriptionPlan.delete).toHaveBeenCalledWith({
        where: { id: "plan_empty" },
      });
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "DELETE_PLAN",
          entity: "SubscriptionPlan",
          entityId: "plan_empty",
        }),
      });
    });

    it("throws an error if plan is not found", async () => {
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce(null);

      await expect(deleteAdminPlan("non_existent", TEST_ADMIN_ID)).rejects.toThrow(
        /الباقة غير موجودة/
      );
    });
  });

  describe("updateAdminPlanQuotas", () => {
    it("upserts plan quotas and logs audit action", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_pro",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      });

      vi.mocked(prisma.planQuota.upsert).mockResolvedValueOnce({
        id: "quota_123",
        planId: "plan_pro",
        maxLinks: 100,
        allowCustomDomain: true,
        allowRemoveBranding: true,
        allowAdvancedThemes: true,
        allowDetailedAnalytics: true,
        allowPrioritySupport: true,
        customCssAllowed: true,
        storeCommissionRate: 2.5,
        allowAppointments: false,
        allowOutgoingWebhooks: false,
        allowAiCopilot: false,
      });

      const updated = await updateAdminPlanQuotas(
        "plan_pro",
        {
          maxLinks: 100,
          storeCommissionRate: 2.5,
        },
        TEST_ADMIN_ID
      );

      expect(updated.maxLinks).toBe(100);
      expect(prisma.planQuota.upsert).toHaveBeenCalledWith({
        where: { planId: "plan_pro" },
        create: expect.objectContaining({ maxLinks: 100, storeCommissionRate: 2.5 }),
        update: expect.objectContaining({ maxLinks: 100, storeCommissionRate: 2.5 }),
      });
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "UPDATE_QUOTAS",
          entity: "PlanQuota",
          entityId: "plan_pro",
        }),
      });
    });
  });

  describe("Currencies Management", () => {
    it("retrieves currencies ordered by base currency first", async () => {
      const now = new Date();
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValueOnce([
        {
          code: "SAR",
          nameAr: "ريال سعودي",
          symbol: "ر.س",
          exchangeRateToUSD: 3.75,
          isBaseCurrency: true,
          isActive: true,
          autoDetectCountries: ["SA"],
          updatedAt: now,
        },
        {
          code: "AED",
          nameAr: "درهم إماراتي",
          symbol: "د.إ",
          exchangeRateToUSD: 3.67,
          isBaseCurrency: false,
          isActive: true,
          autoDetectCountries: ["AE"],
          updatedAt: now,
        },
      ]);

      const currencies = await getAdminCurrencies();
      expect(currencies).toHaveLength(2);
      expect(currencies[0].code).toBe("SAR");
      expect(currencies[0].isBaseCurrency).toBe(true);
      expect(currencies[1].code).toBe("AED");
    });

    it("updates currency exchange rate and logs audit action", async () => {
      const now = new Date();
      vi.mocked(prisma.currencyConfig.findUnique).mockResolvedValueOnce({
        code: "EGP",
        nameAr: "جنيه مصري",
        symbol: "ج.م",
        exchangeRateToUSD: 48.5,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["EG"],
        updatedAt: now,
      });

      vi.mocked(prisma.currencyConfig.update).mockResolvedValueOnce({
        code: "EGP",
        nameAr: "جنيه مصري",
        symbol: "ج.م",
        exchangeRateToUSD: 50.0,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["EG", "SD"],
        updatedAt: now,
      });

      const updated = await updateAdminCurrency(
        "EGP",
        {
          code: "EGP",
          exchangeRateToUSD: 50.0,
          autoDetectCountries: ["EG", "SD"],
        },
        TEST_ADMIN_ID
      );

      expect(updated.exchangeRateToUSD).toBe(50.0);
      expect(updated.autoDetectCountries).toEqual(["EG", "SD"]);
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "UPDATE_CURRENCY",
          entity: "CurrencyConfig",
          entityId: "EGP",
        }),
      });
    });
  });

  describe("Coupons Management", () => {
    it("retrieves coupon list", async () => {
      const now = new Date();
      vi.mocked(prisma.promotionCoupon.findMany).mockResolvedValueOnce([
        {
          id: "coupon_1",
          code: "FOUNDER50",
          descriptionAr: "خصم المؤسسين",
          discountType: "PERCENTAGE",
          discountValue: 50,
          maxUses: 100,
          usedCount: 23,
          maxUsesPerUser: 1,
          validFrom: now,
          validUntil: null,
          isActive: true,
          applicablePlanSlugs: ["pro", "agency"],
          createdAt: now,
        },
      ]);

      const coupons = await getAdminCoupons();
      expect(coupons).toHaveLength(1);
      expect(coupons[0].code).toBe("FOUNDER50");
      expect(coupons[0].discountValue).toBe(50);
    });

    it("creates coupon with uppercase code and uniqueness verification", async () => {
      const now = new Date();
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.promotionCoupon.create).mockResolvedValueOnce({
        id: "coupon_new",
        code: "SUMMER2026",
        descriptionAr: "عرض الصيف",
        discountType: "FIXED_AMOUNT",
        discountValue: 25,
        maxUses: 50,
        usedCount: 0,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: true,
        applicablePlanSlugs: ["pro"],
        createdAt: now,
      });

      const coupon = await createAdminCoupon(
        {
          code: "summer2026 ", // should be trimmed & uppercase
          descriptionAr: "عرض الصيف",
          discountType: "FIXED_AMOUNT",
          discountValue: 25,
          maxUses: 50,
          applicablePlanSlugs: ["pro"],
        },
        TEST_ADMIN_ID
      );

      expect(coupon.code).toBe("SUMMER2026");
      expect(prisma.promotionCoupon.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          code: "SUMMER2026",
          discountType: "FIXED_AMOUNT",
          discountValue: 25,
        }),
      });
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "CREATE_COUPON",
          entity: "PromotionCoupon",
          entityId: "coupon_new",
        }),
      });
    });

    it("throws error when creating duplicate coupon code", async () => {
      const now = new Date();
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValueOnce({
        id: "existing_cp",
        code: "DUPLICATE",
        descriptionAr: null,
        discountType: "PERCENTAGE",
        discountValue: 10,
        maxUses: null,
        usedCount: 0,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: true,
        applicablePlanSlugs: [],
        createdAt: now,
      });

      await expect(
        createAdminCoupon(
          {
            code: "DUPLICATE",
            discountType: "PERCENTAGE",
            discountValue: 10,
          },
          TEST_ADMIN_ID
        )
      ).rejects.toThrow(/رمز الكوبون مستخدم مسبقاً/);
    });

    it("toggles coupon active status", async () => {
      const now = new Date();
      vi.mocked(prisma.promotionCoupon.update).mockResolvedValueOnce({
        id: "coupon_1",
        code: "OFF50",
        descriptionAr: null,
        discountType: "PERCENTAGE",
        discountValue: 50,
        maxUses: null,
        usedCount: 5,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: false,
        applicablePlanSlugs: [],
        createdAt: now,
      });

      const toggled = await toggleAdminCoupon("coupon_1", false, TEST_ADMIN_ID);
      expect(toggled.isActive).toBe(false);
      expect(prisma.promotionCoupon.update).toHaveBeenCalledWith({
        where: { id: "coupon_1" },
        data: { isActive: false },
      });
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "TOGGLE_COUPON",
          entityId: "coupon_1",
        }),
      });
    });

    it("deletes coupon and logs audit action", async () => {
      const now = new Date();
      vi.mocked(prisma.promotionCoupon.delete).mockResolvedValueOnce({
        id: "coupon_to_del",
        code: "EXPIRED",
        descriptionAr: null,
        discountType: "PERCENTAGE",
        discountValue: 10,
        maxUses: null,
        usedCount: 0,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: false,
        applicablePlanSlugs: [],
        createdAt: now,
      });

      const res = await deleteAdminCoupon("coupon_to_del", TEST_ADMIN_ID);
      expect(res.success).toBe(true);
      expect(res.id).toBe("coupon_to_del");
      expect(prisma.promotionCoupon.delete).toHaveBeenCalledWith({
        where: { id: "coupon_to_del" },
      });
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: "DELETE_COUPON",
          entityId: "coupon_to_del",
        }),
      });
    });
  });

  describe("getAdminTransactions", () => {
    it("returns paginated transactions with user customerName and email", async () => {
      const now = new Date();
      vi.mocked(prisma.financialInvoice.findMany).mockResolvedValueOnce([
        {
          id: "inv_001",
          invoiceNumber: "INV-2026-0001",
          userId: "user_faisal",
          amountSubtotal: 100,
          discountAmount: 15,
          taxAmount: 12.75,
          amountTotal: 97.75,
          currency: "SAR",
          gatewayCode: "mada",
          gatewayTxId: "tx_mada_98765",
          status: "PAID",
          pdfUrl: "/invoices/inv_001.pdf",
          createdAt: now,
          user: {
            id: "user_faisal",
            username: "faisal",
            email: "faisal@example.com",
            profile: {
              displayName: "فيصل الشمري",
            },
          },
        },
      ] as any);
      vi.mocked(prisma.financialInvoice.count).mockResolvedValueOnce(45);

      const res = await getAdminTransactions({ page: 2, limit: 10, status: "PAID", gateway: "mada" });

      expect(res.total).toBe(45);
      expect(res.page).toBe(2);
      expect(res.limit).toBe(10);
      expect(res.totalPages).toBe(5);
      expect(res.items).toHaveLength(1);
      expect(res.items[0].customerName).toBe("فيصل الشمري");
      expect(res.items[0].customerEmail).toBe("faisal@example.com");
      expect(res.items[0].amountTotal).toBe(97.75);

      expect(prisma.financialInvoice.findMany).toHaveBeenCalledWith({
        where: {
          status: "PAID",
          gatewayCode: "mada",
        },
        skip: 10,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: expect.any(Object),
      });
    });
  });

  describe("refundAdminInvoice", () => {
    it("successfully refunds a paid invoice and logs audit", async () => {
      vi.mocked(prisma.financialInvoice.findUnique).mockResolvedValueOnce({
        id: "inv_123",
        invoiceNumber: "INV-2026-0099",
        amountTotal: 150.0,
        status: "PAID",
      } as any);

      vi.mocked(prisma.financialInvoice.update).mockResolvedValueOnce({
        id: "inv_123",
        invoiceNumber: "INV-2026-0099",
        amountTotal: 150.0,
        status: "REFUNDED",
      } as any);

      const result = await refundAdminInvoice("inv_123", "Customer requested cancellation", TEST_ADMIN_ID);

      expect(result.success).toBe(true);
      expect(result.invoiceId).toBe("inv_123");
      expect(result.status).toBe("REFUNDED");
      expect(result.refundedAmount).toBe(150.0);
      expect(prisma.financialInvoice.update).toHaveBeenCalledWith({
        where: { id: "inv_123" },
        data: { status: "REFUNDED" },
      });
      expect(prisma.financialAuditLog.create).toHaveBeenCalledWith({
        data: {
          adminId: TEST_ADMIN_ID,
          action: "REFUND_INVOICE",
          entity: "FinancialInvoice",
          entityId: "inv_123",
          details: {
            reason: "Customer requested cancellation",
            amount: 150.0,
            invoiceNumber: "INV-2026-0099",
          },
        },
      });
    });

    it("throws an error if the invoice does not exist", async () => {
      vi.mocked(prisma.financialInvoice.findUnique).mockResolvedValueOnce(null);

      await expect(
        refundAdminInvoice("inv_nonexistent", "reason", TEST_ADMIN_ID)
      ).rejects.toThrow("الفاتورة غير موجودة: inv_nonexistent");
    });

    it("throws an error if the invoice is already refunded", async () => {
      vi.mocked(prisma.financialInvoice.findUnique).mockResolvedValueOnce({
        id: "inv_already_refunded",
        status: "REFUNDED",
      } as any);

      await expect(
        refundAdminInvoice("inv_already_refunded", "reason", TEST_ADMIN_ID)
      ).rejects.toThrow("تم استرجاع هذه الفاتورة مسبقاً");
    });
  });

  describe("Modular Sub-services Re-export Verification", () => {
    it("ensures all sub-service functions are exported via @/features/admin/server/financials", () => {
      expect(typeof financialsBarrel.logFinancialAudit).toBe("function");
      expect(typeof financialsBarrel.getFinancialOverview).toBe("function");
      expect(typeof financialsBarrel.getAdminGateways).toBe("function");
      expect(typeof financialsBarrel.updateAdminGateway).toBe("function");
      expect(typeof financialsBarrel.getAdminPlans).toBe("function");
      expect(typeof financialsBarrel.upsertAdminPlan).toBe("function");
      expect(typeof financialsBarrel.deleteAdminPlan).toBe("function");
      expect(typeof financialsBarrel.updateAdminPlanQuotas).toBe("function");
      expect(typeof financialsBarrel.getAdminCurrencies).toBe("function");
      expect(typeof financialsBarrel.updateAdminCurrency).toBe("function");
      expect(typeof financialsBarrel.getAdminCoupons).toBe("function");
      expect(typeof financialsBarrel.createAdminCoupon).toBe("function");
      expect(typeof financialsBarrel.toggleAdminCoupon).toBe("function");
      expect(typeof financialsBarrel.deleteAdminCoupon).toBe("function");
      expect(typeof financialsBarrel.getAdminTransactions).toBe("function");
      expect(typeof financialsBarrel.refundAdminInvoice).toBe("function");
    });
  });

  describe("Admin Financials Route Handlers", () => {
    beforeEach(() => {
      vi.mocked(requireAdminSession).mockResolvedValue({
        authorized: true,
        user: {
          id: TEST_ADMIN_ID,
          username: "sysadmin",
          role: "ADMIN",
          email: "admin@anlinks.io",
        },
      });
    });

    it("overview/route.ts blocks unauthorized users with 401", async () => {
      vi.mocked(requireAdminSession).mockResolvedValueOnce({
        authorized: false,
        response: NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 }),
      });

      const res = await overviewRoute.GET();
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it("overview/route.ts returns 200 with stats for authorized admins", async () => {
      vi.mocked(prisma.paymentGateway.count).mockResolvedValue(5);
      vi.mocked(prisma.subscriptionPlan.count).mockResolvedValue(3);
      vi.mocked(prisma.currencyConfig.count).mockResolvedValue(4);
      vi.mocked(prisma.promotionCoupon.count).mockResolvedValue(2);
      vi.mocked(prisma.financialInvoice.count).mockResolvedValue(10);
      vi.mocked(prisma.financialInvoice.aggregate).mockResolvedValueOnce({
        _sum: { amountTotal: 1200 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const res = await overviewRoute.GET();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.totalRevenue).toBe(1200);
    });

    it("gateways/route.ts handles GET and PUT", async () => {
      const now = new Date();
      vi.mocked(prisma.paymentGateway.findMany).mockResolvedValueOnce([]);
      const getRes = await gatewaysRoute.GET();
      expect(getRes.status).toBe(200);

      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValueOnce({
        id: "gw_mada",
        code: "mada",
        nameAr: "مدى",
        nameEn: "Mada",
        category: "NATIONAL",
        isEnabled: false,
        isTestMode: true,
        publishableKey: null,
        secretKeyEncrypted: null,
        webhookSecret: null,
        feePercentage: 1.0,
        feeFixed: 1.0,
        supportedCurrencies: ["SAR"],
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      });
      vi.mocked(prisma.paymentGateway.update).mockResolvedValueOnce({
        id: "gw_mada",
        code: "mada",
        nameAr: "مدى",
        nameEn: "Mada",
        category: "NATIONAL",
        isEnabled: true,
        isTestMode: false,
        publishableKey: "pk_mada",
        secretKeyEncrypted: null,
        webhookSecret: null,
        feePercentage: 1.0,
        feeFixed: 1.0,
        supportedCurrencies: ["SAR"],
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      });

      const putReq = new NextRequest("http://localhost:3000/api/admin/financials/gateways", {
        method: "PUT",
        body: JSON.stringify({ id: "gw_mada", isEnabled: true }),
      });
      const putRes = await gatewaysRoute.PUT(putReq);
      expect(putRes.status).toBe(200);
      const putJson = await putRes.json();
      expect(putJson.success).toBe(true);
      expect(putJson.data.isEnabled).toBe(true);
    });

    it("plans/route.ts handles GET and POST", async () => {
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValueOnce([]);
      const getRes = await plansRoute.GET();
      expect(getRes.status).toBe(200);

      const postReq = new NextRequest("http://localhost:3000/api/admin/financials/plans", {
        method: "POST",
        body: JSON.stringify({
          slug: "creator",
          nameAr: "صانع المحتوى",
          nameEn: "Creator",
        }),
      });

      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "plan_creator",
          slug: "creator",
          nameAr: "صانع المحتوى",
          nameEn: "Creator",
          descriptionAr: null,
          badgeAr: null,
          isActive: true,
          sortOrder: 1,
          createdAt: now,
          updatedAt: now,
          prices: [],
          quotas: null,
          _count: { subscriptions: 0 },
        } as any);
      vi.mocked(prisma.subscriptionPlan.create).mockResolvedValueOnce({
        id: "plan_creator",
        slug: "creator",
        nameAr: "صانع المحتوى",
        nameEn: "Creator",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
      });

      const postRes = await plansRoute.POST(postReq);
      expect(postRes.status).toBe(201);
      const postJson = await postRes.json();
      expect(postJson.success).toBe(true);
      expect(postJson.data.slug).toBe("creator");
    });

    it("plans/[id]/route.ts handles PUT and DELETE", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.update).mockResolvedValueOnce({
        id: "plan_1",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      });
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_1",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
        prices: [],
        quotas: null,
        _count: { subscriptions: 0 },
      } as any);

      const putReq = new NextRequest("http://localhost:3000/api/admin/financials/plans/plan_1", {
        method: "PUT",
        body: JSON.stringify({
          slug: "pro",
          nameAr: "برو",
          nameEn: "Pro",
        }),
      });
      const putRes = await planIdRoute.PUT(putReq, { params: Promise.resolve({ id: "plan_1" }) });
      expect(putRes.status).toBe(200);

      // DELETE
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_1",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
        _count: { subscriptions: 0 },
      } as any);
      vi.mocked(prisma.subscriptionPlan.delete).mockResolvedValueOnce({
        id: "plan_1",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      });

      const delReq = new NextRequest("http://localhost:3000/api/admin/financials/plans/plan_1", {
        method: "DELETE",
      });
      const delRes = await planIdRoute.DELETE(delReq, { params: Promise.resolve({ id: "plan_1" }) });
      expect(delRes.status).toBe(200);
      const delJson = await delRes.json();
      expect(delJson.success).toBe(true);
      expect(delJson.deleted).toBe(true);
    });

    it("quotas/route.ts updates quotas", async () => {
      const now = new Date();
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValueOnce({
        id: "plan_pro",
        slug: "pro",
        nameAr: "برو",
        nameEn: "Pro",
        descriptionAr: null,
        badgeAr: null,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
      });
      vi.mocked(prisma.planQuota.upsert).mockResolvedValueOnce({
        id: "quota_pro",
        planId: "plan_pro",
        maxLinks: 200,
        allowCustomDomain: true,
        allowRemoveBranding: true,
        allowAdvancedThemes: true,
        allowDetailedAnalytics: true,
        allowPrioritySupport: true,
        customCssAllowed: true,
        storeCommissionRate: 3.0,
        allowAppointments: false,
        allowOutgoingWebhooks: false,
        allowAiCopilot: false,
      });

      const req = new NextRequest("http://localhost:3000/api/admin/financials/quotas", {
        method: "PUT",
        body: JSON.stringify({
          planId: "plan_pro",
          maxLinks: 200,
        }),
      });

      const res = await quotasRoute.PUT(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.maxLinks).toBe(200);
    });

    it("currencies/route.ts handles GET and PUT", async () => {
      const now = new Date();
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValueOnce([]);
      const getRes = await currenciesRoute.GET();
      expect(getRes.status).toBe(200);

      vi.mocked(prisma.currencyConfig.findUnique).mockResolvedValueOnce({
        code: "KWD",
        nameAr: "دينار كويتي",
        symbol: "د.ك",
        exchangeRateToUSD: 3.25,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["KW"],
        updatedAt: now,
      });
      vi.mocked(prisma.currencyConfig.update).mockResolvedValueOnce({
        code: "KWD",
        nameAr: "دينار كويتي",
        symbol: "د.ك",
        exchangeRateToUSD: 3.27,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["KW"],
        updatedAt: now,
      });

      const putReq = new NextRequest("http://localhost:3000/api/admin/financials/currencies", {
        method: "PUT",
        body: JSON.stringify({
          code: "KWD",
          exchangeRateToUSD: 3.27,
        }),
      });
      const putRes = await currenciesRoute.PUT(putReq);
      expect(putRes.status).toBe(200);
      const putJson = await putRes.json();
      expect(putJson.success).toBe(true);
      expect(putJson.data.exchangeRateToUSD).toBe(3.27);
    });

    it("coupons/route.ts and coupons/[id]/route.ts handle full coupon lifecycle", async () => {
      const now = new Date();
      vi.mocked(prisma.promotionCoupon.findMany).mockResolvedValueOnce([]);
      const getRes = await couponsRoute.GET();
      expect(getRes.status).toBe(200);

      // POST create
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.promotionCoupon.create).mockResolvedValueOnce({
        id: "cp_vip",
        code: "VIP100",
        descriptionAr: "خصم حصري",
        discountType: "PERCENTAGE",
        discountValue: 100,
        maxUses: 10,
        usedCount: 0,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: true,
        applicablePlanSlugs: ["agency"],
        createdAt: now,
      });

      const postReq = new NextRequest("http://localhost:3000/api/admin/financials/coupons", {
        method: "POST",
        body: JSON.stringify({
          code: "VIP100",
          discountType: "PERCENTAGE",
          discountValue: 100,
        }),
      });
      const postRes = await couponsRoute.POST(postReq);
      expect(postRes.status).toBe(201);

      // PATCH toggle
      vi.mocked(prisma.promotionCoupon.update).mockResolvedValueOnce({
        id: "cp_vip",
        code: "VIP100",
        descriptionAr: "خصم حصري",
        discountType: "PERCENTAGE",
        discountValue: 100,
        maxUses: 10,
        usedCount: 0,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: false,
        applicablePlanSlugs: ["agency"],
        createdAt: now,
      });
      const patchReq = new NextRequest("http://localhost:3000/api/admin/financials/coupons/cp_vip", {
        method: "PATCH",
        body: JSON.stringify({ isActive: false }),
      });
      const patchRes = await couponIdRoute.PATCH(patchReq, { params: Promise.resolve({ id: "cp_vip" }) });
      expect(patchRes.status).toBe(200);
      const patchJson = await patchRes.json();
      expect(patchJson.data.isActive).toBe(false);

      // DELETE
      vi.mocked(prisma.promotionCoupon.delete).mockResolvedValueOnce({
        id: "cp_vip",
        code: "VIP100",
        descriptionAr: null,
        discountType: "PERCENTAGE",
        discountValue: 100,
        maxUses: null,
        usedCount: 0,
        maxUsesPerUser: 1,
        validFrom: now,
        validUntil: null,
        isActive: false,
        applicablePlanSlugs: [],
        createdAt: now,
      });
      const delReq = new NextRequest("http://localhost:3000/api/admin/financials/coupons/cp_vip", {
        method: "DELETE",
      });
      const delRes = await couponIdRoute.DELETE(delReq, { params: Promise.resolve({ id: "cp_vip" }) });
      expect(delRes.status).toBe(200);
    });

    it("transactions/route.ts returns transactions list", async () => {
      vi.mocked(prisma.financialInvoice.findMany).mockResolvedValueOnce([]);
      vi.mocked(prisma.financialInvoice.count).mockResolvedValueOnce(0);

      const req = new NextRequest("http://localhost:3000/api/admin/financials/transactions?page=1&limit=20&status=PAID");
      const res = await transactionsRoute.GET(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.items).toEqual([]);
    });
  });
});
