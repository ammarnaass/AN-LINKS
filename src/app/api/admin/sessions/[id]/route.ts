import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/features/admin/server/admin.guard";
import { adminRevokeSession } from "@/features/auth/server/session.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const guard = await requireAdminSession();
  if (!guard.authorized) return guard.response;

  try {
    const { id } = await params;
    const revoked = await adminRevokeSession(id);

    if (!revoked) {
      return NextResponse.json({ success: false, error: "الجلسة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم إنهاء الجلسة من قبل الإدارة", id });
  } catch (error) {
    console.error("Admin revoke session error:", error);
    return NextResponse.json({ success: false, error: "فشل إنهاء الجلسة" }, { status: 500 });
  }
}
