import { prisma } from "@/shared/db";
import { Prisma } from "@prisma/client";
import type { AdminCurrencyItem, UpdateCurrencyInput } from "../../types/admin.types";
import { logFinancialAudit } from "./audit.service";

function formatCurrency(c: {
  code: string;
  nameAr: string;
  symbol: string;
  exchangeRateToUSD: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  autoDetectCountries: string[];
  updatedAt: Date;
}): AdminCurrencyItem {
  return {
    code: c.code,
    nameAr: c.nameAr,
    symbol: c.symbol,
    exchangeRateToUSD: c.exchangeRateToUSD,
    isBaseCurrency: c.isBaseCurrency,
    isActive: c.isActive,
    autoDetectCountries: c.autoDetectCountries,
    updatedAt: c.updatedAt.toISOString(),
  };
}

export async function getAdminCurrencies(): Promise<AdminCurrencyItem[]> {
  const currencies = await prisma.currencyConfig.findMany({
    orderBy: [{ isBaseCurrency: "desc" }, { code: "asc" }],
  });
  return currencies.map(formatCurrency);
}

export async function updateAdminCurrency(
  code: string,
  input: UpdateCurrencyInput,
  adminId: string
): Promise<AdminCurrencyItem> {
  const existing = await prisma.currencyConfig.findUnique({ where: { code } });
  if (!existing) {
    throw new Error(`العملة غير موجودة: ${code}`);
  }

  const updateData: Prisma.CurrencyConfigUpdateInput = {};
  if (input.nameAr !== undefined) updateData.nameAr = input.nameAr;
  if (input.symbol !== undefined) updateData.symbol = input.symbol;
  if (input.exchangeRateToUSD !== undefined) updateData.exchangeRateToUSD = input.exchangeRateToUSD;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;
  if (input.autoDetectCountries !== undefined) updateData.autoDetectCountries = input.autoDetectCountries;

  const updated = await prisma.currencyConfig.update({ where: { code }, data: updateData });
  await logFinancialAudit(adminId, "UPDATE_CURRENCY", "CurrencyConfig", code, input);
  return formatCurrency(updated);
}
