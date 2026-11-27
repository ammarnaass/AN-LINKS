import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { enforceRateLimit } from "@/lib/rate-limiter";
import {
  getTwoFactorStatus,
  setupTwoFactor,
  verifyAndEnableTwoFactor,
  disableTwoFactor,
} from "@/features/settings/server/two-factor.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const status = await getTwoFactorStatus(session.user.id);
    return NextResponse.json({ success: true, data: status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل جلب حالة التحقق الثنائي";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const limited = enforceRateLimit(req, `2fa:${session.user.id}`, {
      maxAttempts: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (limited) return limited;

    const body = await req.json();
    const { action, token, password } = body;
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined;
    const ua = req.headers.get("user-agent") || undefined;

    if (action === "setup") {
      const setupData = await setupTwoFactor(session.user.id);
      return NextResponse.json({ success: true, data: setupData });
    }

    if (action === "verify") {
      if (!token) throw new Error("رمز التحقق مطلوب");
      const result = await verifyAndEnableTwoFactor(session.user.id, token, ip, ua);
      return NextResponse.json(result);
    }

    if (action === "disable") {
      if (!password) throw new Error("كلمة المرور مطلوبة للتعطيل");
      const result = await disableTwoFactor(session.user.id, password, ip, ua);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تنفيذ إجراء المصادقة الثنائية";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
