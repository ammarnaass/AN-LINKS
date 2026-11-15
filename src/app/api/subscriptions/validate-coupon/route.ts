import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";

interface ValidateCouponBody {
  code?: string;
  planSlug?: string;
  amount?: number;
}

export async function POST(request: NextRequest) {
  try {
    let body: ValidateCouponBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, valid: false, error: "صيغة الطلب غير صحيحة" },
        { status: 400 }
      );
    }

    const rawCode = body?.code;
    if (!rawCode || typeof rawCode !== "string" || !rawCode.trim()) {
      return NextResponse.json(
        { success: false, valid: false, error: "رمز الكوبون مطلوب" },
        { status: 400 }
      );
    }

    const code = rawCode.trim().toUpperCase();

    // Query coupon
    const coupon = await prisma.promotionCoupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, valid: false, error: "الكوبون غير موجود أو غير صالح" },
        { status: 400 }
      );
    }

    // Check if active
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, valid: false, error: "هذا الكوبون غير فعال حالياً" },
        { status: 400 }
      );
    }

    // Check dates
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return NextResponse.json(
        { success: false, valid: false, error: "هذا الكوبون لم يبدأ العمل به بعد" },
        { status: 400 }
      );
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json(
        { success: false, valid: false, error: "انتهت فترة صلاحية هذا الكوبون" },
        { status: 400 }
      );
    }

    // Check maximum uses
    if (
      coupon.maxUses !== null &&
      coupon.maxUses !== undefined &&
      coupon.usedCount >= coupon.maxUses
    ) {
      return NextResponse.json(
        { success: false, valid: false, error: "تم استنفاد الحد الأقصى لاستخدام هذا الكوبون" },
        { status: 400 }
      );
    }

    // Check allowed plans if planSlug is provided
    if (body.planSlug) {
      // Support both schema property (applicablePlanSlugs) and potential alias (allowedPlans)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allowedPlans = coupon.applicablePlanSlugs || (coupon as any).allowedPlans;
      if (Array.isArray(allowedPlans) && allowedPlans.length > 0) {
        const targetSlug = body.planSlug.trim().toLowerCase();
        const isAllowed = allowedPlans.some(
          (slug: string) => slug.trim().toLowerCase() === targetSlug
        );
        if (!isAllowed) {
          return NextResponse.json(
            { success: false, valid: false, error: "هذا الكوبون غير متاح للباقة المحددة" },
            { status: 400 }
          );
        }
      }
    }

    // Calculate discount
    let discountAmount = 0;
    let finalAmount = 0;

    if (typeof body.amount === "number" && !isNaN(body.amount)) {
      const baseAmount = Math.max(0, body.amount);
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (baseAmount * coupon.discountValue) / 100;
      } else {
        // FIXED_AMOUNT
        discountAmount = Math.min(coupon.discountValue, baseAmount);
      }
      discountAmount = Math.round(discountAmount * 100) / 100;
      finalAmount = Math.max(0, Math.round((baseAmount - discountAmount) * 100) / 100);
    }

    return NextResponse.json({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        error: "حدث خطأ أثناء التحقق من الكوبون",
      },
      { status: 500 }
    );
  }
}
