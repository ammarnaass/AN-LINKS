import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { CreateLinkInput, BatchReorderInput } from "@/features/links/types/links.types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const [links, socials] = await Promise.all([
      prisma.link.findMany({
        where: { userId: session.user.id },
        orderBy: { position: "asc" },
        include: {
          stats: {
            select: { clicks: true },
          },
        },
      }),
      prisma.socialLink.findMany({
        where: { userId: session.user.id },
        orderBy: { position: "asc" },
      }),
    ]);

    const formattedLinks = links.map((l) => ({
      id: l.id,
      userId: l.userId,
      title: l.title,
      url: l.url,
      icon: l.icon,
      position: l.position,
      isActive: l.isActive,
      clicks: l.stats.reduce((acc, curr) => acc + curr.clicks, 0),
      createdAt: l.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      links: formattedLinks,
      socials: socials.map((s) => ({ id: s.id, network: s.network, url: s.url, position: s.position })),
    });
  } catch (error) {
    console.error("Fetch links error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب الروابط" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body: CreateLinkInput = await request.json();
    if (!body.title?.trim() || !body.url?.trim()) {
      return NextResponse.json({ success: false, error: "عنوان الرابط والرابط مطلوبان" }, { status: 400 });
    }

    const count = await prisma.link.count({ where: { userId: session.user.id } });

    const newLink = await prisma.link.create({
      data: {
        userId: session.user.id,
        title: body.title.trim(),
        url: body.url.trim(),
        icon: body.icon || null,
        position: count,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, link: newLink }, { status: 201 });
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json({ success: false, error: "فشل إنشاء الرابط" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body: BatchReorderInput = await request.json();
    const ops = [];

    if (Array.isArray(body.links)) {
      for (const item of body.links) {
        ops.push(
          prisma.link.updateMany({
            where: { id: item.id, userId: session.user.id },
            data: {
              position: item.position,
              ...(typeof item.isActive === "boolean" ? { isActive: item.isActive } : {}),
            },
          })
        );
      }
    }

    if (Array.isArray(body.socials)) {
      ops.push(prisma.socialLink.deleteMany({ where: { userId: session.user.id } }));
      if (body.socials.length > 0) {
        ops.push(
          prisma.socialLink.createMany({
            data: body.socials.map((s, idx) => ({
              userId: session.user.id,
              network: s.network,
              url: s.url,
              position: s.position ?? idx,
            })),
          })
        );
      }
    }

    await prisma.$transaction(ops);
    return NextResponse.json({ success: true, message: "تم تحديث الترتيب بنجاح" });
  } catch (error) {
    console.error("Batch update links error:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث الروابط" }, { status: 500 });
  }
}

