import { prisma } from "@/shared/db";
import { getNormalizedDate } from "./tracking.service";
import { TimeSeriesPoint, AnalyticsSummary } from "../types/analytics.types";

export function calculateCTR(views: number, clicks: number): number {
  if (!views || views <= 0) return 0.0;
  return Math.round((clicks / views) * 1000) / 10;
}

export function generateDateRange(days: number): string[] {
  const result: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push(d.toISOString().split("T")[0]);
  }

  return result;
}

export function aggregateTimeSeries(
  records: { date: string; count: number }[],
  days: number
): TimeSeriesPoint[] {
  const dates = generateDateRange(days);
  const recordMap = new Map<string, number>();

  for (const r of records) {
    recordMap.set(r.date, r.count);
  }

  return dates.map((date) => ({
    date,
    count: recordMap.get(date) || 0,
  }));
}

export async function getProfileAnalytics(username: string, days: number = 7): Promise<AnalyticsSummary> {
  const cleanUsername = username.toLowerCase().trim();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setUTCHours(0, 0, 0, 0);

  // 1. Fetch Views
  const viewsData = await prisma.dailyProfileStat.findMany({
    where: {
      username: cleanUsername,
      date: { gte: startDate },
    },
    orderBy: { date: "asc" },
  });

  // 2. Fetch Clicks for User's Links
  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: {
      links: {
        select: {
          id: true,
          title: true,
          stats: {
            where: { date: { gte: startDate } },
          },
        },
      },
    },
  });

  const viewsFormatted = viewsData.map((v) => ({
    date: v.date.toISOString().split("T")[0],
    count: v.views,
  }));

  const viewsSeries = aggregateTimeSeries(viewsFormatted, days);
  const totalViews = viewsSeries.reduce((acc, curr) => acc + curr.count, 0);

  // Group clicks by date
  const clicksByDateMap = new Map<string, number>();
  const topLinksList: { id: string; title: string; clicks: number }[] = [];

  if (user?.links) {
    for (const link of user.links) {
      let linkTotalClicks = 0;
      for (const stat of link.stats) {
        const dateStr = stat.date.toISOString().split("T")[0];
        const existing = clicksByDateMap.get(dateStr) || 0;
        clicksByDateMap.set(dateStr, existing + stat.clicks);
        linkTotalClicks += stat.clicks;
      }
      topLinksList.push({
        id: link.id,
        title: link.title,
        clicks: linkTotalClicks,
      });
    }
  }

  topLinksList.sort((a, b) => b.clicks - a.clicks);

  const clicksFormatted = Array.from(clicksByDateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  const clicksSeries = aggregateTimeSeries(clicksFormatted, days);
  const totalClicks = clicksSeries.reduce((acc, curr) => acc + curr.count, 0);
  const ctr = calculateCTR(totalViews, totalClicks);

  return {
    rangeDays: days,
    totalViews,
    totalClicks,
    ctr,
    viewsSeries,
    clicksSeries,
    topLinks: topLinksList,
  };
}

