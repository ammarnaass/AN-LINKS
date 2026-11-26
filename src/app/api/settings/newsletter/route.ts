import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        displayName: true,
        accentColor: true,
        newsletterEnabled: true,
        newsletterTitle: true,
        newsletterSubtitle: true,
        newsletterButtonText: true,
      },
    });

    return NextResponse.json({
      success: true,
      newsletter: {
        newsletterEnabled: profile?.newsletterEnabled !== false,
        newsletterTitle: profile?.newsletterTitle || "",
        newsletterSubtitle: profile?.newsletterSubtitle || "",
        newsletterButtonText: profile?.newsletterButtonText || "",
        displayName: profile?.displayName || "",
        accentColor: profile?.accentColor || "#3B82F6",
      },
    });
  } catch (error) {
    console.error("Fetch newsletter settings error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب إعدادات النشرة" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const data: {
      newsletterEnabled?: boolean;
      newsletterTitle?: string | null;
      newsletterSubtitle?: string | null;
      newsletterButtonText?: string | null;
    } = {};

    if (typeof body.newsletterEnabled === "boolean") {
      data.newsletterEnabled = body.newsletterEnabled;
    }
    if (body.newsletterTitle !== undefined) {
      data.newsletterTitle = typeof body.newsletterTitle === "string" ? body.newsletterTitle.trim() || null : null;
    }
    if (body.newsletterSubtitle !== undefined) {
      data.newsletterSubtitle = typeof body.newsletterSubtitle === "string" ? body.newsletterSubtitle.trim() || null : null;
    }
    if (body.newsletterButtonText !== undefined) {
      data.newsletterButtonText = typeof body.newsletterButtonText === "string" ? body.newsletterButtonText.trim() || null : null;
    }

    const updated = await prisma.profile.update({
      where: { userId: session.user.id },
      data,
      select: {
        newsletterEnabled: true,
        newsletterTitle: true,
        newsletterSubtitle: true,
        newsletterButtonText: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ إعدادات النشرة البريدية بنجاح",
      newsletter: updated,
    });
  } catch (error) {
    console.error("Update newsletter settings error:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث إعدادات النشرة" }, { status: 500 });
  }
}
