import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { UpdateLinkInput } from "@/features/links/types/links.types";

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
    const body: UpdateLinkInput = await request.json();

    const existing = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "الرابط غير موجود أو لا تملك صلاحية تعديله" }, { status: 404 });
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        ...(typeof body.title === "string" ? { title: body.title.trim() } : {}),
        ...(typeof body.url === "string" ? { url: body.url.trim() } : {}),
        ...(typeof body.type === "string" ? { type: body.type } : {}),
        ...(typeof body.icon !== "undefined" ? { icon: body.icon } : {}),
        ...(typeof body.isActive === "boolean" ? { isActive: body.isActive } : {}),
        ...(typeof body.isPinned === "boolean" ? { isPinned: body.isPinned } : {}),
        ...(typeof body.isArchived === "boolean" ? { isArchived: body.isArchived } : {}),
        ...(typeof body.platformId !== "undefined" ? { platformId: body.platformId } : {}),
        ...(typeof body.position === "number" ? { position: body.position } : {}),
        ...(typeof body.thumbnailUrl !== "undefined" ? { thumbnailUrl: body.thumbnailUrl } : {}),
        ...(typeof body.customBgColor !== "undefined" ? { customBgColor: body.customBgColor } : {}),
        ...(typeof body.customTextColor !== "undefined" ? { customTextColor: body.customTextColor } : {}),
        ...(typeof body.customBorderColor !== "undefined" ? { customBorderColor: body.customBorderColor } : {}),
        ...(typeof body.customShadow !== "undefined" ? { customShadow: body.customShadow } : {}),
        ...(typeof body.scheduledStart !== "undefined"
          ? { scheduledStart: body.scheduledStart ? new Date(body.scheduledStart) : null }
          : {}),
        ...(typeof body.scheduledEnd !== "undefined"
          ? { scheduledEnd: body.scheduledEnd ? new Date(body.scheduledEnd) : null }
          : {}),
        ...(typeof body.pinCode !== "undefined"
          ? { pinCode: body.pinCode ? body.pinCode.trim() : null }
          : {}),
        ...(typeof body.isSensitive === "boolean" ? { isSensitive: body.isSensitive } : {}),
      },
    });

    return NextResponse.json({ success: true, link: updated });
  } catch (error) {
    console.error("Patch link error:", error);
    return NextResponse.json({ success: false, error: "فشل تعديل الرابط" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "الرابط غير موجود أو لا تملك صلاحية حذفه" }, { status: 404 });
    }

    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف الرابط بنجاح", id });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json({ success: false, error: "فشل حذف الرابط" }, { status: 500 });
  }
}

