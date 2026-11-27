export type AdminTabKey =
  | "analytics"
  | "users"
  | "sessions"
  | "subscriptions"
  | "payments"
  | "gateways"
  | "plans"
  | "quotas"
  | "currencies"
  | "coupons"
  | "transactions"
  | "bookings"
  | "links"
  | "settings"
  | "auth_providers"
  | "notifications"
  | "newsletter"
  | "reports";

export type GatewayId =
  | "mada" | "apple_pay" | "visa_mastercard" | "stc_pay" | "tamara" | "tabby" | "fawry" | "stripe" | "paypal";

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

export interface RoleUpdateInput { role: "ADMIN" | "USER"; }
export interface SuspendUserInput { isSuspended: boolean; }
export interface UserLocationUpdateInput { location: string | null; }
export interface ReportUpdateInput { status: "RESOLVED" | "DISMISSED"; }
export interface AdminUsersQuery { search?: string; status?: "all" | "active" | "suspended" | "admin" | "pro"; }

export interface AdminUserItem {
  id: string;
  email: string;
  username: string;
  role: string;
  isSuspended: boolean;
  createdAt: string;
  displayName: string;
  location: string | null;
  linksCount: number;
  reportsCount: number;
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
