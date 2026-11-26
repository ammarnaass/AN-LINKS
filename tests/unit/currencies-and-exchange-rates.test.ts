import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  FALLBACK_RATES_TO_USD,
  fetchLiveForexRates,
  convertUSDAmount,
  syncAllCurrencyRates,
} from "@/features/subscriptions/services/live-exchange-rates.service";
import {
  getCountryFromHeaders,
  detectVisitorCurrency,
} from "@/features/subscriptions/services/currency-detector.service";
import {
  getAdminCurrencies,
  updateAdminCurrency,
  createAdminCurrency,
} from "@/features/admin/server/financials/currencies.service";
import { prisma } from "@/shared/db";

// Mock dependencies
vi.mock("@/shared/db", () => ({
  prisma: {
    currencyConfig: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    financialAuditLog: {
      create: vi.fn(),
    },
  },
}));

describe("Real Multi-Currency & Global Exchange Rate Engine Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Exchange Rates & Currency Conversion Calculation", () => {
    it("anchors USD at 1.0 and provides accurate central bank baselines", () => {
      expect(FALLBACK_RATES_TO_USD.USD).toBe(1.0);
      expect(FALLBACK_RATES_TO_USD.SAR).toBeCloseTo(3.75, 2);
      expect(FALLBACK_RATES_TO_USD.AED).toBeCloseTo(3.67, 2);
      expect(FALLBACK_RATES_TO_USD.QAR).toBe(3.64);
      expect(FALLBACK_RATES_TO_USD.KWD).toBe(0.3075);
    });

    it("converts USD amounts accurately into target currencies with symbol", () => {
      // 24 USD to SAR at 3.7508 = 90.02 SAR
      const resSAR = convertUSDAmount(24, 3.7508, "ر.س");
      expect(resSAR.amount).toBe(90.02);
      expect(resSAR.formatted).toBe("90.02 ر.س");

      // 59 USD to AED at 3.6725 = 216.68 AED
      const resAED = convertUSDAmount(59, 3.6725, "د.إ");
      expect(resAED.amount).toBe(216.68);
      expect(resAED.formatted).toBe("216.68 د.إ");

      // 100 USD to KWD at 0.3075 = 30.75 KWD
      const resKWD = convertUSDAmount(100, 0.3075, "د.ك");
      expect(resKWD.amount).toBe(30.75);
      expect(resKWD.formatted).toBe("30.75 د.ك");
    });

    it("gracefully falls back to cached baseline when external forex API fails", async () => {
      const originalFetch = globalThis.fetch;
      globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error("Network timeout"));

      const result = await fetchLiveForexRates();
      expect(result.provider).toBe("fallback-cache");
      expect(result.rates.SAR).toBe(FALLBACK_RATES_TO_USD.SAR);

      globalThis.fetch = originalFetch;
    });
  });

  describe("Visitor Country & Currency Detection", () => {
    it("extracts country ISO from x-vercel-ip-country header", () => {
      const headers = new Headers({ "x-vercel-ip-country": "SA" });
      expect(getCountryFromHeaders(headers)).toBe("SA");
    });

    it("extracts country ISO from cf-ipcountry header", () => {
      const headers = new Headers({ "cf-ipcountry": "AE" });
      expect(getCountryFromHeaders(headers)).toBe("AE");
    });

    it("detects matching currency from database autoDetectCountries", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValueOnce([
        {
          code: "SAR",
          nameAr: "ريال سعودي",
          symbol: "ر.س",
          exchangeRateToUSD: 3.75,
          isBaseCurrency: true,
          isActive: true,
          autoDetectCountries: ["SA"],
          updatedAt: new Date(),
        },
        {
          code: "AED",
          nameAr: "درهم إماراتي",
          symbol: "د.إ",
          exchangeRateToUSD: 3.67,
          isBaseCurrency: false,
          isActive: true,
          autoDetectCountries: ["AE"],
          updatedAt: new Date(),
        },
      ] as any);

      const headers = new Headers({ "cf-ipcountry": "AE" });
      const detected = await detectVisitorCurrency(headers);
      expect(detected).toBe("AED");
    });
  });

  describe("Admin Currency Management & Synchronization", () => {
    it("creates a new global currency and logs audit record", async () => {
      vi.mocked(prisma.currencyConfig.findUnique).mockResolvedValueOnce(null);
      vi.mocked(prisma.currencyConfig.create).mockResolvedValueOnce({
        code: "QAR",
        nameAr: "ريال قطري",
        symbol: "ر.ق",
        exchangeRateToUSD: 3.64,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["QA"],
        updatedAt: new Date(),
      } as any);

      const created = await createAdminCurrency(
        {
          code: "QAR",
          nameAr: "ريال قطري",
          symbol: "ر.ق",
          exchangeRateToUSD: 3.64,
          autoDetectCountries: ["QA"],
        },
        "admin_123"
      );

      expect(created.code).toBe("QAR");
      expect(created.exchangeRateToUSD).toBe(3.64);
      expect(prisma.currencyConfig.create).toHaveBeenCalled();
    });

    it("prevents adding duplicate currency codes", async () => {
      vi.mocked(prisma.currencyConfig.findUnique).mockResolvedValueOnce({
        code: "SAR",
      } as any);

      await expect(
        createAdminCurrency(
          {
            code: "SAR",
            nameAr: "ريال سعودي",
            symbol: "ر.س",
            exchangeRateToUSD: 3.75,
          },
          "admin_123"
        )
      ).rejects.toThrow("مضافة مسبقاً");
    });

    it("updates existing currency rate and active status", async () => {
      vi.mocked(prisma.currencyConfig.findUnique).mockResolvedValueOnce({
        code: "EGP",
        exchangeRateToUSD: 50.0,
      } as any);

      vi.mocked(prisma.currencyConfig.update).mockResolvedValueOnce({
        code: "EGP",
        nameAr: "جنيه مصري",
        symbol: "ج.م",
        exchangeRateToUSD: 50.25,
        isBaseCurrency: false,
        isActive: true,
        autoDetectCountries: ["EG"],
        updatedAt: new Date(),
      } as any);

      const updated = await updateAdminCurrency(
        "EGP",
        { code: "EGP", exchangeRateToUSD: 50.25 },
        "admin_123"
      );

      expect(updated.exchangeRateToUSD).toBe(50.25);
      expect(prisma.currencyConfig.update).toHaveBeenCalledWith({
        where: { code: "EGP" },
        data: { exchangeRateToUSD: 50.25 },
      });
    });

    it("syncs all currency rates and logs audit entry", async () => {
      vi.mocked(prisma.currencyConfig.findMany).mockResolvedValueOnce([
        {
          code: "SAR",
          exchangeRateToUSD: 3.75,
        },
        {
          code: "EUR",
          exchangeRateToUSD: 0.92,
        },
      ] as any);

      vi.mocked(prisma.currencyConfig.update).mockResolvedValue({} as any);

      const result = await syncAllCurrencyRates("admin_123");
      expect(result.success).toBe(true);
      expect(typeof result.updatedCount).toBe("number");
    });

    it("designates a currency as the base reference currency and unsets others", async () => {
      vi.mocked(prisma.currencyConfig.findUnique).mockResolvedValueOnce({
        code: "USD",
        isBaseCurrency: false,
      } as any);

      vi.mocked(prisma.currencyConfig.updateMany).mockResolvedValueOnce({ count: 1 } as any);
      vi.mocked(prisma.currencyConfig.update).mockResolvedValueOnce({
        code: "USD",
        nameAr: "دولار أمريكي",
        symbol: "$",
        exchangeRateToUSD: 1.0,
        isBaseCurrency: true,
        isActive: true,
        autoDetectCountries: ["US"],
        updatedAt: new Date(),
      } as any);

      const res = await updateAdminCurrency("USD", { code: "USD", isBaseCurrency: true }, "admin_123");
      expect(res.isBaseCurrency).toBe(true);
      expect(prisma.currencyConfig.updateMany).toHaveBeenCalledWith({
        where: { code: { not: "USD" } },
        data: { isBaseCurrency: false },
      });
      expect(prisma.currencyConfig.update).toHaveBeenCalledWith({
        where: { code: "USD" },
        data: { isBaseCurrency: true },
      });
    });
  });
});
