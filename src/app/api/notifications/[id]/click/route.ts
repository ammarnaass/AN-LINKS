import { NextRequest, NextResponse } from "next/server";
import { incrementNotificationClick } from "@/features/notifications/server/notification.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "المعرف مطلوب" }, { status: 400 });
    }

    await incrementNotificationClick(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/notifications/[id]/click error:", error);
    return NextResponse.json({ success: false, error: "تعذر تسجيل النقر" }, { status: 500 });
  }
}
