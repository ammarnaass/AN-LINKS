import { prisma } from "@/shared/db";
import { logFinancialAudit } from "@/features/admin/server/financials/audit.service";

// High-precision Central Bank and market baselines relative to USD ($1 USD = X Currency)
export const FALLBACK_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  SAR: 3.7508, // Pegged Saudi Riyal
  AED: 3.6725, // Pegged UAE Dirham
  QAR: 3.64,   // Pegged Qatari Riyal
  KWD: 0.3075, // Kuwaiti Dinar
  BHD: 0.376,  // Pegged Bahraini Dinar
  OMR: 0.3845, // Pegged Omani Rial
  JOD: 0.709,  // Pegged Jordanian Dinar
  EGP: 50.25,  // Egyptian Pound
  EUR: 0.955,  // Euro
  GBP: 0.792,  // British Pound
  TRY: 35.8,   // Turkish Lira
  CAD: 1.415,  // Canadian Dollar
  AUD: 1.545,  // Australian Dollar
};

export interface LiveForexFetchResult {
  rates: Record<string, number>;
  provider: "open-er-api" | "fallback-cache";
  lastUpdatedUtc: string;
}

export async function fetchLiveForexRates(): Promise<LiveForexFetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache 1 hour
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.result === "success" && data.rates) {
        return {
          rates: { ...FALLBACK_RATES_TO_USD, ...data.rates },
          provider: "open-er-api",
          lastUpdatedUtc: data.time_last_update_utc || new Date().toISOString(),
        };
      }
    }
  } catch {
    // Network or timeout failure - graceful fallback
  } finally {
    clearTimeout(timeoutId);
  }

  return {
    rates: FALLBACK_RATES_TO_USD,
    provider: "fallback-cache",
    lastUpdatedUtc: new Date().toISOString(),
  };
}

export async function syncAllCurrencyRates(adminId: string) {
  const { rates, provider, lastUpdatedUtc } = await fetchLiveForexRates();
  const existingCurrencies = await prisma.currencyConfig.findMany();

  let updatedCount = 0;
  const updatedList: { code: string; oldRate: number; newRate: number }[] = [];

  for (const curr of existingCurrencies) {
    const freshRate = rates[curr.code.toUpperCase()];
    if (freshRate && typeof freshRate === "number" && freshRate > 0) {
      if (Math.abs(curr.exchangeRateToUSD - freshRate) > 0.0001) {
        await prisma.currencyConfig.update({
          where: { code: curr.code },
          data: { exchangeRateToUSD: freshRate },
        });
        updatedList.push({
          code: curr.code,
          oldRate: curr.exchangeRateToUSD,
          newRate: freshRate,
        });
        updatedCount++;
      }
    }
  }

  await logFinancialAudit(
    adminId,
    "SYNC_EXCHANGE_RATES",
    "CurrencyConfig",
    "ALL",
    { updatedCount, provider, lastUpdatedUtc, updatedList }
  );

  return {
    success: true,
    provider,
    lastUpdatedUtc,
    updatedCount,
    updatedList,
  };
}

export function convertUSDAmount(
  amountUSD: number,
  exchangeRateToUSD: number,
  symbol = ""
): { amount: number; formatted: string } {
  if (!exchangeRateToUSD || exchangeRateToUSD <= 0) {
    return {
      amount: amountUSD,
      formatted: `${amountUSD} ${symbol}`.trim(),
    };
  }

  // Multiply USD amount by rate ($24 * 3.75 = 90 SAR)
  const converted = Math.round(amountUSD * exchangeRateToUSD * 100) / 100;
  const isWhole = Number.isInteger(converted);
  const displayAmount = isWhole ? converted.toString() : converted.toFixed(2);

  return {
    amount: converted,
    formatted: symbol ? `${displayAmount} ${symbol}` : displayAmount,
  };
}
