import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { getUserActiveSessions, recordSession } from "@/features/auth/server/session.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const currentToken = (session.user as unknown as { sessionToken?: string }).sessionToken;
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");

    if (currentToken) {
      await recordSession(session.user.id, currentToken, ip, userAgent).catch(() => {});
    }

    const sessions = await getUserActiveSessions(session.user.id, currentToken);
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Get user sessions error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب الجلسات النشطة" }, { status: 500 });
  }
}
