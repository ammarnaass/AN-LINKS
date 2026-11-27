import { NextRequest, NextResponse } from "next/server";
import { verifyAndResetPassword } from "@/features/auth/services/password-reset.service";
import { enforceRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, "reset_password", {
      maxAttempts: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (limited) return limited;

    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "رمز الاستعادة وكلمة المرور الجديدة مطلوبان" },
        { status: 400 }
      );
    }

    const result = await verifyAndResetPassword(token, newPassword);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل تعيين كلمة المرور" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
