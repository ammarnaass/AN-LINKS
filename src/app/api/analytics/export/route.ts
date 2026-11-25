import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

function escapeCsvCell(value: string | number | null | undefined): string {
  const safe = String(value ?? "").replace(/"/g, '""');
  return `"${safe}"`;
}

/**
 * Exports the authenticated creator's analytics (views & link clicks) as an Arabic-ready UTF-8 BOM CSV.
 */
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
    const rangeDays = rawRange === 7 || rawRange === 14 ? rawRange : 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - rangeDays);

    const [dailyViews, userLinks] = await Promise.all([
      prisma.dailyProfileStat.findMany({
        where: { username: user.username, date: { gte: sinceDate } },
        orderBy: { date: "asc" },
      }),
      prisma.link.findMany({
        where: { userId: session.user.id },
        orderBy: { clicksCount: "desc" },
        select: { title: true, url: true, clicksCount: true, isActive: true },
      }),
    ]);

    const lines: string[] = [];
    lines.push("التاريخ,مشاهدات الصفحة");
    for (const v of dailyViews) {
      lines.push([escapeCsvCell(v.date.toISOString().split("T")[0]), escapeCsvCell(v.views)].join(","));
    }

    lines.push("");
    lines.push("عنوان الرابط,الرابط,إجمالي النقرات,الحالة");
    for (const l of userLinks) {
      lines.push(
        [
          escapeCsvCell(l.title),
          escapeCsvCell(l.url),
          escapeCsvCell(l.clicksCount),
          escapeCsvCell(l.isActive ? "نشط" : "مخفي"),
        ].join(",")
      );
    }

    const csvContent = `\uFEFF${lines.join("\n")}`;
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="anlinks-analytics.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Analytics CSV export error:", error);
    return NextResponse.json({ success: false, error: "فشل تصدير التحليلات" }, { status: 500 });
  }
}
