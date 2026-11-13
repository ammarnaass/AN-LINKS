import { prisma } from "@/shared/db";
import { isBotOrPrefetch } from "@/shared/utils";

export function getNormalizedDate(date: Date = new Date()): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

export function shouldCountClick(userAgent: string | null, headers: Headers): boolean {
  return !isBotOrPrefetch(userAgent, headers);
}

export async function recordLinkClick(linkId: string, userAgent: string | null, headers: Headers) {
  if (!shouldCountClick(userAgent, headers)) {
    return;
  }

  const today = getNormalizedDate();

  try {
    await prisma.dailyLinkStat.upsert({
      where: {
        linkId_date: {
          linkId,
          date: today,
        },
      },
      update: {
        clicks: { increment: 1 },
      },
      create: {
        linkId,
        date: today,
        clicks: 1,
      },
    });
  } catch (error) {
    console.error("Failed to record link click:", error);
  }
}

export async function recordPageView(username: string, userAgent: string | null, headers: Headers) {
  if (!shouldCountClick(userAgent, headers)) {
    return;
  }

  const cleanUsername = username.toLowerCase().trim();
  const today = getNormalizedDate();

  try {
    await prisma.dailyProfileStat.upsert({
      where: {
        username_date: {
          username: cleanUsername,
          date: today,
        },
      },
      update: {
        views: { increment: 1 },
      },
      create: {
        username: cleanUsername,
        date: today,
        views: 1,
      },
    });
  } catch (error) {
    console.error("Failed to record page view:", error);
  }
}

