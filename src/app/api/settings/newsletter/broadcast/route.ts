import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { sendTransactionalEmail } from "@/lib/mailer";

function buildBroadcastHtml(options: {
  creatorName: string;
  subject: string;
  content: string;
  isTest?: boolean;
}): string {
  const formattedContent = options.content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((p) => `<p style="margin: 0 0 16px 0; line-height: 1.8; color: #cbd5e1;">${p}</p>`)
    .join("");

  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 28px; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
      ${options.isTest ? '<div style="background: #eab308; color: #000; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 11px; margin-bottom: 16px; display: inline-block;">⚠️ رسالة تجريبية مسبقة للمعاينة</div>' : ""}
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
        <h3 style="margin: 0; color: #4edea3; font-size: 16px;">نشرة ${options.creatorName}</h3>
        <h1 style="margin: 8px 0 0 0; font-size: 20px; color: #ffffff;">${options.subject}</h1>
      </div>
      <div style="font-size: 14px;">
        ${formattedContent}
      </div>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center;">
        وصلتك هذه الرسالة لاشتراكك في النشرة البريدية لـ ${options.creatorName} عبر منصة AN LINKS.
      </div>
    </div>
  `;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const broadcasts = await prisma.newsletterBroadcast.findMany({
      where: { creatorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, broadcasts });
  } catch (error) {
    console.error("Fetch broadcasts error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب سجل الحملات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const testOnly = Boolean(body.testOnly);

    if (!subject) {
      return NextResponse.json({ success: false, error: "عنوان الرسالة مطلوب" }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: "محتوى الرسالة مطلوب" }, { status: 400 });
    }

    const creator = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, username: true, profile: { select: { displayName: true } } },
    });
    const creatorName = creator?.profile?.displayName || creator?.username || "صانع المحتوى";

    if (testOnly) {
      const recipient = creator?.email || session.user.email;
      if (!recipient) {
        return NextResponse.json({ success: false, error: "لم يتم العثور على بريد لحسابك لإرسال التجربة" }, { status: 400 });
      }

      const html = buildBroadcastHtml({ creatorName, subject, content, isTest: true });
      await sendTransactionalEmail({
        to: recipient,
        subject: `[تجربة] ${subject}`,
        html,
        text: content,
      });

      return NextResponse.json({
        success: true,
        message: `تم إرسال نسخة تجريبية إلى بريدك (${recipient}) بنجاح`,
      });
    }

    const subscribers = await prisma.creatorSubscriber.findMany({
      where: { creatorId: session.user.id, status: "ACTIVE" },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: "لا يوجد مشتركون نشطون في قائمتك البريدية لإرسال الحملة إليهم" },
        { status: 400 }
      );
    }

    const html = buildBroadcastHtml({ creatorName, subject, content, isTest: false });

    // Send emails in background / parallel batch
    const dispatchPromises = subscribers.map((sub) =>
      sendTransactionalEmail({
        to: sub.email,
        subject,
        html,
        text: content,
      }).catch((err) => {
        console.error(`Failed to send broadcast to ${sub.email}:`, err);
        return null;
      })
    );
    await Promise.all(dispatchPromises);

    const record = await prisma.newsletterBroadcast.create({
      data: {
        creatorId: session.user.id,
        subject,
        content,
        sentCount: subscribers.length,
        status: "SENT",
      },
    });

    return NextResponse.json({
      success: true,
      message: `تم إرسال الحملة بنجاح إلى ${subscribers.length} مشترك`,
      broadcast: record,
    });
  } catch (error) {
    console.error("Broadcast dispatch error:", error);
    return NextResponse.json({ success: false, error: "فشل إرسال الحملة البريدية" }, { status: 500 });
  }
}
