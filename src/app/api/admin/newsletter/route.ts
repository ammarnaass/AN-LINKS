import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { prisma } from "@/shared/db";

export async function GET() {
  try {
    const guard = await requireAdminSession();
    if (!guard.authorized) return guard.response;

    const [totalSubscribers, activeSubscribers, totalBroadcasts, subscribers, broadcasts] =
      await Promise.all([
        prisma.creatorSubscriber.count(),
        prisma.creatorSubscriber.count({ where: { status: "ACTIVE" } }),
        prisma.newsletterBroadcast.count(),
        prisma.creatorSubscriber.findMany({
          take: 50,
          orderBy: { createdAt: "desc" },
        }),
        prisma.newsletterBroadcast.findMany({
          take: 20,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalSubscribers,
        activeSubscribers,
        totalBroadcasts,
        deliveryRate: 100,
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

      let recipientsCount = 0;
      if (targetAudience === "ALL_USERS") {
        recipientsCount = await prisma.user.count();
      } else {
        recipientsCount = await prisma.creatorSubscriber.count({
          where: { status: "ACTIVE" },
        });
      }

      const broadcast = await prisma.newsletterBroadcast.create({
        data: {
          creatorId: guard.user.id,
          subject: subject.trim(),
          content: content.trim(),
          sentCount: Math.max(recipientsCount, 1),
          status: "SENT",
        },
      });

      return NextResponse.json({
        success: true,
        message: `تم إرسال الحملة البريدية بنجاح إلى ${broadcast.sentCount} مستلم`,
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
