import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { prisma } from "@/shared/db";
import { sendTransactionalEmail } from "@/lib/mailer";
import { escapeHtml } from "@/lib/html-escape";

export async function GET() {
  try {
    const guard = await requireAdminSession();
    if (!guard.authorized) return guard.response;

    const [totalSubscribers, activeSubscribers, totalBroadcasts, sentBroadcasts, subscribers, broadcasts] =
      await Promise.all([
        prisma.creatorSubscriber.count(),
        prisma.creatorSubscriber.count({ where: { status: "ACTIVE" } }),
        prisma.newsletterBroadcast.count(),
        prisma.newsletterBroadcast.count({ where: { status: "SENT" } }),
        prisma.creatorSubscriber.findMany({
          take: 50,
          orderBy: { createdAt: "desc" },
        }),
        prisma.newsletterBroadcast.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const deliveryRate =
      totalBroadcasts > 0 ? Math.round((sentBroadcasts / totalBroadcasts) * 100) : 100;

    return NextResponse.json({
      success: true,
      stats: {
        totalSubscribers,
        activeSubscribers,
        totalBroadcasts,
        deliveryRate,
      },
      subscribers,
      broadcasts,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل جلب بيانات النشرة البريدية للمنصة";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdminSession();
    if (!guard.authorized) return guard.response;

    const body = await req.json().catch(() => ({}));
    const { action } = body;

    if (action === "broadcast") {
      const { subject, content, targetAudience = "ALL_SUBSCRIBERS" } = body;
      if (!subject || !subject.trim() || !content || !content.trim()) {
        return NextResponse.json(
          { success: false, error: "عنوان الحملة ومحتواها مطلوبان" },
          { status: 400 }
        );
      }

      const rawEmails =
        targetAudience === "ALL_USERS"
          ? (await prisma.user.findMany({ where: { isSuspended: false }, select: { email: true } })).map(
              (u) => u.email
            )
          : (
              await prisma.creatorSubscriber.findMany({
                where: { status: "ACTIVE" },
                select: { email: true },
              })
            ).map((s) => s.email);

      const recipients = Array.from(
        new Set(rawEmails.map((e) => e.trim().toLowerCase()).filter(Boolean))
      );

      if (recipients.length === 0) {
        return NextResponse.json(
          { success: false, error: "لا يوجد مستلمون نشطون لهذه الفئة حالياً" },
          { status: 400 }
        );
      }

      const cleanSubject = subject.trim();
      const cleanContent = content.trim();
      const bodyHtml = cleanContent
        .split("\n")
        .filter((l: string) => l.trim().length > 0)
        .map((p: string) => `<p style="margin:0 0 14px 0;line-height:1.8;">${escapeHtml(p)}</p>`)
        .join("");
      const html = `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;background:#0f172a;color:#f8fafc;border-radius:16px;"><h2 style="color:#4edea3;margin-top:0;">${escapeHtml(cleanSubject)}</h2>${bodyHtml}<hr style="border-color:#1e293b;margin:24px 0;"/><p style="font-size:11px;color:#64748b;">رسالة إدارية من منصة AN LINKS.</p></div>`;

      let deliveredCount = 0;
      for (let i = 0; i < recipients.length; i += 20) {
        const batch = recipients.slice(i, i + 20);
        const results = await Promise.allSettled(
          batch.map((to) =>
            sendTransactionalEmail({ to, subject: cleanSubject, html, text: cleanContent })
          )
        );
        deliveredCount += results.filter(
          (r) => r.status === "fulfilled" && r.value?.sent
        ).length;
      }

      const broadcast = await prisma.newsletterBroadcast.create({
        data: {
          creatorId: guard.user.id,
          subject: cleanSubject,
          content: cleanContent,
          sentCount: deliveredCount,
          status: deliveredCount > 0 ? "SENT" : "FAILED",
        },
      });

      return NextResponse.json({
        success: deliveredCount > 0,
        message:
          deliveredCount > 0
            ? `تم إرسال الحملة البريدية بنجاح إلى ${deliveredCount} مستلم`
            : "تعذر إرسال الحملة البريدية عبر مزود البريد",
        broadcast,
      });
    }

    if (action === "delete-subscriber") {
      const { subscriberId } = body;
      if (!subscriberId) {
        return NextResponse.json(
          { success: false, error: "معرّف المشترك مطلوب" },
          { status: 400 }
        );
      }

      await prisma.creatorSubscriber.delete({
        where: { id: subscriberId },
      });

      return NextResponse.json({
        success: true,
        message: "تم حذف المشترك من المنظومة بنجاح",
      });
    }

    if (action === "toggle-status") {
      const { subscriberId, currentStatus } = body;
      if (!subscriberId) {
        return NextResponse.json(
          { success: false, error: "معرّف المشترك مطلوب" },
          { status: 400 }
        );
      }

      const nextStatus = currentStatus === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE";
      const updated = await prisma.creatorSubscriber.update({
        where: { id: subscriberId },
        data: { status: nextStatus },
      });

      return NextResponse.json({
        success: true,
        message: `تم تحديث حالة المشترك إلى ${nextStatus === "ACTIVE" ? "نشط" : "ملغى"}`,
        subscriber: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "الإجراء المطلوب غير صالح" },
      { status: 400 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تنفيذ العملية الإدارية";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
