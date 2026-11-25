import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";

import * as plansRoute from "@/app/api/subscriptions/plans/route";
import * as validateCouponRoute from "@/app/api/subscriptions/validate-coupon/route";
import * as checkoutRoute from "@/app/api/subscriptions/checkout/route";
import * as webhookRoute from "@/app/api/subscriptions/webhooks/[gateway]/route";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/shared/db", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockPrisma: any = {
    currencyConfig: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    subscriptionPlan: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    promotionCoupon: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    paymentGateway: {
      findUnique: vi.fn(),
    },
    financialInvoice: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    userSubscription: {
      upsert: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction: vi.fn(async (cb: (tx: any) => Promise<any>) => {
      return await cb(mockPrisma);
    }),
  };

  return { prisma: mockPrisma };
});

import { prisma } from "@/shared/db";

describe("Public Subscription APIs & Webhook Processor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // 1. GET /api/subscriptions/plans
  // =========================================================================
  describe("GET /api/subscriptions/plans", () => {
    const mockCurrencies = [
      {
        code: "SAR",
        nameAr: "ريال سعودي",
        symbol: "ر.س",
        exchangeRateToUSD: 3.75,
        isBaseCurrency: true,
        isActive: true,
        autoDetectCountries: ["SA"],
      },
      {
        code: "AED",
        nameAr: "درهم إماراتي",
        symbol: "د.إ",
        exchangeRateToUSD: 3.67,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["AE"],
      },
      {
        code: "EGP",
        nameAr: "جنيه مصري",
        symbol: "ج.م",
        exchangeRateToUSD: 50.0,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["EG"],
      },
      {
        code: "USD",
        nameAr: "دولار أمريكي",
        symbol: "$",
        exchangeRateToUSD: 1.0,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["US"],
      },
    ];

    const mockPlans = [
      {
        id: "plan_free",
        slug: "free",
        nameAr: "المجانية",
        nameEn: "Free",
        isActive: true,
        sortOrder: 1,
        prices: [
          { id: "p_1", currency: "SAR", billingCycle: "MONTHLY", amount: 0 },
        ],
        quotas: { maxLinks: 5, allowCustomDomain: false },
      },
      {
        id: "plan_pro",
        slug: "pro",
        nameAr: "المحترف",
        nameEn: "Pro",
        isActive: true,
        sortOrder: 2,
        prices: [
          { id: "p_2", currency: "SAR", billingCycle: "MONTHLY", amount: 49 },
          { id: "p_3", currency: "AED", billingCycle: "MONTHLY", amount: 49 },
        ],
        quotas: { maxLinks: 100, allowCustomDomain: true },
      },
    ];

    it("falls back to 'SA' and base currency 'SAR' when no country headers or params are sent", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValue(mockCurrencies as any);
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValue(mockPlans as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/plans");
      const res = await plansRoute.GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.country).toBe("SA");
      expect(json.currency.code).toBe("SAR");
      expect(json.plans).toHaveLength(2);
    });

    it("detects country from 'cf-ipcountry' header and selects matching currency", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValue(mockCurrencies as any);
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValue(mockPlans as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/plans", {
        headers: { "cf-ipcountry": "ae" },
      });
      const res = await plansRoute.GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.country).toBe("AE");
      expect(json.currency.code).toBe("AED");
      expect(json.currency.symbol).toBe("د.إ");
    });

    it("detects country from 'x-vercel-ip-country' header", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValue(mockCurrencies as any);
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValue(mockPlans as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/plans", {
        headers: { "x-vercel-ip-country": "EG" },
      });
      const res = await plansRoute.GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.country).toBe("EG");
      expect(json.currency.code).toBe("EGP");
    });

    it("allows query parameter '?country=' to override country headers", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValue(mockCurrencies as any);
      vi.mocked(prisma.subscriptionPlan.findMany).mockResolvedValue(mockPlans as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/plans?country=US", {
        headers: { "cf-ipcountry": "SA" },
      });
      const res = await plansRoute.GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.country).toBe("US");
      expect(json.currency.code).toBe("USD");
    });

    it("returns 500 when database fails", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockRejectedValue(new Error("DB Error"));

      const req = new NextRequest("http://localhost:3000/api/subscriptions/plans");
      const res = await plansRoute.GET(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
    });
  });

  // =========================================================================
  // 2. POST /api/subscriptions/validate-coupon
  // =========================================================================
  describe("POST /api/subscriptions/validate-coupon", () => {
    it("returns 400 when coupon code is empty or missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "   " }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.valid).toBe(false);
      expect(json.error).toBeDefined();
    });

    it("returns 400 when coupon does not exist", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "NONEXISTENT" }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.valid).toBe(false);
    });

    it("returns 400 when coupon is deactivated", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c1",
        code: "INACTIVE50",
        isActive: false,
        discountType: "PERCENTAGE",
        discountValue: 50,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "INACTIVE50" }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.valid).toBe(false);
      expect(json.error).toContain("غير فعال");
    });

    it("returns 400 when coupon has expired", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c2",
        code: "EXPIRED20",
        isActive: true,
        validUntil: new Date("2020-01-01"),
        discountType: "PERCENTAGE",
        discountValue: 20,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "EXPIRED20" }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.valid).toBe(false);
      expect(json.error).toContain("انتهت");
    });

    it("returns 400 when coupon max usage is reached", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c3",
        code: "MAXEDOUT",
        isActive: true,
        maxUses: 10,
        usedCount: 10,
        discountType: "PERCENTAGE",
        discountValue: 20,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "MAXEDOUT" }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.valid).toBe(false);
      expect(json.error).toContain("استنفاد");
    });

    it("returns 400 when coupon is not applicable to the requested planSlug", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c4",
        code: "AGENCYONLY",
        isActive: true,
        applicablePlanSlugs: ["agency"],
        discountType: "PERCENTAGE",
        discountValue: 30,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "AGENCYONLY", planSlug: "creator" }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.valid).toBe(false);
      expect(json.error).toContain("غير متاح للباقة");
    });

    it("successfully validates PERCENTAGE coupon and computes discount amount and final amount", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c5",
        code: "LAUNCH20",
        isActive: true,
        discountType: "PERCENTAGE",
        discountValue: 20,
        usedCount: 5,
        maxUses: 100,
        applicablePlanSlugs: ["pro", "agency"],
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "launch20", planSlug: "pro", amount: 200 }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.valid).toBe(true);
      expect(json.coupon.code).toBe("LAUNCH20");
      expect(json.discountAmount).toBe(40);
      expect(json.finalAmount).toBe(160);
    });

    it("successfully validates FIXED_AMOUNT coupon and caps discount at base amount", async () => {
      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c6",
        code: "FLAT50",
        isActive: true,
        discountType: "FIXED_AMOUNT",
        discountValue: 50,
        usedCount: 0,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/validate-coupon", {
        method: "POST",
        body: JSON.stringify({ code: "FLAT50", amount: 30 }),
      });
      const res = await validateCouponRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.valid).toBe(true);
      expect(json.discountAmount).toBe(30);
      expect(json.finalAmount).toBe(0);
    });
  });

  // =========================================================================
  // 3. POST /api/subscriptions/checkout
  // =========================================================================
  describe("POST /api/subscriptions/checkout", () => {
    it("returns 401 when user is not authenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_pro",
          billingCycle: "MONTHLY",
          gatewayCode: "mada",
        }),
      });
      const res = await checkoutRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.success).toBe(false);
    });

    it("returns 400 when required fields are missing", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user_123", email: "test@example.com" },
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/checkout", {
        method: "POST",
        body: JSON.stringify({ planId: "plan_pro" }),
      });
      const res = await checkoutRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("returns 400 if plan is not found or inactive", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user_123" },
      } as any);
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValue(null);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "invalid_plan",
          billingCycle: "MONTHLY",
          gatewayCode: "mada",
        }),
      });
      const res = await checkoutRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("الباقة");
    });

    it("returns 400 if payment gateway is disabled or not found", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user_123" },
      } as any);
      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValue({
        id: "plan_pro",
        slug: "pro",
        isActive: true,
        prices: [],
      } as any);
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "disabled_gw",
        isEnabled: false,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_pro",
          billingCycle: "MONTHLY",
          gatewayCode: "disabled_gw",
        }),
      });
      const res = await checkoutRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("بوابة الدفع");
    });

    it("creates pending invoice and returns checkoutUrl for authenticated user with coupon", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({
        user: { id: "user_buyer_1" },
      } as any);

      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValue({
        id: "plan_pro",
        slug: "pro",
        isActive: true,
        prices: [
          {
            currency: "SAR",
            billingCycle: "MONTHLY",
            amount: 100,
            isActive: true,
          },
        ],
      } as any);

      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "mada",
        isEnabled: true,
      } as any);

      vi.mocked(prisma.promotionCoupon.findUnique).mockResolvedValue({
        id: "c_pro",
        code: "SAVE25",
        isActive: true,
        discountType: "PERCENTAGE",
        discountValue: 25,
        applicablePlanSlugs: ["pro"],
      } as any);

      vi.mocked(prisma.financialInvoice.create).mockResolvedValueOnce({
        id: "inv_created_123",
        userId: "user_buyer_1",
        planId: "plan_pro",
        billingCycle: "MONTHLY",
        invoiceNumber: "INV-1234567890",
        amountSubtotal: 100,
        discountAmount: 25,
        taxAmount: 0.0,
        amountTotal: 75,
        currency: "SAR",
        status: "PENDING",
        gatewayCode: "mada",
        gatewayTxId: "tx_mada_123456",
        pdfUrl: null,
        paidAt: null,
        createdAt: new Date(),
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/checkout", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_pro",
          billingCycle: "MONTHLY",
          gatewayCode: "mada",
          currency: "SAR",
          couponCode: "SAVE25",
        }),
      });

      const res = await checkoutRoute.POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.checkoutUrl).toBe("/checkout/session/inv_created_123");
      expect(json.invoice.amountTotal).toBe(75);
      expect(json.invoice.currency).toBe("SAR");
      expect(json.gatewayTxId).toMatch(/^tx_mada_/);

      expect(prisma.financialInvoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user_buyer_1",
            planId: "plan_pro",
            amountSubtotal: 100,
            discountAmount: 25,
            amountTotal: 75,
            status: "PENDING",
            gatewayCode: "mada",
          }),
        })
      );
    });
  });

  // =========================================================================
  // 4. POST /api/subscriptions/webhooks/[gateway]
  // =========================================================================
  describe("POST /api/subscriptions/webhooks/[gateway]", () => {
    it("returns 400 for invalid JSON body", async () => {
      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/mada", {
        method: "POST",
        body: "{ invalid json ...",
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "mada" }),
      });
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBeDefined();
    });

    it("returns 401 when signature/secret verification fails", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "stripe",
        webhookSecret: "secret_webhook_key_123",
        isTestMode: false,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/stripe", {
        method: "POST",
        headers: { "x-signature": "invalid" },
        body: JSON.stringify({ gatewayTxId: "tx_123" }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "stripe" }),
      });
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toContain("Invalid signature");
    });

    it("returns 401 when signature/secret is completely missing in live mode", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "stripe",
        webhookSecret: "secret_webhook_key_123",
        isTestMode: false,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({ gatewayTxId: "tx_123" }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "stripe" }),
      });
      const json = await res.json();

      expect(res.status).toBe(401);
      expect(json.error).toContain("Missing webhook signature");
    });

    it("returns 400 when transaction identifier is missing", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "mada",
        webhookSecret: null,
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/mada", {
        method: "POST",
        body: JSON.stringify({ event: "charge.succeeded" }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "mada" }),
      });
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("gatewayTxId");
    });

    it("returns 200 with idempotent: true when repeated webhook is received for already PAID invoice", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "mada",
        webhookSecret: null,
      } as any);

      vi.mocked(prisma.financialInvoice.findFirst).mockResolvedValueOnce({
        id: "inv_paid_1",
        gatewayTxId: "tx_mada_already_paid",
        status: "PAID",
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/mada", {
        method: "POST",
        body: JSON.stringify({ gatewayTxId: "tx_mada_already_paid" }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "mada" }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
      expect(json.idempotent).toBe(true);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("returns 404 when invoice does not exist", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "mada",
      } as any);
      vi.mocked(prisma.financialInvoice.findFirst)
        .mockResolvedValueOnce(null) // for idempotency check (status: "PAID")
        .mockResolvedValueOnce(null); // for pending invoice search

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/mada", {
        method: "POST",
        body: JSON.stringify({ gatewayTxId: "tx_nonexistent" }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "mada" }),
      });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error).toContain("Invoice not found");
    });

    it("successfully activates user subscription, marks invoice PAID, updates role to PRO, and increments coupon usedCount", async () => {
      vi.mocked(prisma.paymentGateway.findUnique).mockResolvedValue({
        code: "mada",
        webhookSecret: null,
      } as any);

      // 1. Idempotency check returns null (not paid yet)
      vi.mocked(prisma.financialInvoice.findFirst)
        .mockResolvedValueOnce(null)
        // 2. Pending invoice found
        .mockResolvedValueOnce({
          id: "inv_pending_99",
          userId: "user_target_456",
          planId: "plan_pro_id",
          billingCycle: "MONTHLY",
          currency: "SAR",
          amountTotal: 49,
          discountAmount: 10,
          gatewayTxId: "tx_mada_success_99",
          status: "PENDING",
        } as any);

      vi.mocked(prisma.subscriptionPlan.findUnique).mockResolvedValue({
        id: "plan_pro_id",
        slug: "pro",
      } as any);

      const req = new NextRequest("http://localhost:3000/api/subscriptions/webhooks/mada", {
        method: "POST",
        body: JSON.stringify({
          gatewayTxId: "tx_mada_success_99",
          couponCode: "SAVE10",
        }),
      });

      const res = await webhookRoute.POST(req, {
        params: Promise.resolve({ gateway: "mada" }),
      });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.processed).toBe(true);

      // Verify invoice update
      expect(prisma.financialInvoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "inv_pending_99" },
          data: expect.objectContaining({
            status: "PAID",
            paidAt: expect.any(Date),
          }),
        })
      );

      // Verify user subscription upsert
      expect(prisma.userSubscription.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user_target_456" },
          update: expect.objectContaining({
            planId: "plan_pro_id",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            currency: "SAR",
            amountPaid: 49,
            gatewayCode: "mada",
          }),
          create: expect.objectContaining({
            userId: "user_target_456",
            planId: "plan_pro_id",
            status: "ACTIVE",
            billingCycle: "MONTHLY",
            currency: "SAR",
            amountPaid: 49,
            gatewayCode: "mada",
          }),
        })
      );

      // Verify user promoted to PRO
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user_target_456" },
        data: { role: "PRO" },
      });

      // Verify coupon increment
      expect(prisma.promotionCoupon.updateMany).toHaveBeenCalledWith({
        where: { code: "SAVE10" },
        data: { usedCount: { increment: 1 } },
      });
    });
  });
});
