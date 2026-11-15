import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  fetchFinancialOverview,
  fetchAdminGateways,
  updateAdminGateway,
  fetchAdminPlans,
  upsertAdminPlan,
  deleteAdminPlan,
  updateAdminPlanQuotas,
  fetchAdminCurrencies,
  updateAdminCurrency,
  fetchAdminCoupons,
  createAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
  fetchAdminTransactions,
} from "@/features/admin/services/admin-financials.client";
import { useAdminFinancials } from "@/features/admin/hooks/useAdminFinancials";
import {
  UpdateGatewayInput,
  UpsertPlanInput,
  UpdateCurrencyInput,
  CreateCouponInput,
  AdminTransactionsQuery,
} from "@/features/admin/types/admin.types";

describe("Admin Financials Client Service (admin-financials.client.ts)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function mockFetchResponse(status: number, data: unknown, statusText = "OK") {
    const fn = vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      statusText,
      json: async () => data,
    });
    globalThis.fetch = fn;
    return fn;
  }

  /* -------------------------------------------------------------------------
   * 1. Overview
   * ------------------------------------------------------------------------- */
  describe("fetchFinancialOverview", () => {
    it("should issue a GET request to /api/admin/financials/overview and unwrap data", async () => {
      const mockOverview = {
        totalGateways: 9,
        activeGateways: 6,
        totalPlans: 3,
        totalCurrencies: 4,
        totalCoupons: 5,
        totalInvoices: 120,
        totalRevenue: 45000,
      };

      const fetchMock = mockFetchResponse(200, { success: true, data: mockOverview });

      const result = await fetchFinancialOverview();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/overview");
      expect(init?.method).toBe("GET");
      expect(result).toEqual(mockOverview);
    });

    it("should throw a descriptive error when server returns an error JSON payload", async () => {
      mockFetchResponse(500, { success: false, error: "فشل استرجاع النظرة العامة المالية" });

      await expect(fetchFinancialOverview()).rejects.toThrow(
        "فشل استرجاع النظرة العامة المالية"
      );
    });

    it("should fall back to statusText if error payload is empty", async () => {
      mockFetchResponse(502, null, "Bad Gateway");

      await expect(fetchFinancialOverview()).rejects.toThrow("Bad Gateway");
    });
  });

  /* -------------------------------------------------------------------------
   * 2. Gateways
   * ------------------------------------------------------------------------- */
  describe("fetchAdminGateways", () => {
    it("should issue a GET request to /api/admin/financials/gateways", async () => {
      const mockGateways = [
        { id: "mada", code: "mada", nameAr: "مدى", nameEn: "Mada", isEnabled: true },
        { id: "apple_pay", code: "apple_pay", nameAr: "أبل باي", nameEn: "Apple Pay", isEnabled: true },
      ];

      const fetchMock = mockFetchResponse(200, { success: true, data: mockGateways });

      const result = await fetchAdminGateways();

      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/gateways", {
        method: "GET",
        headers: expect.any(Headers),
      });
      expect(result).toEqual(mockGateways);
    });
  });

  describe("updateAdminGateway", () => {
    it("should issue a PUT request with application/json Content-Type and payload", async () => {
      const input: UpdateGatewayInput = {
        id: "mada",
        isEnabled: true,
        isTestMode: false,
        publishableKey: "pk_live_mada_123",
        secretKey: "sk_live_mada_secret",
        feePercentage: 1.5,
        feeFixed: 1.0,
      };

      const mockUpdated = {
        id: "mada",
        code: "mada",
        nameAr: "مدى",
        nameEn: "Mada",
        isEnabled: true,
        isTestMode: false,
        publishableKey: "pk_live_mada_123",
        hasSecretKey: true,
      };

      const fetchMock = mockFetchResponse(200, { success: true, data: mockUpdated });

      const result = await updateAdminGateway(input);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/gateways");
      expect(init?.method).toBe("PUT");
      expect(init?.body).toBe(JSON.stringify(input));
      expect(result).toEqual(mockUpdated);
    });

    it("should throw an error when API rejects gateway update", async () => {
      mockFetchResponse(400, { success: false, error: "معرف بوابة الدفع غير صحيح" });

      await expect(
        updateAdminGateway({ id: "unknown" })
      ).rejects.toThrow("معرف بوابة الدفع غير صحيح");
    });
  });

  /* -------------------------------------------------------------------------
   * 3. Plans
   * ------------------------------------------------------------------------- */
  describe("fetchAdminPlans", () => {
    it("should issue a GET request to /api/admin/financials/plans", async () => {
      const mockPlans = [
        { id: "p1", slug: "free", nameAr: "المجانية", nameEn: "Free", isActive: true },
        { id: "p2", slug: "pro", nameAr: "المحترفة", nameEn: "Pro", isActive: true },
      ];

      const fetchMock = mockFetchResponse(200, { success: true, data: mockPlans });

      const result = await fetchAdminPlans();
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/plans", {
        method: "GET",
        headers: expect.any(Headers),
      });
      expect(result).toEqual(mockPlans);
    });
  });

  describe("upsertAdminPlan", () => {
    it("should issue a POST request when input.id is omitted (creating new plan)", async () => {
      const input: UpsertPlanInput = {
        slug: "enterprise",
        nameAr: "المؤسسات",
        nameEn: "Enterprise",
        isActive: true,
        prices: [
          { currency: "SAR", billingCycle: "MONTHLY", amount: 299, isActive: true },
        ],
      };

      const mockCreated = { id: "p_ent_1", ...input };
      const fetchMock = mockFetchResponse(201, { success: true, data: mockCreated });

      const result = await upsertAdminPlan(input);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/plans");
      expect(init?.method).toBe("POST");
      expect(init?.body).toBe(JSON.stringify(input));
      expect(result).toEqual(mockCreated);
    });

    it("should issue a PUT request with encoded id when input.id is provided", async () => {
      const input: UpsertPlanInput = {
        id: "plan-special/1",
        slug: "pro",
        nameAr: "المحترفة المحدثة",
        nameEn: "Pro Updated",
      };

      const mockUpdated = { ...input };
      const fetchMock = mockFetchResponse(200, { success: true, data: mockUpdated });

      const result = await upsertAdminPlan(input);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/plans/plan-special%2F1");
      expect(init?.method).toBe("PUT");
      expect(init?.body).toBe(JSON.stringify(input));
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("deleteAdminPlan", () => {
    it("should issue a DELETE request to /api/admin/financials/plans/:id", async () => {
      const fetchMock = mockFetchResponse(200, {
        success: true,
        deactivated: true,
        message: "تم تعطيل الباقة لوجود مشتركين نشطين",
      });

      const result = await deleteAdminPlan("plan-pro");

      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/plans/plan-pro", {
        method: "DELETE",
        headers: expect.any(Headers),
      });
      expect(result).toEqual({
        success: true,
        deactivated: true,
        message: "تم تعطيل الباقة لوجود مشتركين نشطين",
      });
    });
  });

  /* -------------------------------------------------------------------------
   * 4. Quotas
   * ------------------------------------------------------------------------- */
  describe("updateAdminPlanQuotas", () => {
    it("should issue a PUT request to /api/admin/financials/quotas with planId and quotas", async () => {
      const fetchMock = mockFetchResponse(200, {
        success: true,
        data: {
          planId: "plan-pro",
          maxLinks: 50,
          allowCustomDomain: true,
          storeCommissionRate: 2.5,
        },
      });

      const result = await updateAdminPlanQuotas("plan-pro", {
        maxLinks: 50,
        allowCustomDomain: true,
        storeCommissionRate: 2.5,
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/quotas");
      expect(init?.method).toBe("PUT");
      expect(JSON.parse(init?.body as string)).toEqual({
        planId: "plan-pro",
        maxLinks: 50,
        allowCustomDomain: true,
        storeCommissionRate: 2.5,
      });
      expect(result).toEqual({
        planId: "plan-pro",
        maxLinks: 50,
        allowCustomDomain: true,
        storeCommissionRate: 2.5,
      });
    });
  });

  /* -------------------------------------------------------------------------
   * 5. Currencies
   * ------------------------------------------------------------------------- */
  describe("fetchAdminCurrencies", () => {
    it("should issue a GET request to /api/admin/financials/currencies", async () => {
      const mockCurrencies = [
        { code: "SAR", symbol: "ر.س", exchangeRateToUSD: 3.75, isBaseCurrency: true },
        { code: "USD", symbol: "$", exchangeRateToUSD: 1.0, isBaseCurrency: false },
      ];

      const fetchMock = mockFetchResponse(200, { success: true, data: mockCurrencies });

      const result = await fetchAdminCurrencies();
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/currencies", {
        method: "GET",
        headers: expect.any(Headers),
      });
      expect(result).toEqual(mockCurrencies);
    });
  });

  describe("updateAdminCurrency", () => {
    it("should issue a PUT request to /api/admin/financials/currencies with code and properties", async () => {
      const input: UpdateCurrencyInput = {
        code: "AED",
        exchangeRateToUSD: 3.67,
        isActive: true,
        autoDetectCountries: ["AE"],
      };

      const mockUpdated = { ...input, symbol: "د.إ", nameAr: "درهم إماراتي" };
      const fetchMock = mockFetchResponse(200, { success: true, data: mockUpdated });

      const result = await updateAdminCurrency("AED", input);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/currencies");
      expect(init?.method).toBe("PUT");
      expect(JSON.parse(init?.body as string)).toEqual({
        code: "AED",
        exchangeRateToUSD: 3.67,
        isActive: true,
        autoDetectCountries: ["AE"],
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  /* -------------------------------------------------------------------------
   * 6. Coupons
   * ------------------------------------------------------------------------- */
  describe("fetchAdminCoupons", () => {
    it("should issue a GET request to /api/admin/financials/coupons", async () => {
      const mockCoupons = [
        { id: "c1", code: "LAUNCH50", discountType: "PERCENTAGE", discountValue: 50, isActive: true },
      ];

      const fetchMock = mockFetchResponse(200, { success: true, data: mockCoupons });

      const result = await fetchAdminCoupons();
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/coupons", {
        method: "GET",
        headers: expect.any(Headers),
      });
      expect(result).toEqual(mockCoupons);
    });
  });

  describe("createAdminCoupon", () => {
    it("should issue a POST request to /api/admin/financials/coupons with coupon data", async () => {
      const input: CreateCouponInput = {
        code: "PROMO20",
        discountType: "PERCENTAGE",
        discountValue: 20,
        maxUses: 100,
        applicablePlanSlugs: ["pro"],
      };

      const mockCreated = { id: "coup_new", ...input, usedCount: 0, isActive: true };
      const fetchMock = mockFetchResponse(201, { success: true, data: mockCreated });

      const result = await createAdminCoupon(input);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("/api/admin/financials/coupons");
      expect(init?.method).toBe("POST");
      expect(init?.body).toBe(JSON.stringify(input));
      expect(result).toEqual(mockCreated);
    });
  });

  describe("toggleAdminCoupon", () => {
    it("should issue a PATCH request to /api/admin/financials/coupons/:id with isActive boolean", async () => {
      const mockUpdated = { id: "coup_1", code: "SAVE10", isActive: false };
      const fetchMock = mockFetchResponse(200, { success: true, data: mockUpdated });

      const result = await toggleAdminCoupon("coup_1", false);

      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/coupons/coup_1", {
        method: "PATCH",
        body: JSON.stringify({ isActive: false }),
        headers: expect.any(Headers),
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("deleteAdminCoupon", () => {
    it("should issue a DELETE request to /api/admin/financials/coupons/:id", async () => {
      const fetchMock = mockFetchResponse(200, {
        success: true,
        data: { success: true, message: "تم حذف الكوبون بنجاح" },
      });

      const result = await deleteAdminCoupon("coup_1");

      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/coupons/coup_1", {
        method: "DELETE",
        headers: expect.any(Headers),
      });
      expect(result).toEqual({ success: true, message: "تم حذف الكوبون بنجاح" });
    });
  });

  /* -------------------------------------------------------------------------
   * 7. Transactions
   * ------------------------------------------------------------------------- */
  describe("fetchAdminTransactions", () => {
    it("should issue a GET request to /api/admin/financials/transactions without params when omitted", async () => {
      const mockResult = {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };

      const fetchMock = mockFetchResponse(200, { success: true, data: mockResult });

      const result = await fetchAdminTransactions();

      expect(fetchMock).toHaveBeenCalledWith("/api/admin/financials/transactions", {
        method: "GET",
        headers: expect.any(Headers),
      });
      expect(result).toEqual(mockResult);
    });

    it("should correctly format query string with page, limit, status, and gateway", async () => {
      const query: AdminTransactionsQuery = {
        page: 2,
        limit: 15,
        status: "COMPLETED",
        gateway: "mada",
      };

      const mockResult = {
        items: [{ id: "tx_1", invoiceNumber: "INV-001", amountTotal: 99 }],
        total: 1,
        page: 2,
        limit: 15,
        totalPages: 1,
      };

      const fetchMock = mockFetchResponse(200, { success: true, data: mockResult });

      const result = await fetchAdminTransactions(query);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe(
        "/api/admin/financials/transactions?page=2&limit=15&status=COMPLETED&gateway=mada"
      );
      expect(result).toEqual(mockResult);
    });
  });

  /* -------------------------------------------------------------------------
   * 8. Response Handling Edge Cases
   * ------------------------------------------------------------------------- */
  describe("Response parsing edge cases", () => {
    it("should throw error if response has success: false even with 200 OK", async () => {
      mockFetchResponse(200, { success: false, error: "فشل مصادقة الجلسة" });

      await expect(fetchFinancialOverview()).rejects.toThrow("فشل مصادقة الجلسة");
    });

    it("should return raw JSON when data property is undefined", async () => {
      const customPayload = { result: "ok", count: 12 };
      mockFetchResponse(200, customPayload);

      const res = await deleteAdminPlan("test-p");
      expect(res).toEqual(customPayload);
    });
  });
});

describe("Admin Financials React Hook (useAdminFinancials)", () => {
  it("should mount and provide initial state defaults", () => {
    let hookResult: ReturnType<typeof useAdminFinancials> | undefined;

    function TestComponent() {
      hookResult = useAdminFinancials("quotas");
      return React.createElement(
        "div",
        { "data-testid": "test-hook" },
        React.createElement("span", { "data-testid": "tab" }, hookResult.activeSubTab),
        React.createElement("span", { "data-testid": "loading" }, String(hookResult.isLoading)),
        React.createElement("span", { "data-testid": "saving" }, String(hookResult.isSaving)),
        React.createElement("span", { "data-testid": "gateways-count" }, hookResult.gateways.length)
      );
    }

    const html = renderToStaticMarkup(React.createElement(TestComponent));

    expect(html).toContain('data-testid="tab">quotas<');
    expect(html).toContain('data-testid="loading">true<');
    expect(html).toContain('data-testid="saving">false<');
    expect(html).toContain('data-testid="gateways-count">0<');

    const result = hookResult as ReturnType<typeof useAdminFinancials>;
    expect(result).toBeDefined();
    expect(result.activeSubTab).toBe("quotas");
    expect(result.overview).toBeNull();
    expect(result.gateways).toEqual([]);
    expect(result.plans).toEqual([]);
    expect(result.currencies).toEqual([]);
    expect(result.coupons).toEqual([]);
    expect(result.transactions).toBeNull();
    expect(result.error).toBeNull();
    expect(result.feedback).toBeNull();

    // Verify all mutation methods exist and are functions
    expect(typeof result.toggleGateway).toBe("function");
    expect(typeof result.updateGatewayConfig).toBe("function");
    expect(typeof result.savePlan).toBe("function");
    expect(typeof result.deletePlan).toBe("function");
    expect(typeof result.saveQuotas).toBe("function");
    expect(typeof result.saveCurrency).toBe("function");
    expect(typeof result.createCoupon).toBe("function");
    expect(typeof result.toggleCoupon).toBe("function");
    expect(typeof result.deleteCoupon).toBe("function");
    expect(typeof result.refreshData).toBe("function");
    expect(typeof result.filterTransactions).toBe("function");
    expect(typeof result.clearFeedback).toBe("function");
  });

  it("should default activeSubTab to 'gateways' when no initialSubTab is provided", () => {
    let hookResult: ReturnType<typeof useAdminFinancials> | undefined;

    function TestComponent() {
      hookResult = useAdminFinancials();
      return React.createElement("div", null, hookResult.activeSubTab);
    }

    const html = renderToStaticMarkup(React.createElement(TestComponent));

    const result = hookResult as ReturnType<typeof useAdminFinancials>;
    expect(html).toContain("gateways");
    expect(result.activeSubTab).toBe("gateways");
  });

  it("should return false when toggling unknown gateway or coupon", async () => {
    let hookResult: ReturnType<typeof useAdminFinancials> | undefined;

    function TestComponent() {
      hookResult = useAdminFinancials();
      return React.createElement("div", null, hookResult.activeSubTab);
    }

    renderToStaticMarkup(React.createElement(TestComponent));

    const result = hookResult as ReturnType<typeof useAdminFinancials>;
    expect(result).toBeDefined();
    const gatewayToggleRes = await result.toggleGateway("unknown-gateway");
    expect(gatewayToggleRes).toBe(false);

    const couponToggleRes = await result.toggleCoupon("unknown-coupon");
    expect(couponToggleRes).toBe(false);

    result.setFeedback({ type: "success", message: "Test message" });
    result.clearFeedback();
  });
});
