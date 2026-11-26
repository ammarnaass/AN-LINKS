import type { GatewayId } from "./system.types";

export interface AdminPlanPriceItem {
  id?: string;
  currency: string;
  billingCycle: "MONTHLY" | "YEARLY" | "LIFETIME";
  amount: number;
  originalAmount?: number | null;
  isActive: boolean;
}

export interface AdminPlanQuotaConfig {
  maxLinks: number;
  allowCustomDomain: boolean;
  allowRemoveBranding: boolean;
  allowAdvancedThemes: boolean;
  allowDetailedAnalytics: boolean;
  allowPrioritySupport: boolean;
  customCssAllowed: boolean;
  storeCommissionRate: number;
}

export interface AdminSubscriptionPlanItem {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string | null;
  badgeAr?: string | null;
  isActive: boolean;
  sortOrder: number;
  prices: AdminPlanPriceItem[];
  quotas: AdminPlanQuotaConfig;
  subscribersCount?: number;
}

export interface AdminGatewayDetails {
  id: string;
  code: GatewayId | string;
  nameAr: string;
  nameEn: string;
  category: "NATIONAL" | "INTERNATIONAL" | "BNPL" | "WALLET";
  isEnabled: boolean;
  isTestMode: boolean;
  publishableKey: string | null;
  hasSecretKey: boolean;
  hasWebhookSecret: boolean;
  feePercentage: number;
  feeFixed: number;
  supportedCurrencies: string[];
  sortOrder: number;
  updatedAt: string;
}

export interface AdminCurrencyItem {
  code: string;
  nameAr: string;
  symbol: string;
  exchangeRateToUSD: number;
  isBaseCurrency: boolean;
  isActive: boolean;
  autoDetectCountries: string[];
  updatedAt: string;
}

export interface AdminCouponItem {
  id: string;
  code: string;
  descriptionAr?: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxUses?: number | null;
  usedCount: number;
  maxUsesPerUser: number;
  validFrom: string;
  validUntil?: string | null;
  isActive: boolean;
  applicablePlanSlugs: string[];
  createdAt: string;
}

export interface UpdateGatewayInput {
  id: string;
  isEnabled?: boolean;
  isTestMode?: boolean;
  publishableKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  feePercentage?: number;
  feeFixed?: number;
  supportedCurrencies?: string[];
}

export interface UpsertPlanInput {
  id?: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  badgeAr?: string;
  isActive?: boolean;
  sortOrder?: number;
  prices?: AdminPlanPriceItem[];
  quotas?: Partial<AdminPlanQuotaConfig>;
}

export interface UpsertQuotaInput extends Partial<AdminPlanQuotaConfig> { planId?: string; }

export interface UpdateCurrencyInput {
  code: string;
  nameAr?: string;
  symbol?: string;
  exchangeRateToUSD?: number;
  isActive?: boolean;
  autoDetectCountries?: string[];
  isBaseCurrency?: boolean;
}

export interface CreateCurrencyInput {
  code: string;
  nameAr: string;
  symbol: string;
  exchangeRateToUSD: number;
  isActive?: boolean;
  isBaseCurrency?: boolean;
  autoDetectCountries?: string[];
}

export interface SyncRatesResult {
  success: boolean;
  provider: string;
  lastUpdatedUtc: string;
  updatedCount: number;
  updatedList: { code: string; oldRate: number; newRate: number }[];
}

export interface CreateCouponInput {
  code: string;
  descriptionAr?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: string;
  validUntil?: string;
  applicablePlanSlugs?: string[];
}

export interface FinancialOverviewStats {
  totalGateways: number;
  activeGateways: number;
  totalPlans: number;
  totalCurrencies: number;
  totalCoupons: number;
  totalInvoices: number;
  totalRevenue: number;
}

export interface AdminTransactionsQuery {
  page?: number; limit?: number; status?: string; gateway?: string;
}

export interface AdminTransactionItem {
  id: string;
  invoiceNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  amountSubtotal: number;
  discountAmount: number;
  taxAmount: number;
  amountTotal: number;
  currency: string;
  gatewayCode: string;
  gatewayTxId: string | null;
  status: string;
  pdfUrl: string | null;
  createdAt: string;
}

export interface AdminTransactionsResult {
  items: AdminTransactionItem[]; total: number; page: number; limit: number; totalPages: number;
}

export interface InvoiceRefundResult {
  success: boolean; invoiceId: string; status: string; refundedAmount?: number; message?: string;
}

export interface PlanPricingTier {
  id: string; name: string; price: number; currency: string;
  billingCycle: "MONTHLY" | "YEARLY" | "LIFETIME"; features?: string[];
}
