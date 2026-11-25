import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { validateAndProcessImage } from "@/lib/image-processor";
import { uploadProcessedImage } from "@/lib/storage";
import { enforceRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول لرفع الصور" },
        { status: 401 }
      );
    }

    const limited = enforceRateLimit(
      request,
      "image_upload",
      { maxAttempts: 20, windowMs: 10 * 60 * 1000 },
      session.user.id
    );
    if (limited) return limited;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار أي ملف" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await validateAndProcessImage(buffer, file.type);
    if (!result.valid || !result.buffer) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل التحقق من الصورة" },
        { status: 400 }
      );
    }

    const filename = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const uploaded = await uploadProcessedImage(result.buffer, filename, "image/webp");

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      provider: uploaded.provider,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء رفع الصورة" },
      { status: 500 }
    );
  }
}

