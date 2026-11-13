import sharp from "sharp";

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
export const MAX_DIMENSION = 4000; // 4000px max input dimension
export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export interface ProcessImageResult {
  valid: boolean;
  buffer?: Buffer;
  error?: string;
}

export async function validateAndProcessImage(
  buffer: Buffer,
  mimeType: string
): Promise<ProcessImageResult> {
  // 1. Check MIME type
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      valid: false,
      error: "نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو WebP",
    };
  }

  // 2. Check File Size
  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "الحد الأقصى لحجم الصورة هو 2 ميغابايت",
    };
  }

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // 3. Decompression bomb check: inspect pixel dimensions
    if (
      (metadata.width && metadata.width > MAX_DIMENSION) ||
      (metadata.height && metadata.height > MAX_DIMENSION)
    ) {
      return {
        valid: false,
        error: "أبعاد الصورة تتجاوز الحد الأقصى المسموح (4000×4000)",
      };
    }

    // 4. Resize avatar to 512x512, strip EXIF metadata (default in sharp), convert to optimized WebP
    const processedBuffer = await sharp(buffer)
      .resize(512, 512, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 85 })
      .toBuffer();

    return {
      valid: true,
      buffer: processedBuffer,
    };
  } catch (err) {
    return {
      valid: false,
      error: "فشلت معالجة الصورة. يرجى التأكد من سلامة الملف",
    };
  }
}
