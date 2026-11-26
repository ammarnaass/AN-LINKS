import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeCsvCell(value: string | null | undefined): string {
  const safe = (value ?? "").replace(/"/g, '""');
  return `"${safe}"`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q")?.trim() || "";
    const statusFilter = searchParams.get("status")?.toUpperCase();
    const format = searchParams.get("format");

    const where: {
      creatorId: string;
      status?: string;
      OR?: Array<{ email?: { contains: string; mode: "insensitive" }; name?: { contains: string; mode: "insensitive" } }>;
    } = {
      creatorId: session.user.id,
    };

    if (statusFilter === "ACTIVE" || statusFilter === "UNSUBSCRIBED") {
      where.status = statusFilter;
    }

    if (query) {
      where.OR = [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ];
    }

    const subscribers = await prisma.creatorSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    if (format === "csv") {
      const header = "البريد الإلكتروني,الاسم,المصدر,الحالة,تاريخ الاشتراك";
      const rows = subscribers.map((sub) =>
        [
          escapeCsvCell(sub.email),
          escapeCsvCell(sub.name || "مشترك"),
          escapeCsvCell(sub.source || "bio_page"),
          escapeCsvCell(sub.status || "ACTIVE"),
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

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, active, unsubscribed, thisMonth] = await Promise.all([
      prisma.creatorSubscriber.count({ where: { creatorId: session.user.id } }),
      prisma.creatorSubscriber.count({ where: { creatorId: session.user.id, status: "ACTIVE" } }),
      prisma.creatorSubscriber.count({ where: { creatorId: session.user.id, status: "UNSUBSCRIBED" } }),
      prisma.creatorSubscriber.count({
        where: { creatorId: session.user.id, createdAt: { gte: startOfMonth } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      subscribers,
      stats: { total, active, unsubscribed, thisMonth },
    });
  } catch (error) {
    console.error("Fetch subscribers error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب قائمة المشتركين" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : null;

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "الرجاء إدخال بريد إلكتروني صالح" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.creatorSubscriber.upsert({
      where: {
        creatorId_email: {
          creatorId: session.user.id,
          email,
        },
      },
      update: {
        name: name || undefined,
        status: "ACTIVE",
      },
      create: {
        creatorId: session.user.id,
        email,
        name,
        source: "manual",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "تمت إضافة المشترك بنجاح",
      subscriber,
    });
  } catch (error) {
    console.error("Add subscriber error:", error);
    return NextResponse.json(
      { success: false, error: "فشل إضافة المشترك" },
      { status: 500 }
    );
  }
}
