import { prisma } from "@/shared/db";
import { isBotOrPrefetch } from "@/shared/utils";
import { parseUserAgent } from "@/shared/utils/device-detector";

export function getNormalizedDate(date: Date = new Date()): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

export function shouldCountClick(userAgent: string | null, headers: Headers): boolean {
  return !isBotOrPrefetch(userAgent, headers);
}

export async function recordLinkClick(
  linkId: string,
  userAgent: string | null,
  headers: Headers,
  options?: {
    country?: string | null;
    city?: string | null;
    platformId?: string | null;
    referer?: string | null;
  }
) {
  if (!shouldCountClick(userAgent, headers)) {
    return;
  }

  const today = getNormalizedDate();
  const parsedUA = parseUserAgent(userAgent);

  const rawCountry = options?.country !== undefined 
    ? options.country 
    : (headers.get("cf-ipcountry") || headers.get("x-vercel-ip-country"));
  const country = (rawCountry && rawCountry !== "XX" && rawCountry !== "T1") ? rawCountry.toUpperCase().trim() : null;

  const city = options?.city !== undefined 
    ? options.city 
    : (headers.get("x-vercel-ip-city") || null);

  const referer = options?.referer !== undefined
    ? options.referer
    : (headers.get("referer") || null);

  try {
    let link: { platformId: string | null } | null = null;
    if (options?.platformId === undefined) {
      link = await prisma.link.findUnique({
        where: { id: linkId },
        select: { platformId: true },
      });
    }

    await prisma.$transaction([
      prisma.linkClick.create({
        data: {
          linkId,
          platformId: options?.platformId ?? link?.platformId ?? null,
          country,
          city,
          device: parsedUA.device,
          browser: parsedUA.browser,
          os: parsedUA.os,
          referer,
        },
      }),
      prisma.link.update({
        where: { id: linkId },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.dailyLinkStat.upsert({
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
      }),
    ]);
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

