import { NextRequest, NextResponse } from "next/server";
import { validateAndProcessImage } from "@/lib/image-processor";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
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

    // Save to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filename = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, result.buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء رفع الصورة" },
      { status: 500 }
    );
  }
}
