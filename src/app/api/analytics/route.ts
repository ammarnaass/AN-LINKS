import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { UserAnalyticsSummary } from "@/features/analytics/types/analytics.types";
import { aggregateAnalyticsBreakdowns } from "@/features/analytics/services/analytics-breakdown.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });
    }

    const rawRange = Number(request.nextUrl.searchParams.get("range"));
    const rangeDays = rawRange === 7 || rawRange === 30 ? rawRange : 14;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - rangeDays);

    const [dailyViews, userLinks] = await Promise.all([
      prisma.dailyProfileStat.findMany({
        where: {
          username: user.username,
          date: { gte: sinceDate },
        },
        orderBy: { date: "asc" },
      }),
      prisma.link.findMany({
        where: { userId: session.user.id },
        include: {
          stats: {
            where: { date: { gte: sinceDate } },
          },
        },
      }),
    ]);

    const totalViews = dailyViews.reduce((acc, curr) => acc + curr.views, 0);
    const linkClicksMap = new Map<string, number>();
    let totalClicks = 0;

    for (const link of userLinks) {
      const clicks = link.stats.reduce((acc, s) => acc + s.clicks, 0);
      linkClicksMap.set(link.id, clicks);
      totalClicks += clicks;
    }

    const averageCtr = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    const dates = Array.from({ length: rangeDays }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (rangeDays - 1 - i));
      return {
        iso: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("ar-SA", { month: "short", day: "numeric" }),
      };
    });

    const chartData = dates.map((d) => {
      const viewRecord = dailyViews.find((v) => v.date.toISOString().startsWith(d.iso));
      let dayClicks = 0;
      for (const link of userLinks) {
        const stat = link.stats.find((s) => s.date.toISOString().startsWith(d.iso));
        if (stat) dayClicks += stat.clicks;
      }
      return {
        date: d.label,
        views: viewRecord ? viewRecord.views : 0,
        clicks: dayClicks,
      };
    });

    const topLinks = userLinks
      .map((l) => {
        const clicks = linkClicksMap.get(l.id) || 0;
        const ctr = totalViews > 0 ? Number(((clicks / totalViews) * 100).toFixed(1)) : 0;
        return {
          id: l.id,
          title: l.title,
          url: l.url,
          clicks,
          ctr,
        };
      })
      .sort((a, b) => b.clicks - a.clicks);

    const userLinkIds = userLinks.map((l) => l.id);
    const { trafficSources, countries } = await aggregateAnalyticsBreakdowns(userLinkIds, sinceDate);

    const summary: UserAnalyticsSummary = {
      totalViews,
      totalClicks,
      averageCtr,
      chartData,
      topLinks,
      trafficSources,
      countries,
    };

    return NextResponse.json({ success: true, analytics: summary });
  } catch (error) {
    console.error("User analytics fetch error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب الإحصاءات" }, { status: 500 });
  }
}

