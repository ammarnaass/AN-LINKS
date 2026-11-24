import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";

interface RouteParams {
  params: Promise<{ username: string }>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
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
      select: { id: true, isSuspended: true },
    });

    if (!creator || creator.isSuspended) {
      return NextResponse.json(
        { success: false, error: "صانع المحتوى غير موجود" },
        { status: 404 }
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
      },
      create: {
        creatorId: creator.id,
        email,
        name,
        source: "bio_page",
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
