import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/features/auth/services/password-reset.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال بريد إلكتروني صالح" },
        { status: 400 }
      );
    }

    const result = await createPasswordResetToken(email);

    return NextResponse.json(
      {
        success: true,
        message: "إذا كان هذا البريد مسجلاً لدينا، فستصلك تعليمات استعادة كلمة المرور خلال لحظات.",
        // Include resetToken in dev/test environment for easy previewing
        resetToken: process.env.NODE_ENV !== "production" ? result.token : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
