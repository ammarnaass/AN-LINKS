import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AdminFinancialsContainer,
  AdminPaymentsTab,
  DEFAULT_PLATFORM_SETTINGS,
} from "@/features/admin";
import {
  AdminGatewayDetails,
  AdminSubscriptionPlanItem,
  AdminCurrencyItem,
  AdminCouponItem,
  AdminTransactionsResult,
  FinancialOverviewStats,
  AdminTransaction,
} from "@/features/admin/types/admin.types";
import { FinancialSubTab, useAdminFinancials } from "@/features/admin/hooks/useAdminFinancials";

/* =========================================================================
 * Mock Fixtures
 * ========================================================================= */

const MOCK_GATEWAYS: AdminGatewayDetails[] = [
  {
    id: "gw-mada",
    code: "mada",
    nameAr: "مدى للبطاقات المصرفية",
    nameEn: "Mada Debit",
    category: "NATIONAL",
    isEnabled: true,
    isTestMode: false,
    publishableKey: "pk_live_mada_123",
    hasSecretKey: true,
    hasWebhookSecret: true,
    feePercentage: 1.75,
    feeFixed: 1.0,
    supportedCurrencies: ["SAR"],
    sortOrder: 1,
    updatedAt: "2026-11-15T00:00:00Z",
  },
  {
    id: "gw-tamara",
    code: "tamara",
    nameAr: "تمارا للتقسيط BNPL",
    nameEn: "Tamara BNPL",
    category: "BNPL",
    isEnabled: false,
    isTestMode: true,
    publishableKey: null,
    hasSecretKey: false,
    hasWebhookSecret: false,
    feePercentage: 4.5,
    feeFixed: 1.5,
    supportedCurrencies: ["SAR", "AED"],
    sortOrder: 2,
    updatedAt: "2026-11-15T00:00:00Z",
  },
  {
    id: "gw-stripe",
    code: "stripe",
    nameAr: "سترايب العالمية",
    nameEn: "Stripe Global",
    category: "INTERNATIONAL",
    isEnabled: true,
    isTestMode: false,
    publishableKey: "pk_live_stripe_999",
    hasSecretKey: true,
    hasWebhookSecret: true,
    feePercentage: 2.9,
    feeFixed: 1.0,
    supportedCurrencies: ["USD", "EUR", "SAR"],
    sortOrder: 3,
    updatedAt: "2026-11-15T00:00:00Z",
  },
];

const MOCK_PLANS: AdminSubscriptionPlanItem[] = [
  {
    id: "plan-creator",
    slug: "creator",
    nameAr: "باقة صانع المحتوى",
    nameEn: "Creator Plan",
    descriptionAr: "مثالية للمؤثرين والمبتدئين",
    badgeAr: "الأكثر شعبية",
    isActive: true,
    sortOrder: 1,
    prices: [
      { currency: "SAR", billingCycle: "MONTHLY", amount: 39, isActive: true },
      { currency: "SAR", billingCycle: "YEARLY", amount: 390, isActive: true },
      { currency: "USD", billingCycle: "MONTHLY", amount: 10, isActive: true },
    ],
    quotas: {
      maxLinks: 25,
      allowCustomDomain: true,
      allowRemoveBranding: false,
      allowAdvancedThemes: true,
      allowDetailedAnalytics: true,
      allowPrioritySupport: false,
      customCssAllowed: false,
      storeCommissionRate: 5.0,
    },
  },
  {
    id: "plan-pro",
    slug: "pro",
    nameAr: "باقة المحترفين",
    nameEn: "Pro Plan",
    descriptionAr: "للعلامات التجارية والشركات الناشئة",
    badgeAr: "قيمة استثنائية",
    isActive: true,
    sortOrder: 2,
    prices: [
      { currency: "SAR", billingCycle: "MONTHLY", amount: 89, isActive: true },
      { currency: "SAR", billingCycle: "YEARLY", amount: 890, isActive: true },
    ],
    quotas: {
      maxLinks: 100,
      allowCustomDomain: true,
      allowRemoveBranding: true,
      allowAdvancedThemes: true,
      allowDetailedAnalytics: true,
      allowPrioritySupport: true,
      customCssAllowed: true,
      storeCommissionRate: 2.5,
    },
  },
];

const MOCK_CURRENCIES: AdminCurrencyItem[] = [
  {
    code: "SAR",
    nameAr: "ريال سعودي",
    symbol: "ر.س",
    exchangeRateToUSD: 3.75,
    isBaseCurrency: true,
    isActive: true,
    autoDetectCountries: ["SA"],
    updatedAt: "2026-11-15T00:00:00Z",
  },
  {
    code: "USD",
    nameAr: "دولار أمريكي",
    symbol: "$",
    exchangeRateToUSD: 1.0,
    isBaseCurrency: false,
    isActive: true,
    autoDetectCountries: ["US"],
    updatedAt: "2026-11-15T00:00:00Z",
  },
];

