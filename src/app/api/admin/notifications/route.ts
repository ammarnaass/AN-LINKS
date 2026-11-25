import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  getAllAdminNotifications,
  createNotification,
} from "@/features/notifications/server/notification.service";
import { NotificationPayload } from "@/features/notifications/types/notification.types";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const notifications = await getAllAdminNotifications();
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error("GET /api/admin/notifications error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب الإشعارات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const body = (await req.json()) as NotificationPayload;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ success: false, error: "عنوان الإشعار مطلوب" }, { status: 400 });
    }
    if (!body.message || !body.message.trim()) {
      return NextResponse.json({ success: false, error: "نص الإشعار مطلوب" }, { status: 400 });
    }

    const notification = await createNotification(body);
    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/notifications error:", error);
    return NextResponse.json({ success: false, error: "تعذر إنشاء الإشعار" }, { status: 500 });
  }
}
