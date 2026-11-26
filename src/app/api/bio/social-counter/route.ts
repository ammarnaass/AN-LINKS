import { NextRequest, NextResponse } from "next/server";
import {
  fetchSocialCounter,
  SupportedSocialPlatform,
} from "@/features/bio/services/social-counter.service";

const VALID_PLATFORMS = new Set<SupportedSocialPlatform>([
  "youtube",
  "github",
  "twitter",
  "x",
  "tiktok",
  "instagram",
]);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform")?.toLowerCase() as SupportedSocialPlatform;
    const handle = searchParams.get("handle");

    if (!platform || !VALID_PLATFORMS.has(platform)) {
      return NextResponse.json(
        {
          success: false,
          error: "منصة غير مدعومة. المنصات المدعومة: youtube, github, twitter, x, tiktok, instagram",
        },
        { status: 400 }
      );
    }

    if (!handle || handle.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "اسم الحساب (handle) مطلوب" },
        { status: 400 }
      );
    }

    const result = await fetchSocialCounter(platform, handle);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل جلب عداد المنصة";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
