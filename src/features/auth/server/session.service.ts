import { prisma } from "@/shared/db";
import { UserSessionDTO, AdminSessionDTO } from "../types/session.types";

function parseUserAgent(ua?: string | null): { browser: string; os: string; deviceType: "desktop" | "mobile" | "tablet" } {
  if (!ua) return { browser: "متصفح غير معروف", os: "نظام غير معروف", deviceType: "desktop" };
  const lower = ua.toLowerCase();

  let os = "Linux";
  if (lower.includes("win")) os = "Windows";
  else if (lower.includes("mac") && !lower.includes("iphone") && !lower.includes("ipad")) os = "macOS";
  else if (lower.includes("iphone")) os = "iOS (iPhone)";
  else if (lower.includes("ipad")) os = "iPadOS";
  else if (lower.includes("android")) os = "Android";

  let browser = "Chrome";
  if (lower.includes("edg/")) browser = "Microsoft Edge";
  else if (lower.includes("firefox")) browser = "Firefox";
  else if (lower.includes("safari") && !lower.includes("chrome")) browser = "Safari";
  else if (lower.includes("opr") || lower.includes("opera")) browser = "Opera";

  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (lower.includes("iphone") || (lower.includes("android") && lower.includes("mobile"))) {
    deviceType = "mobile";
  } else if (lower.includes("ipad") || lower.includes("tablet")) {
    deviceType = "tablet";
  }

  return { browser, os, deviceType };
}

export async function recordSession(
  userId: string,
  sessionToken: string,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  const { browser, os, deviceType } = parseUserAgent(userAgent);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.userSession.upsert({
    where: { sessionToken },
    update: {
      lastActive: new Date(),
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
      browser,
      os,
      deviceType,
    },
    create: {
      userId,
      sessionToken,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      deviceType,
      browser,
      os,
      expiresAt,
      isActive: true,
    },
  });
}

export async function getUserActiveSessions(userId: string, currentToken?: string): Promise<UserSessionDTO[]> {
  const sessions = await prisma.userSession.findMany({
    where: { userId, isActive: true },
    orderBy: { lastActive: "desc" },
  });

  return sessions.map((s) => ({
    id: s.id,
    sessionToken: s.sessionToken,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    deviceType: s.deviceType as "desktop" | "mobile" | "tablet",
    browser: s.browser || "متصفح ويب",
    os: s.os || "نظام تشغيل",
    isCurrent: Boolean(currentToken && s.sessionToken === currentToken),
    lastActive: s.lastActive.toISOString(),
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
  }));
}

export async function revokeUserSession(sessionId: string, userId: string): Promise<boolean> {
  const session = await prisma.userSession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return false;

  await prisma.userSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
  return true;
}

export async function getAllPlatformSessions(): Promise<AdminSessionDTO[]> {
  const sessions = await prisma.userSession.findMany({
    where: { isActive: true },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          username: true,
        },
      },
    },
    orderBy: { lastActive: "desc" },
    take: 100,
  });

  return sessions.map((s) => ({
    id: s.id,
    userId: s.userId,
    userEmail: s.user.email,
    userRole: s.user.role as "ADMIN" | "USER",
    username: s.user.username,
    sessionToken: s.sessionToken,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    deviceType: s.deviceType as "desktop" | "mobile" | "tablet",
    browser: s.browser || "متصفح",
    os: s.os || "نظام",
    isCurrent: false,
    lastActive: s.lastActive.toISOString(),
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
  }));
}

export async function adminRevokeSession(sessionId: string): Promise<boolean> {
  const session = await prisma.userSession.findUnique({ where: { id: sessionId } });
  if (!session) return false;

  await prisma.userSession.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
  return true;
}
