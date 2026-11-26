import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { revokeAllOtherSessions } from "@/features/auth/server/session.service";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const currentToken = (session.user as unknown as { sessionToken?: string }).sessionToken;
    if (!currentToken) {
      return NextResponse.json(
        { success: false, error: "رمز الجلسة غير متوفر" },
        { status: 400 }
      );
    }

    const count = await revokeAllOtherSessions(session.user.id, currentToken);
    return NextResponse.json({
      success: true,
      message: `تم إنهاء ${count} جلسة أخرى بنجاح`,
      revokedCount: count,
    });
  } catch (error) {
    console.error("Revoke other sessions error:", error);
    return NextResponse.json(
      { success: false, error: "فشل إنهاء الجلسات الأخرى" },
      { status: 500 }
    );
  }
}
