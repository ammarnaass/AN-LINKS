import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import {
  updateNotification,
  deleteNotification,
} from "@/features/notifications/server/notification.service";
import { NotificationPayload } from "@/features/notifications/types/notification.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف مطلوب" }, { status: 400 });
    }

    const body = (await req.json()) as Partial<NotificationPayload>;
    const updated = await updateNotification(id, body);
    return NextResponse.json({ success: true, notification: updated });
  } catch (error) {
    console.error("PUT /api/admin/notifications/[id] error:", error);
    return NextResponse.json({ success: false, error: "تعذر تحديث الإشعار" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف مطلوب" }, { status: 400 });
    }

    await deleteNotification(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/notifications/[id] error:", error);
    return NextResponse.json({ success: false, error: "تعذر حذف الإشعار" }, { status: 500 });
  }
}
