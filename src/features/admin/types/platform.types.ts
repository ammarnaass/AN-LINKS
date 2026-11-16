import type { GatewayId } from "./system.types";

export interface PlatformUpsertInput {
  slug: string;
  nameAr: string;
  nameEn: string;
  category: string;
  defaultIcon: string;
  brandColor: string;
  domainPattern: string;
  urlPlaceholder: string;
  isEnabled?: boolean;
  sortOrder?: number;
}

export interface AdminLinksQuery {
  search?: string;
  platformId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AdminLinkItem {
  id: string;
  title: string;
  url: string;
  clicksCount: number;
  isActive: boolean;
  isPinned: boolean;
  isArchived: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  };
  platform: {
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    brandColor: string;
  } | null;
  createdAt: string;
}

export interface AdminLinksResponse {
  items: AdminLinkItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminPlatformAnalyticsResponse {
  totalLinks: number;
  totalClicks: number;
  activePlatformsCount: number;
  platformBreakdown: Array<{
    slug: string;
    nameAr: string;
    nameEn: string;
    brandColor: string;
    clicks: number;
    linksCount: number;
  }>;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  countryBreakdown: Array<{ country: string; count: number; percentage: number }>;
  topLinks: Array<{ id: string; title: string; url: string; clicksCount: number; username: string }>;
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
  totalLinks?: number;
  chartData: Array<{ date: string; revenue: number; users: number; clicks: number }>;
  topCreators: AdminCreatorLeaderboardItem[];
  recentTransactions: AdminTransaction[];
}
