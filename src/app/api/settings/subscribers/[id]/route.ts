import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const status = body.status === "UNSUBSCRIBED" ? "UNSUBSCRIBED" : "ACTIVE";

    const existing = await prisma.creatorSubscriber.findFirst({
      where: { id, creatorId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "المشترك غير موجود" }, { status: 404 });
    }

    const updated = await prisma.creatorSubscriber.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, subscriber: updated });
  } catch (error) {
    console.error("Update subscriber error:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث حالة المشترك" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.creatorSubscriber.findFirst({
      where: { id, creatorId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "المشترك غير موجود" }, { status: 404 });
    }

    await prisma.creatorSubscriber.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "تم حذف المشترك بنجاح" });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json({ success: false, error: "فشل حذف المشترك" }, { status: 500 });
  }
}
