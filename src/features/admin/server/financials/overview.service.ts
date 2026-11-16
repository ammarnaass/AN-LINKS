import { prisma } from "@/shared/db";
import type { FinancialOverviewStats } from "../../types/admin.types";

/**
 * Computes high-level counts and total paid revenue for the admin financial dashboard.
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
