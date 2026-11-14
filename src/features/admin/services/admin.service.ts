import { prisma } from "@/shared/db";
import { AdminUsersQuery, AdminUserItem, AdminReportItem } from "../types/admin.types";

export async function getAdminUsersList(query: AdminUsersQuery = {}): Promise<AdminUserItem[]> {
  const { search, status } = query;
  const where: Record<string, unknown> = {};

  if (status === "active") where.isSuspended = false;
  if (status === "suspended") where.isSuspended = true;

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

