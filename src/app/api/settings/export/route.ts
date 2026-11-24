import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        links: { orderBy: { position: "asc" } },
        socials: { orderBy: { position: "asc" } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });
    }

    const dateStr = new Date().toISOString().split("T")[0];

    if (format === "csv") {
      const headers = ["Title", "URL", "Type", "Clicks", "Active", "Created At"];
      const rows = user.links.map((link) => [
        `"${link.title.replace(/"/g, '""')}"`,
        `"${link.url}"`,
        link.type || "LINK",
        link.clicksCount || 0,
        link.isActive ? "Yes" : "No",
        link.createdAt.toISOString(),
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="anlinks-${user.username}-${dateStr}.csv"`,
        },
      });
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile: user.profile,
      links: user.links,
      socials: user.socials,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="anlinks-${user.username}-${dateStr}.json"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ success: false, error: "فشل تصدير البيانات" }, { status: 500 });
  }
}
