import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";

/**
 * Verifies a link's PIN code server-side without exposing the raw PIN in public HTML.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const linkId = typeof body.linkId === "string" ? body.linkId.trim() : "";
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";

    if (!linkId) {
      return NextResponse.json({ success: false, error: "معرّف الرابط مطلوب" }, { status: 400 });
    }

    const limited = enforceRateLimit(
      request,
      `verify_pin:${linkId}`,
      { maxAttempts: 10, windowMs: 5 * 60 * 1000 }
    );
    if (limited) return limited;

    const link = await prisma.link.findUnique({
      where: { id: linkId },
      select: { id: true, pinCode: true, isActive: true, isArchived: true },
    });

    if (!link || !link.isActive || link.isArchived) {
      return NextResponse.json({ success: false, error: "الرابط غير متاح" }, { status: 404 });
    }

    if (link.pinCode && link.pinCode !== pin) {
      return NextResponse.json(
        { success: false, error: "رمز الدخول (PIN) غير صحيح" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      redirectUrl: link.pinCode
        ? `/go/${link.id}?pin=${encodeURIComponent(pin)}`
        : `/go/${link.id}`,
    });
  } catch (error) {
    console.error("Verify link PIN error:", error);
    return NextResponse.json(
      { success: false, error: "تعذر التحقق من رمز الرابط" },
      { status: 500 }
    );
  }
}
