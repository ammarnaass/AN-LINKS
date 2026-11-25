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
    const existing = await prisma.digitalProduct.findFirst({
      where: { id, creatorId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "المنتج غير موجود" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const product = await prisma.digitalProduct.update({
      where: { id },
      data: {
        ...(typeof body.isActive === "boolean" ? { isActive: body.isActive } : {}),
        ...(typeof body.title === "string" && body.title.trim() ? { title: body.title.trim() } : {}),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ success: false, error: "فشل تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.digitalProduct.findFirst({
      where: { id, creatorId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "المنتج غير موجود" }, { status: 404 });
    }

    await prisma.digitalProduct.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ success: false, error: "فشل حذف المنتج" }, { status: 500 });
  }
}
