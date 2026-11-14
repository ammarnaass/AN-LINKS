import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { revokeUserSession } from "@/features/auth/server/session.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const revoked = await revokeUserSession(id, session.user.id);

    if (!revoked) {
      return NextResponse.json({ success: false, error: "الجلسة غير موجودة أو لا تملك صلاحية إنهائها" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم إنهاء الجلسة بنجاح", id });
  } catch (error) {
    console.error("Revoke user session error:", error);
    return NextResponse.json({ success: false, error: "فشل إنهاء الجلسة" }, { status: 500 });
  }
}

