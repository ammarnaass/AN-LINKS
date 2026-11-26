import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";

interface RouteParams {
  params: Promise<{ username: string }>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const limited = enforceRateLimit(request, "bio_subscribe", {
      maxAttempts: 15,
      windowMs: 10 * 60 * 1000,
    });
    if (limited) return limited;

    const { username } = await params;
    if (!username) {
      return NextResponse.json(
        { success: false, error: "اسم المستخدم مطلوب" },
        { status: 400 }
      );
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

    const cleanUsername = username.toLowerCase().trim();
    const creator = await prisma.user.findUnique({
      where: { username: cleanUsername },
      select: {
        id: true,
        isSuspended: true,
        profile: { select: { newsletterEnabled: true } },
      },
    });

    if (!creator || creator.isSuspended) {
      return NextResponse.json(
        { success: false, error: "صانع المحتوى غير موجود" },
        { status: 404 }
      );
    }

    if (creator.profile && creator.profile.newsletterEnabled === false) {
      return NextResponse.json(
        { success: false, error: "النشرة البريدية غير مفعلة لهذا الحساب حالياً" },
        { status: 400 }
      );
    }

    // Upsert subscriber to prevent duplicate unique constraint error
    const subscriber = await prisma.creatorSubscriber.upsert({
      where: {
        creatorId_email: {
          creatorId: creator.id,
          email,
        },
      },
      update: {
        name: name || undefined,
        status: "ACTIVE",
      },
      create: {
        creatorId: creator.id,
        email,
        name,
        source: "bio_page",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم الاشتراك في النشرة بنجاح! شكراً لانضمامك 🎉",
      subscriberId: subscriber.id,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء معالجة الاشتراك" },
      { status: 500 }
    );
  }
}
