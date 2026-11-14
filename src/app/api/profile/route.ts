import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "غير مصرح، يرجى تسجيل الدخول" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      displayName,
      bio,
      avatarUrl,
      themeKey,
      accentColor,
      buttonStyle,
      borderRadius,
      font,
    } = body;

    const data: Record<string, unknown> = {};
    if (typeof displayName === "string") data.displayName = displayName.trim();
    if (typeof bio === "string") data.bio = bio.trim();
    if (typeof avatarUrl === "string") data.avatarUrl = avatarUrl.trim();
    if (typeof themeKey === "string") data.themeKey = themeKey.trim();
    if (typeof accentColor === "string") data.accentColor = accentColor.trim();
    if (typeof buttonStyle === "string") data.buttonStyle = buttonStyle.trim();
    if (typeof borderRadius === "string") data.borderRadius = borderRadius.trim();
    if (typeof font === "string") data.font = font.trim();

    const updated = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        userId: session.user.id,
        displayName: displayName || session.user.name || "مستخدم جديد",
        bio: bio || "",
        avatarUrl: avatarUrl || null,
        themeKey: themeKey || "default",
        accentColor: accentColor || "#4edea3",
        buttonStyle: buttonStyle || "filled",
        borderRadius: borderRadius || "rounded-xl",
        font: font || "Cairo",
      },
    });

    return NextResponse.json({ success: true, profile: updated }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حفظ التعديلات" },
      { status: 500 }
    );
  }
}

