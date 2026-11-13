import { describe, it, expect } from "vitest";
import { validateAndProcessImage } from "@/lib/image-processor";
import sharp from "sharp";

describe("Image Upload Security & Sharp Processing", () => {
  it("should process and optimize a valid PNG image to WebP with stripped metadata", async () => {
    // Create a 200x200 sample image
    const sampleBuffer = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 59, g: 130, b: 246 },
      },
    })
      .png()
      .toBuffer();

    const result = await validateAndProcessImage(sampleBuffer, "image/png");

    expect(result.valid).toBe(true);
    expect(result.buffer).toBeDefined();

    // Verify output format is webp
    const meta = await sharp(result.buffer!).metadata();
    expect(meta.format).toBe("webp");
    expect(meta.width).toBeLessThanOrEqual(512);
    expect(meta.height).toBeLessThanOrEqual(512);
    // EXIF should be stripped (undefined)
    expect(meta.exif).toBeUndefined();
  });

  it("should reject files larger than 2MB", async () => {
    const fakeLargeBuffer = Buffer.alloc(2.5 * 1024 * 1024); // 2.5 MB

    const result = await validateAndProcessImage(fakeLargeBuffer, "image/jpeg");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("الحد الأقصى لحجم الصورة هو 2 ميغابايت");
  });

  it("should reject non-image MIME types", async () => {
    const textBuffer = Buffer.from("Hello world, this is a script!");

    const result = await validateAndProcessImage(textBuffer, "text/plain");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("نوع الملف غير مدعوم");
  });

  it("should reject decompression bomb images exceeding 4000x4000 px dimensions", async () => {
    // Sharp metadata check before decompressing
    const hugeBuffer = await sharp({
      create: {
        width: 4500,
        height: 4500,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const result = await validateAndProcessImage(hugeBuffer, "image/png");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("أبعاد الصورة تتجاوز الحد الأقصى المسموح (4000×4000)");
  });
});

