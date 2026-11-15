import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  GatewaysSubTab,
  PlansSubTab,
  PlanQuotasSubTab,
  CurrenciesSubTab,
  CouponsSubTab,
  InvoicesTransactionsSubTab,
  GatewayConfigModal,
  PlanEditorModal,
  CouponEditorModal,
  CurrencyRateModal,
} from "@/features/admin";
import {
  AdminGatewayDetails,
  AdminSubscriptionPlanItem,
  AdminCurrencyItem,
  AdminCouponItem,
  AdminTransactionsResult,
} from "@/features/admin/types/admin.types";

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
    publishableKey: "pk_mada_test",
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
    nameEn: "Tamara",
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
    publishableKey: "pk_live_stripe_xyz",
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
      { currency: "USD", billingCycle: "YEARLY", amount: 100, isActive: true },
    ],
    quotas: {
      maxLinks: 25,
      allowCustomDomain: true,
      allowRemoveBranding: false,
      allowAdvancedThemes: true,
      allowDetailedAnalytics: true,
      allowPrioritySupport: false,
      customCssAllowed: false,
      storeCommissionRate: 7.5,
    },
  },
  {
    id: "plan-pro",
    slug: "pro",
    nameAr: "باقة المحترفين",
    nameEn: "Pro Elite",
    descriptionAr: "لأصحاب العلامات والشركات",
    badgeAr: "قيمة استثنائية",
    isActive: true,
    sortOrder: 2,
    prices: [
      { currency: "SAR", billingCycle: "MONTHLY", amount: 79, isActive: true },
      { currency: "SAR", billingCycle: "YEARLY", amount: 790, isActive: true },
      { currency: "USD", billingCycle: "MONTHLY", amount: 20, isActive: true },
      { currency: "USD", billingCycle: "YEARLY", amount: 200, isActive: true },
    ],
    quotas: {
      maxLinks: 9999,
      allowCustomDomain: true,
      allowRemoveBranding: true,
      allowAdvancedThemes: true,
      allowDetailedAnalytics: true,
      allowPrioritySupport: true,
      customCssAllowed: true,
      storeCommissionRate: 3.0,
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
    autoDetectCountries: ["SA", "KSA"],
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
  {
    code: "AED",
    nameAr: "درهم إماراتي",
    symbol: "د.إ",
    exchangeRateToUSD: 3.67,
    isBaseCurrency: false,
    isActive: true,
    autoDetectCountries: ["AE"],
    updatedAt: "2026-11-15T00:00:00Z",
  },
];

const MOCK_COUPONS: AdminCouponItem[] = [
  {
    id: "cp-ramadan",
    code: "RAMADAN50",
    descriptionAr: "عرض شهر رمضان المبارك 50%",
    discountType: "PERCENTAGE",
    discountValue: 50,
    maxUses: 100,
    usedCount: 24,
    maxUsesPerUser: 1,
    validFrom: "2026-03-01T00:00:00Z",
    validUntil: "2026-04-01T00:00:00Z",
    isActive: true,
    applicablePlanSlugs: ["creator", "pro"],
    createdAt: "2026-02-28T00:00:00Z",
  },
  {
    id: "cp-flat20",
    code: "WELCOME20",
    descriptionAr: "خصم 20 ريال للمنضمين الجدد",
    discountType: "FIXED_AMOUNT",
    discountValue: 20,
    maxUses: null,
    usedCount: 5,
    maxUsesPerUser: 1,
    validFrom: "2026-01-01T00:00:00Z",
    validUntil: null,
    isActive: false,
    applicablePlanSlugs: [],
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const MOCK_TRANSACTIONS: AdminTransactionsResult = {
  items: [
    {
      id: "tx-1",
      invoiceNumber: "INV-2026-0001",
      userId: "user-1",
      customerName: "سلطان القحطاني",
      customerEmail: "sultan@example.com",
      amountSubtotal: 39,
      discountAmount: 0,
      taxAmount: 0,
      amountTotal: 39,
      currency: "SAR",
      gatewayCode: "mada",
      gatewayTxId: "gw_tx_12345",
      status: "PAID",
      pdfUrl: "https://anlinks.dev/invoices/INV-2026-0001.pdf",
      createdAt: "2026-11-14T10:30:00Z",
    },
    {
      id: "tx-2",
      invoiceNumber: "INV-2026-0002",
      userId: "user-2",
      customerName: "Omar Bradley",
      customerEmail: "omar@example.com",
      amountSubtotal: 20,
      discountAmount: 0,
      taxAmount: 0,
      amountTotal: 20,
      currency: "USD",
      gatewayCode: "stripe",
      gatewayTxId: null,
      status: "FAILED",
      pdfUrl: null,
      createdAt: "2026-11-14T11:00:00Z",
    },
  ],
  total: 2,
  page: 1,
  limit: 10,
  totalPages: 1,
};

/* =========================================================================
 * Tests Suite
 * ========================================================================= */

describe("Admin Financial Sub-Tabs Suite", () => {
  describe("GatewaysSubTab", () => {
    it("should render National and International sections with badges and fees", () => {
      const onToggle = vi.fn().mockResolvedValue(true);
      const html = renderToStaticMarkup(
        React.createElement(GatewaysSubTab, {
          gateways: MOCK_GATEWAYS,
          onToggleGateway: onToggle,
        })
      );

      // Verify section titles
      expect(html).toContain("بوابات الدفع الوطنية (السعودية والخليج ومصر)");
      expect(html).toContain("بوابات الدفع العالمية والبطاقات");

      // Verify gateway names and categories
      expect(html).toContain("مدى للبطاقات المصرفية");
      expect(html).toContain("تمارا للتقسيط BNPL");
      expect(html).toContain("سترايب العالمية");

      // Verify badges and fees
      expect(html).toContain("مفعلة");
      expect(html).toContain("معطلة");
      expect(html).toContain("1.75% + 1 ر.س");
      expect(html).toContain("إعداد المفاتيح والربط");
    });
  });

  describe("PlansSubTab", () => {
    it("should render plan cards with pricing, badges, and quota limits", () => {
      const onSave = vi.fn().mockResolvedValue(true);
      const onDelete = vi.fn().mockResolvedValue(true);

      const html = renderToStaticMarkup(
        React.createElement(PlansSubTab, {
          plans: MOCK_PLANS,
          onSavePlan: onSave,
          onDeletePlan: onDelete,
        })
      );

      expect(html).toContain("باقات الاشتراك والتسعير");
      expect(html).toContain("إضافة باقة جديدة");
      expect(html).toContain("باقة صانع المحتوى");
      expect(html).toContain("باقة المحترفين");
      expect(html).toContain("الأكثر شعبية");
      expect(html).toContain("قيمة استثنائية");
      expect(html).toContain("39");
      expect(html).toContain("ر.س");
      expect(html).toContain("حتى 25 روابط نشطة");
      expect(html).toContain("روابط غير محدودة");
      expect(html).toContain("تعديل الباقة");
      expect(html).toContain("أرشفة/حذف");
    });
  });

  describe("PlanQuotasSubTab", () => {
    it("should render plan selectors, limits, and toggle switches", () => {
      const onSaveQuotas = vi.fn().mockResolvedValue(true);

      const html = renderToStaticMarkup(
        React.createElement(PlanQuotasSubTab, {
          plans: MOCK_PLANS,
          onSaveQuotas,
        })
      );

      expect(html).toContain("حدود ومحددات مميزات الباقات");
      expect(html).toContain("حفظ التخصيص والمحددات");
      expect(html).toContain("أقصى عدد للروابط النشطة");
      expect(html).toContain("نسبة عمولة المنصة على المبيعات (%)");
      expect(html).toContain("ربط نطاق خاص (Custom Domain)");
      expect(html).toContain("إزالة شعار المنصة (Remove Branding)");
      expect(html).toContain("قوالب وثيمات حصرية (Advanced Themes)");
      expect(html).toContain("تحليلات تفصيلية جغرافية (Detailed Analytics)");
    });
  });

  describe("CurrenciesSubTab", () => {
    it("should render currencies table with base currency badge and rate", () => {
      const onSaveCurrency = vi.fn().mockResolvedValue(true);

      const html = renderToStaticMarkup(
        React.createElement(CurrenciesSubTab, {
          currencies: MOCK_CURRENCIES,
          onSaveCurrency,
        })
      );

      expect(html).toContain("إدارة العملات وأسعار الصرف العالمية");
      expect(html).toContain("SAR");
      expect(html).toContain("ريال سعودي");
      expect(html).toContain("العملة المرجعية");
      expect(html).toContain("3.75 SAR");
      expect(html).toContain("USD");
      expect(html).toContain("AED");
      expect(html).toContain("تعديل سعر الصرف");
    });
  });

  describe("CouponsSubTab", () => {
    it("should render coupons table with discount value, usage, and status", () => {
      const onCreate = vi.fn().mockResolvedValue(true);
      const onToggle = vi.fn().mockResolvedValue(true);
      const onDelete = vi.fn().mockResolvedValue(true);

      const html = renderToStaticMarkup(
        React.createElement(CouponsSubTab, {
          coupons: MOCK_COUPONS,
          onCreateCoupon: onCreate,
          onToggleCoupon: onToggle,
          onDeleteCoupon: onDelete,
        })
      );

      expect(html).toContain("إدارة أكواد الخصم والعروض الترويجية");
      expect(html).toContain("إنشاء كود خصم جديد");
      expect(html).toContain("RAMADAN50");
      expect(html).toContain("50% خصم");
      expect(html).toContain("WELCOME20");
      expect(html).toContain("20 ر.س خصم");
      expect(html).toContain("24");
      expect(html).toContain("100");
    });
  });

  describe("InvoicesTransactionsSubTab", () => {
    it("should render transaction list, customer details, and invoice download button", () => {
      const onFilterChange = vi.fn();

      const html = renderToStaticMarkup(
        React.createElement(InvoicesTransactionsSubTab, {
          transactions: MOCK_TRANSACTIONS,
          onFilterChange,
        })
      );

      expect(html).toContain("INV-2026-0001");
      expect(html).toContain("سلطان القحطاني");
      expect(html).toContain("sultan@example.com");
      expect(html).toContain("39 SAR");
      expect(html).toContain("mada");
      expect(html).toContain("مدفوعة");
      expect(html).toContain("INV-2026-0002");
      expect(html).toContain("Omar Bradley");
      expect(html).toContain("فاشلة");
      expect(html).toContain("PDF");
    });
  });
});

/* =========================================================================
 * Modals Suite
 * ========================================================================= */

describe("Admin Financial Modals Suite", () => {
  describe("GatewayConfigModal", () => {
    it("should return null when isOpen is false", () => {
      const onSave = vi.fn().mockResolvedValue(true);
      const html = renderToStaticMarkup(
        React.createElement(GatewayConfigModal, {
          isOpen: false,
          gateway: MOCK_GATEWAYS[0],
          onClose: vi.fn(),
          onSave,
        })
      );
      expect(html).toBe("");
    });

    it("should render modal inputs and encryption indicators when isOpen is true", () => {
      const onSave = vi.fn().mockResolvedValue(true);
      const html = renderToStaticMarkup(
        React.createElement(GatewayConfigModal, {
          isOpen: true,
          gateway: MOCK_GATEWAYS[0],
          onClose: vi.fn(),
          onSave,
        })
      );

      expect(html).toContain("إعدادات بوابة مدى للبطاقات المصرفية");
      expect(html).toContain("المفتاح العام (Publishable / Public API Key)");
      expect(html).toContain("المفتاح السري (Secret Key)");
      expect(html).toContain("مضبوط ومشفّر");
      expect(html).toContain("نسبة العمولة (%)");
      expect(html).toContain("رسوم ثابتة (SAR)");
      expect(html).toContain("حفظ المفاتيح والإعدادات");
    });
  });

  describe("PlanEditorModal", () => {
    it("should return null when isOpen is false", () => {
      const html = renderToStaticMarkup(
        React.createElement(PlanEditorModal, {
          isOpen: false,
          onClose: vi.fn(),
          onSave: vi.fn().mockResolvedValue(true),
        })
      );
      expect(html).toBe("");
    });

    it("should render plan editor form with pricing matrix when isOpen is true", () => {
      const html = renderToStaticMarkup(
        React.createElement(PlanEditorModal, {
          isOpen: true,
          plan: MOCK_PLANS[0],
          onClose: vi.fn(),
          onSave: vi.fn().mockResolvedValue(true),
        })
      );

      expect(html).toContain("تعديل باقة باقة صانع المحتوى");
      expect(html).toContain("المعرف الفريد (Slug)");
      expect(html).toContain("الاسم بالعربية");
      expect(html).toContain("مصفوفة التسعير متعددة العملات");
      expect(html).toContain("SAR");
      expect(html).toContain("USD");
      expect(html).toContain("AED");
      expect(html).toContain("EGP");
      expect(html).toContain("حفظ تعديلات الباقة");
    });
  });

  describe("CouponEditorModal", () => {
    it("should return null when isOpen is false", () => {
      const html = renderToStaticMarkup(
        React.createElement(CouponEditorModal, {
          isOpen: false,
          onClose: vi.fn(),
          onSave: vi.fn().mockResolvedValue(true),
        })
      );
      expect(html).toBe("");
    });

    it("should render coupon creation form with discount types and validity fields", () => {
      const html = renderToStaticMarkup(
        React.createElement(CouponEditorModal, {
          isOpen: true,
          onClose: vi.fn(),
          onSave: vi.fn().mockResolvedValue(true),
        })
      );

      expect(html).toContain("إنشاء كود خصم جديد");
      expect(html).toContain("رمز الكود (Coupon Code)");
      expect(html).toContain("نوع الخصم");
      expect(html).toContain("نسبة مئوية (%)");
      expect(html).toContain("أقصى عدد استخدام كلي");
      expect(html).toContain("صالح من تاريخ");
      expect(html).toContain("إنشاء كود الخصم");
    });
  });

  describe("CurrencyRateModal", () => {
    it("should return null when isOpen is false", () => {
      const html = renderToStaticMarkup(
        React.createElement(CurrencyRateModal, {
          isOpen: false,
          currency: MOCK_CURRENCIES[0],
          onClose: vi.fn(),
          onSave: vi.fn().mockResolvedValue(true),
        })
      );
      expect(html).toBe("");
    });

    it("should render currency exchange rate form with auto-detection countries", () => {
      const html = renderToStaticMarkup(
        React.createElement(CurrencyRateModal, {
          isOpen: true,
          currency: MOCK_CURRENCIES[0],
          onClose: vi.fn(),
          onSave: vi.fn().mockResolvedValue(true),
        })
      );

      expect(html).toContain("تعديل سعر صرف ريال سعودي");
      expect(html).toContain("سعر الصرف مقابل 1 دولار أمريكي");
      expect(html).toContain("رموز الدول للكشف التلقائي");
      expect(html).toContain("حفظ سعر الصرف");
    });
  });
});