const MOCK_COUPONS: AdminCouponItem[] = [
  {
    id: "cp-ramadan",
    code: "RAMADAN50",
    descriptionAr: "خصم رمضان المبارك 50%",
    discountType: "PERCENTAGE",
    discountValue: 50,
    maxUses: 100,
    maxUsesPerUser: 1,
    usedCount: 24,
    validFrom: "2026-03-01T00:00:00Z",
    validUntil: "2026-04-01T00:00:00Z",
    applicablePlanSlugs: ["creator", "pro"],
    isActive: true,
    createdAt: "2026-03-01T00:00:00Z",
  },
];

const MOCK_TRANSACTIONS: AdminTransactionsResult = {
  items: [
    {
      id: "tx-1",
      invoiceNumber: "INV-2026-0001",
      userId: "u-1",
      customerName: "سلطان القحطاني",
      customerEmail: "sultan@example.com",
      amountSubtotal: 33.91,
      discountAmount: 0,
      taxAmount: 5.09,
      amountTotal: 39.0,
      currency: "SAR",
      gatewayCode: "mada",
      gatewayTxId: "mada_ch_12345",
      status: "COMPLETED",
      pdfUrl: "https://storage.example.com/invoices/inv-1.pdf",
      createdAt: "2026-11-15T01:00:00Z",
    },
  ],
  total: 42,
  page: 1,
  limit: 10,
  totalPages: 5,
};

const MOCK_OVERVIEW: FinancialOverviewStats = {
  totalGateways: 3,
  activeGateways: 2,
  totalPlans: 2,
  totalCurrencies: 2,
  totalCoupons: 1,
  totalInvoices: 42,
  totalRevenue: 15420,
};

const MOCK_LEGACY_TRANSACTIONS: AdminTransaction[] = [
  {
    id: "tx-legacy-1",
    transactionNumber: "TX-9901",
    customerName: "فهد العتيبي",
    customerEmail: "fahad@example.com",
    amount: 89,
    currency: "SAR",
    gateway: "mada",
    plan: "PRO_MONTHLY",
    status: "COMPLETED",
    createdAt: "2026-11-14T12:00:00Z",
  },
];

