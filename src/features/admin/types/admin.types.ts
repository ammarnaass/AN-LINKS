export type GatewayId =
  | "mada"
  | "apple_pay"
  | "visa_mastercard"
  | "stc_pay"
  | "tamara"
  | "tabby"
  | "fawry"
  | "stripe"
  | "paypal";

export interface AdminGatewayConfig {
  id: GatewayId;
  name: string;
  nameAr: string;
  descriptionAr: string;
  icon: string;
  isEnabled: boolean;
  isTestMode: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface AdminPlatformPricing {
  proMonthlyPrice: number;
  proYearlyPrice: number;
  storeCommissionRate: number;
}

export interface AdminPlatformSettings {
  siteName: string;
  supportEmail: string;
  canonicalDomain: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowRegistration: boolean;
  rateLimitMaxAttempts: number;
  linkSentinelActive: boolean;
  pricing: AdminPlatformPricing;
  gateways: Record<GatewayId, AdminGatewayConfig>;
}

export interface AdminTransaction {
  id: string;
  transactionNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  gateway: GatewayId;
  plan: "PRO_MONTHLY" | "PRO_YEARLY" | "STORE_COMMISSION";
  status: "COMPLETED" | "PENDING" | "REFUNDED";
  createdAt: string;
}

export interface AdminCreatorLeaderboardItem {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  linksCount: number;
  viewsCount: number;
  revenue: number;
}

export interface AdminAnalyticsData {
  mrr: number;
  mrrGrowthRate: number;
  totalUsers: number;
  activeUsers: number;
  proSubscribersCount: number;
  totalPlatformClicks: number;
  totalPlatformViews: number;
  chartData: Array<{
    date: string;
    revenue: number;
    users: number;
    clicks: number;
  }>;
  topCreators: AdminCreatorLeaderboardItem[];
  recentTransactions: AdminTransaction[];
}

export interface RoleUpdateInput {
  role: "ADMIN" | "USER";
}

export interface AdminUserItem {
  id: string;
  email: string;
  username: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  displayName: string;
  linksCount: number;
  reportsCount: number;
}

export interface AdminUsersQuery {
  search?: string;
  status?: "all" | "active" | "suspended" | "admin" | "pro";
}

export interface SuspendUserInput {
  isSuspended: boolean;
}

export interface ReportUpdateInput {
  status: "RESOLVED" | "DISMISSED";
}

export interface AdminReportItem {
  id: string;
  username: string;
  reason: string;
  details: string | null;
  reporterIp: string | null;
  status: string;
  createdAt: string;
}

/* =========================================================================
 * Financial Gateway, Subscription & Billing Contracts
 * ========================================================================= */

export interface AdminGatewayDetails {
  id: string;
  code: GatewayId | string;
  nameAr: string;
  nameEn: string;
  category: "NATIONAL" | "INTERNATIONAL" | "BNPL" | "WALLET";
  isEnabled: boolean;
  isTestMode: boolean;
  publishableKey: string | null;
  hasSecretKey: boolean; // secret is masked for security
  hasWebhookSecret: boolean;
  feePercentage: number;
  feeFixed: number;
  supportedCurrencies: string[];
  sortOrder: number;
  updatedAt: string;
}

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

export interface AdminAuditLogItem {
  id: string;
  adminId: string;
  adminEmail?: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
}

/* =========================================================================
 * Mutation DTOs
 * ========================================================================= */

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

export interface UpsertQuotaInput extends Partial<AdminPlanQuotaConfig> {
  planId?: string;
}

export interface UpdateCurrencyInput {
  code: string;
  nameAr?: string;
  symbol?: string;
  exchangeRateToUSD?: number;
  isActive?: boolean;
  autoDetectCountries?: string[];
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
  page?: number;
  limit?: number;
  status?: string;
  gateway?: string;
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
  items: AdminTransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
