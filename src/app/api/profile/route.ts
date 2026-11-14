import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });
    }

    const profile = user.profile || (await prisma.profile.create({
      data: {
        userId: user.id,
        displayName: user.username,
        bio: "",
        themeKey: "default",
        accentColor: "#4edea3",
        buttonStyle: "filled",
        borderRadius: "rounded-xl",
        font: "Cairo",
        isPublished: true,
      },
    }));

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب الملف الشخصي" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};
    const textFields = ["displayName", "bio", "avatarUrl", "themeKey", "accentColor", "buttonStyle", "borderRadius", "font", "phone"];
    for (const f of textFields) {
      if (typeof body[f] === "string") data[f] = body[f].trim();
    }
    if (typeof body.seoIndexing === "boolean") data.seoIndexing = body.seoIndexing;
    if (typeof body.isPublished === "boolean") data.isPublished = body.isPublished;

    const updated = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        userId: session.user.id,
        displayName: (data.displayName as string) || session.user.name || "مستخدم جديد",
        bio: (data.bio as string) || "",
        avatarUrl: (data.avatarUrl as string) || null,
        phone: (data.phone as string) || null,
        seoIndexing: typeof data.seoIndexing === "boolean" ? data.seoIndexing : true,
        themeKey: (data.themeKey as string) || "default",
        accentColor: (data.accentColor as string) || "#4edea3",
        buttonStyle: (data.buttonStyle as string) || "filled",
        borderRadius: (data.borderRadius as string) || "rounded-xl",
        font: (data.font as string) || "Cairo",
      },
    });

    return NextResponse.json({ success: true, profile: updated }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء حفظ التعديلات" }, { status: 500 });
  }
}