function createMockFinancialsHook(
  overrides: Partial<ReturnType<typeof useAdminFinancials>> = {}
) {
  return {
    activeSubTab: "gateways" as FinancialSubTab,
    setActiveSubTab: vi.fn(),
    overview: MOCK_OVERVIEW,
    gateways: MOCK_GATEWAYS,
    plans: MOCK_PLANS,
    currencies: MOCK_CURRENCIES,
    coupons: MOCK_COUPONS,
    transactions: MOCK_TRANSACTIONS,
    isLoading: false,
    isSaving: false,
    error: null,
    feedback: null,
    clearFeedback: vi.fn(),
    setFeedback: vi.fn(),
    setError: vi.fn(),
    toggleGateway: vi.fn().mockResolvedValue(true),
    updateGatewayConfig: vi.fn().mockResolvedValue(true),
    savePlan: vi.fn().mockResolvedValue(true),
    deletePlan: vi.fn().mockResolvedValue(true),
    saveQuotas: vi.fn().mockResolvedValue(true),
    saveCurrency: vi.fn().mockResolvedValue(true),
    addCurrency: vi.fn().mockResolvedValue(true),
    syncRates: vi.fn().mockResolvedValue(true),
    createCoupon: vi.fn().mockResolvedValue(true),
    toggleCoupon: vi.fn().mockResolvedValue(true),
    deleteCoupon: vi.fn().mockResolvedValue(true),
    refreshData: vi.fn().mockResolvedValue(undefined),
    filterTransactions: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

/* =========================================================================
 * UI Unit Test Suites
 * ========================================================================= */

describe("Admin Financials UI & Container Suite", () => {
  describe("Overview Statistics Bar", () => {
    it("should render overview metrics for gateways, plans, currencies, coupons, and total revenue", () => {
      const mockHook = createMockFinancialsHook();
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      // Gateways stat card
      expect(html).toContain("بوابات الدفع");
      expect(html).toContain("2 / 3");
      expect(html).toContain("2 بوابات نشطة");

      // Plans stat card
      expect(html).toContain("باقات الاشتراك");
      expect(html).toContain("2");
      expect(html).toContain("2 إجمالي الباقات");

      // Currencies stat card
      expect(html).toContain("العملات المدعومة");
      expect(html).toContain("SAR العملة الأساسية");

      // Coupons stat card
      expect(html).toContain("كوبونات الخصم");
      expect(html).toContain("1 إجمالي الكوبونات");

      // Revenue stat card
      expect(html).toContain("إجمالي التحصيل");
      expect(html).toContain("ر.س");
      expect(html).toContain("42 عملية مسجلة");
    });

    it("should compute accurate fallback numbers when overview is null", () => {
      const mockHook = createMockFinancialsHook({
        overview: null,
      });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      // Fallback: activeGateways = 2, total = 3
      expect(html).toContain("2 / 3");
      expect(html).toContain("بوابات الدفع");
    });
  });

  describe("Responsive Arabic Navigation Tabs", () => {
    it("should render all 6 sub-tabs with correct Arabic labels and count badges", () => {
      const mockHook = createMockFinancialsHook();
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("بوابات الدفع");
      expect(html).toContain("باقات الاشتراك");
      expect(html).toContain("المحددات والمميزات");
      expect(html).toContain("العملات وأسعار الصرف");
      expect(html).toContain("كوبونات الخصم");
      expect(html).toContain("المعاملات والفواتير");

      // Verify role and aria attributes
      expect(html).toContain('role="tablist"');
      expect(html).toContain('aria-label="تبويبات الإدارة المالية"');
      expect(html).toContain('aria-selected="true"');
    });
  });

  describe("Sub-Tab View Switching", () => {
    it("should render GatewaysSubTab when activeSubTab is 'gateways'", () => {
      const mockHook = createMockFinancialsHook({ activeSubTab: "gateways" });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("بوابات الدفع الوطنية (السعودية والخليج ومصر)");
      expect(html).toContain("مدى للبطاقات المصرفية");
      expect(html).toContain("سترايب العالمية");
      expect(html).toContain("إعداد المفاتيح والربط");

      // Should NOT render plans or coupons tables
      expect(html).not.toContain("حدود ومحددات مميزات الباقات");
      expect(html).not.toContain("RAMADAN50");
    });

    it("should render PlansSubTab when activeSubTab is 'plans'", () => {
      const mockHook = createMockFinancialsHook({ activeSubTab: "plans" });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("باقات الاشتراك والتسعير");
      expect(html).toContain("إضافة باقة جديدة");
      expect(html).toContain("باقة صانع المحتوى");
      expect(html).toContain("باقة المحترفين");
      expect(html).toContain("تعديل الباقة");
      expect(html).not.toContain("بوابات الدفع الوطنية (السعودية والخليج ومصر)");
    });

    it("should render PlanQuotasSubTab when activeSubTab is 'quotas'", () => {
      const mockHook = createMockFinancialsHook({ activeSubTab: "quotas" });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("حدود ومحددات مميزات الباقات");
      expect(html).toContain("أقصى عدد للروابط النشطة");
      expect(html).toContain("نسبة عمولة المنصة على المبيعات (%)");
      expect(html).toContain("ربط نطاق خاص (Custom Domain)");
      expect(html).not.toContain("سجل العمليات والفواتير والاشتراكات");
    });

    it("should render CurrenciesSubTab when activeSubTab is 'currencies'", () => {
      const mockHook = createMockFinancialsHook({ activeSubTab: "currencies" });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("إدارة العملات وأسعار الصرف العالمية");
      expect(html).toContain("ريال سعودي");
      expect(html).toContain("العملة المرجعية");
      expect(html).toContain("تعديل سعر الصرف");
      expect(html).not.toContain("إنشاء كود خصم جديد");
    });

    it("should render CouponsSubTab when activeSubTab is 'coupons'", () => {
      const mockHook = createMockFinancialsHook({ activeSubTab: "coupons" });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("إدارة أكواد الخصم والعروض الترويجية");
      expect(html).toContain("إنشاء كود خصم جديد");
      expect(html).toContain("RAMADAN50");
      expect(html).toContain("50% خصم");
      expect(html).not.toContain("بوابات الدفع العالمية والبطاقات");
    });

    it("should render InvoicesTransactionsSubTab when activeSubTab is 'transactions'", () => {
      const mockHook = createMockFinancialsHook({ activeSubTab: "transactions" });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("البحث برقم الفاتورة، اسم العميل أو بريده...");
      expect(html).toContain("INV-2026-0001");
      expect(html).toContain("سلطان القحطاني");
      expect(html).toContain("sultan@example.com");
      expect(html).toContain("PDF");
      expect(html).not.toContain("حدود ومحددات مميزات الباقات");
    });
  });

  describe("Opening Modal Dialogs from Container State & Respective Sub-Tabs", () => {
    it("should open and render GatewayConfigModal when initialModal is 'gateway'", () => {
      const mockHook = createMockFinancialsHook();
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer
          customHook={mockHook}
          initialModal="gateway"
          initialModalData={MOCK_GATEWAYS[0]}
        />
      );

      expect(html).toContain("إعدادات بوابة مدى للبطاقات المصرفية");
      expect(html).toContain("المفتاح العام (Publishable / Public API Key)");
      expect(html).toContain("المفتاح السري (Secret Key)");
      expect(html).toContain("مضبوط ومشفّر");
      expect(html).toContain("حفظ المفاتيح والإعدادات");
    });

    it("should open and render PlanEditorModal when initialModal is 'plan'", () => {
      const mockHook = createMockFinancialsHook();
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer
          customHook={mockHook}
          initialModal="plan"
          initialModalData={MOCK_PLANS[0]}
        />
      );

      expect(html).toContain("تعديل باقة باقة صانع المحتوى");
      expect(html).toContain("مصفوفة التسعير متعددة العملات");
      expect(html).toContain("SAR");
      expect(html).toContain("USD");
      expect(html).toContain("حفظ تعديلات الباقة");
    });

    it("should open and render CouponEditorModal when initialModal is 'coupon'", () => {
      const mockHook = createMockFinancialsHook();
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer
          customHook={mockHook}
          initialModal="coupon"
        />
      );

      expect(html).toContain("إنشاء كود خصم جديد");
      expect(html).toContain("رمز الكود (Coupon Code)");
      expect(html).toContain("نوع الخصم");
      expect(html).toContain("نسبة مئوية (%)");
      expect(html).toContain("إنشاء كود الخصم");
    });

    it("should open and render CurrencyRateModal when initialModal is 'currency'", () => {
      const mockHook = createMockFinancialsHook();
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer
          customHook={mockHook}
          initialModal="currency"
          initialModalData={MOCK_CURRENCIES[0]}
        />
      );

      expect(html).toContain("تعديل سعر صرف ريال سعودي");
      expect(html).toContain("سعر الصرف مقابل 1 دولار أمريكي");
      expect(html).toContain("رموز الدول للكشف التلقائي");
      expect(html).toContain("حفظ سعر الصرف");
    });
  });

  describe("Feedback and Error Banners", () => {
    it("should render success feedback banner when feedback is provided", () => {
      const mockHook = createMockFinancialsHook({
        feedback: {
          type: "success",
          message: "تم تفعيل بوابة الدفع بنجاح",
        },
      });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("تم تفعيل بوابة الدفع بنجاح");
      expect(html).toContain('role="status"');
    });

    it("should render error feedback banner when feedback is an error", () => {
      const mockHook = createMockFinancialsHook({
        feedback: {
          type: "error",
          message: "فشل حفظ باقة الاشتراك",
        },
      });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("فشل حفظ باقة الاشتراك");
      expect(html).toContain('role="status"');
    });

    it("should render global error banner when error string is present", () => {
      const mockHook = createMockFinancialsHook({
        error: "حدث خطأ غير متوقع في جلب البيانات",
      });
      const html = renderToStaticMarkup(
        <AdminFinancialsContainer customHook={mockHook} />
      );

      expect(html).toContain("حدث خطأ غير متوقع في جلب البيانات");
      expect(html).toContain('role="alert"');
    });
  });

  describe("Backward Compatibility: AdminPaymentsTab Integration", () => {
    it("should mount AdminFinancialsContainer when rendered with NO props", () => {
      const html = renderToStaticMarkup(<AdminPaymentsTab />);

      expect(html).toContain("إدارة بوابات الدفع والاشتراكات والعمليات المالية");
      expect(html).toContain("بوابات الدفع");
      expect(html).toContain("باقات الاشتراك");
      expect(html).toContain("المعاملات والفواتير");
    });

    it("should accept legacy props (settings, transactions, onUpdateSettings) without crashing", () => {
      const onUpdateSettings = vi.fn().mockResolvedValue(true);
      const html = renderToStaticMarkup(
        <AdminPaymentsTab
          settings={DEFAULT_PLATFORM_SETTINGS}
          transactions={MOCK_LEGACY_TRANSACTIONS}
          onUpdateSettings={onUpdateSettings}
        />
      );

      expect(html).toContain("إدارة بوابات الدفع والاشتراكات والعمليات المالية");
      expect(html).toContain("بوابات الدفع");
      expect(html).toContain("المحددات والمميزات");
    });

    it("should accept initialSubTab prop through AdminPaymentsTab", () => {
      const html = renderToStaticMarkup(
        <AdminPaymentsTab initialSubTab="plans" />
      );

      expect(html).toContain("باقات الاشتراك");
      expect(html).toContain("باقات الاشتراك والتسعير");
      expect(html).toContain("إدارة بوابات الدفع والاشتراكات والعمليات المالية");
    });
  });
});
