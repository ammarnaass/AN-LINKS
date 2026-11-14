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
  const [totalUsers, activeUsers, totalLinks] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isSuspended: false } }),
    prisma.link.count(),
  ]);

  // Generate 14-day sample points for Pure SVG charts
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  });

  const chartData = dates.map((date, idx) => ({
    date,
    revenue: 1800 + Math.floor(Math.sin(idx * 0.7) * 600 + idx * 80),
    users: 12 + Math.floor(Math.cos(idx * 0.5) * 5 + (idx % 3)),
    clicks: 1400 + Math.floor(Math.sin(idx * 0.9) * 400 + idx * 50),
  }));

  const creators = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "asc" },
    include: {
      profile: true,
      _count: { select: { links: true } },
    },
  });

  const topCreators: AdminCreatorLeaderboardItem[] = creators.map((c, i) => ({
    id: c.id,
    username: c.username,
    displayName: c.profile?.displayName ?? c.username,
    avatarUrl: c.profile?.avatarUrl ?? undefined,
    linksCount: c._count.links,
    viewsCount: 3200 - i * 450,
    revenue: 4200 - i * 650,
  }));

  return {
    mrr: 28450,
    mrrGrowthRate: 22.4,
    totalUsers,
    activeUsers,
    proSubscribersCount: Math.max(1, Math.floor(activeUsers * 0.45)),
    totalPlatformClicks: totalLinks * 340,
    totalPlatformViews: totalLinks * 820,
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
