import { prisma } from "@/shared/db";
import {
  AdminUsersQuery,
  AdminUserItem,
  AdminReportItem,
  AdminPlatformSettings,
  AdminAnalyticsData,
  AdminCreatorLeaderboardItem,
} from "../types/admin.types";
import {
  getStatefulSettings,
  updateStatefulSettings,
  statefulTransactions,
} from "./admin.defaults";

export async function getAdminUsersList(query: AdminUsersQuery = {}): Promise<AdminUserItem[]> {
  const { search, status } = query;
  const where: Record<string, unknown> = {};

  if (status === "active") where.isSuspended = false;
  if (status === "suspended") where.isSuspended = true;
  if (status === "admin") where.role = "ADMIN";

  if (search?.trim()) {
    const s = search.trim();
    where.OR = [
      { username: { contains: s, mode: "insensitive" } },
      { email: { contains: s, mode: "insensitive" } },
      { profile: { displayName: { contains: s, mode: "insensitive" } } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      _count: { select: { links: true } },
    },
  });

  const reports = await prisma.report.groupBy({
    by: ["username"],
    _count: { _all: true },
  });
  const reportCountMap = new Map(reports.map((r) => [r.username, r._count._all]));

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    role: u.role,
    isSuspended: u.isSuspended,
    createdAt: u.createdAt.toISOString(),
    displayName: u.profile?.displayName ?? u.username,
    linksCount: u._count.links,
    reportsCount: reportCountMap.get(u.username) ?? 0,
  }));
}

export async function toggleUserSuspension(
  targetUserId: string,
  isSuspended: boolean,
  currentAdminId: string
) {
  if (targetUserId === currentAdminId) {
    return { ok: false, status: 400, error: "لا يمكن للمشغّل إيقاف حسابه الشخصي" };
  }

  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) {
    return { ok: false, status: 404, error: "المستخدم غير موجود" };
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { isSuspended },
  });

  return { ok: true, status: 200, user: updated };
}

export async function toggleUserRole(
  targetUserId: string,
  newRole: "ADMIN" | "USER",
  currentAdminId: string
) {
  if (targetUserId === currentAdminId) {
    return { ok: false, status: 400, error: "لا يمكن للمشغّل تغيير رتبة حسابه الشخصي" };
  }

  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user) {
    return { ok: false, status: 404, error: "المستخدم غير موجود" };
  }

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
  });

  return { ok: true, status: 200, user: updated };
}

export function getPlatformSettings(): AdminPlatformSettings {
  return getStatefulSettings();
}

export function updatePlatformSettings(
  partial: Partial<AdminPlatformSettings>
): { ok: boolean; settings: AdminPlatformSettings } {
  const updated = updateStatefulSettings(partial);
  return { ok: true, settings: updated };
}

export async function getPlatformAnalyticsData(): Promise<AdminAnalyticsData> {
  const [totalUsers, activeUsers, totalLinks, clickAgg, viewAgg] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isSuspended: false } }),
    prisma.link.count(),
    prisma.dailyLinkStat.aggregate({ _sum: { clicks: true } }),
    prisma.dailyProfileStat.aggregate({ _sum: { views: true } }),
  ]);

  const totalPlatformClicks = clickAgg._sum.clicks || 0;
  const totalPlatformViews = viewAgg._sum.views || 0;

  // Generate 14-day date buckets with real Prisma activity
  const rangeDays = 14;
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - rangeDays);

  const [recentViews, recentClicks] = await Promise.all([
    prisma.dailyProfileStat.findMany({
      where: { date: { gte: sinceDate } },
    }),
    prisma.dailyLinkStat.findMany({
      where: { date: { gte: sinceDate } },
    }),
  ]);

  const dates = Array.from({ length: rangeDays }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (rangeDays - 1 - i));
    return {
      iso: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" }),
    };
  });

  const chartData = dates.map((d) => {
    const viewsForDay = recentViews
      .filter((v) => v.date.toISOString().startsWith(d.iso))
      .reduce((sum, curr) => sum + curr.views, 0);
    const clicksForDay = recentClicks
      .filter((c) => c.date.toISOString().startsWith(d.iso))
      .reduce((sum, curr) => sum + curr.clicks, 0);

    return {
      date: d.label,
      revenue: 0,
      users: 0,
      clicks: clicksForDay,
    };
  });

  const creators = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
      _count: { select: { links: true } },
    },
  });

  const topCreators: AdminCreatorLeaderboardItem[] = creators.map((c) => ({
    id: c.id,
    username: c.username,
    displayName: c.profile?.displayName ?? c.username,
    avatarUrl: c.profile?.avatarUrl ?? undefined,
    linksCount: c._count.links,
    viewsCount: 0,
    revenue: 0,
  }));

  const mrr = statefulTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  return {
    mrr,
    mrrGrowthRate: 0,
    totalUsers,
    activeUsers,
    proSubscribersCount: 0,
    totalPlatformClicks,
    totalPlatformViews,
    totalLinks,
    chartData,
    topCreators,
    recentTransactions: statefulTransactions,
  };
}

export async function getAdminReports(statusFilter?: string): Promise<AdminReportItem[]> {
  const where = statusFilter ? { status: statusFilter } : {};
  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return reports.map((r) => ({
    id: r.id,
    username: r.username,
    reason: r.reason,
    details: r.details,
    reporterIp: r.reporterIp,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function updateReportStatus(reportId: string, status: "RESOLVED" | "DISMISSED") {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) {
    return { ok: false, status: 404, error: "البلاغ غير موجود" };
  }

  const updated = await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  return { ok: true, status: 200, report: updated };
}
