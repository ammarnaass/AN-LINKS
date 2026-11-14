export type GatewayId = "mada" | "apple_pay" | "visa_mastercard" | "stc_pay" | "tamara";

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
