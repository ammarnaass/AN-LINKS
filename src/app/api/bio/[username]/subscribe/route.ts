import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import { sendTransactionalEmail } from "@/lib/mailer";
import { enqueueWebhookEvent } from "@/features/webhooks";

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
        profile: {
          select: {
            newsletterEnabled: true,
            displayName: true,
            welcomeSubject: true,
            welcomeBody: true,
            welcomeGiftUrl: true,
          },
        },
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

    // Trigger automated welcome email asynchronously if configured
    if (creator.profile?.welcomeSubject && creator.profile?.welcomeBody) {
      const subject = creator.profile.welcomeSubject;
      const body = creator.profile.welcomeBody;
      const giftUrl = creator.profile.welcomeGiftUrl;
      const creatorName = creator.profile.displayName || cleanUsername;

      let html = `<div dir="rtl" style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h2>مرحباً بك! 🎉</h2>
        <p>${body.replace(/\n/g, "<br/>")}</p>`;
      if (giftUrl) {
        html += `<p><a href="${giftUrl}" style="display: inline-block; background-color: #4edea3; color: #003822; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">تحميل الهدية الترحيبية 🎁</a></p>`;
      }
      html += `<p style="margin-top: 24px; font-size: 14px; color: #64748b;">تحياتنا،<br/>${creatorName} عبر منصة AN LINKS</p></div>`;

      void sendTransactionalEmail({
        to: email,
        subject,
        html,
      }).catch((err) => console.error("Welcome email dispatch failed:", err));
    }

    // Enqueue outgoing webhook event for creators with integrations
    void enqueueWebhookEvent({
      creatorId: creator.id,
      event: "lead.collected",
      payload: {
        subscriberId: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        source: "bio_page",
        createdAt: subscriber.createdAt,
      },
    }).catch((err) => console.error("Webhook lead dispatch failed:", err));

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
