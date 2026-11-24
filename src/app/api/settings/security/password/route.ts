import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { changePassword } from "@/features/settings/server/security.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    const ua = req.headers.get("user-agent") || undefined;

    const result = await changePassword(
      session.user.id,
      currentPassword,
      newPassword,
      confirmPassword,
      ip,
      ua
    );

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تغيير كلمة المرور";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
