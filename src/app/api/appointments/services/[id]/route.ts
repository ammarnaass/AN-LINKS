import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import {
  updateCreatorService,
  deleteOrArchiveCreatorService,
} from "@/features/appointments";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateCreatorService(session.user.id, id, body);
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل تعديل باقة الخدمة";
    if (msg.startsWith("QUOTA_")) {
      return NextResponse.json(
        { success: false, error: msg.replace(/^QUOTA_[A-Z_]+:\s*/, "") },
        { status: 403 }
      );
    }
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const result = await deleteOrArchiveCreatorService(session.user.id, id);
    return NextResponse.json({
      success: true,
      archived: result.archived,
      message: result.archived
        ? "تم أرشفة الخدمة لحفظ سجل المواعيد التاريخية المرتبطة بها"
        : "تم حذف الخدمة بنجاح",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "فشل حذف باقة الخدمة";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
