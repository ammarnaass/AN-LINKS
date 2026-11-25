import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

function escapeCsvCell(value: string | null | undefined): string {
  const safe = (value ?? "").replace(/"/g, '""');
  return `"${safe}"`;
}

/**
 * Lists or exports (CSV with UTF-8 BOM) the authenticated creator's newsletter subscribers.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const subscribers = await prisma.creatorSubscriber.findMany({
      where: { creatorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const format = request.nextUrl.searchParams.get("format");
    if (format === "csv") {
      const header = "البريد الإلكتروني,الاسم,المصدر,تاريخ الاشتراك";
      const rows = subscribers.map((sub) =>
        [
          escapeCsvCell(sub.email),
          escapeCsvCell(sub.name || "مشترك"),
          escapeCsvCell(sub.source || "bio_page"),
          escapeCsvCell(sub.createdAt.toISOString()),
        ].join(",")
      );
      const csvContent = `\uFEFF${[header, ...rows].join("\n")}`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="anlinks-subscribers.csv"',
          "Cache-Control": "no-store",
        },
      });
    }

    return NextResponse.json({
      success: true,
      total: subscribers.length,
      subscribers,
    });
  } catch (error) {
    console.error("Fetch subscribers error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب قائمة المشتركين" },
      { status: 500 }
    );
  }
}
