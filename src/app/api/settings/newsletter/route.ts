import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { sanitizeHttpUrl } from "@/lib/html-escape";

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
        welcomeSubject: true,
        welcomeBody: true,
        welcomeGiftUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      newsletter: {
        newsletterEnabled: profile?.newsletterEnabled !== false,
        newsletterTitle: profile?.newsletterTitle || "",
        newsletterSubtitle: profile?.newsletterSubtitle || "",
        newsletterButtonText: profile?.newsletterButtonText || "",
        welcomeSubject: profile?.welcomeSubject || "",
        welcomeBody: profile?.welcomeBody || "",
        welcomeGiftUrl: profile?.welcomeGiftUrl || "",
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
      welcomeSubject?: string | null;
      welcomeBody?: string | null;
      welcomeGiftUrl?: string | null;
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
    if (body.welcomeSubject !== undefined) {
      data.welcomeSubject = typeof body.welcomeSubject === "string" ? body.welcomeSubject.trim() || null : null;
    }
    if (body.welcomeBody !== undefined) {
      data.welcomeBody = typeof body.welcomeBody === "string" ? body.welcomeBody.trim() || null : null;
    }
    if (body.welcomeGiftUrl !== undefined) {
      const rawUrl = typeof body.welcomeGiftUrl === "string" ? body.welcomeGiftUrl.trim() : "";
      data.welcomeGiftUrl = rawUrl ? sanitizeHttpUrl(rawUrl) : null;
    }

    const updated = await prisma.profile.update({
      where: { userId: session.user.id },
      data,
      select: {
        newsletterEnabled: true,
        newsletterTitle: true,
        newsletterSubtitle: true,
        newsletterButtonText: true,
        welcomeSubject: true,
        welcomeBody: true,
        welcomeGiftUrl: true,
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
