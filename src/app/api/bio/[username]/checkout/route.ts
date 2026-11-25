import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";

interface RouteParams {
  params: Promise<{ username: string }>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Processes a digital product purchase or Tip Jar contribution from a creator's Bio page
 * and issues immediate download delivery for digital assets.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const limited = enforceRateLimit(request, "bio_checkout", {
      maxAttempts: 15,
      windowMs: 10 * 60 * 1000,
    });
    if (limited) return limited;

    const { username } = await params;
    const body = await request.json().catch(() => ({}));
    const productId = typeof body.productId === "string" ? body.productId.trim() : "";
    const buyerEmail = typeof body.buyerEmail === "string" ? body.buyerEmail.trim().toLowerCase() : "";

    if (!productId || !buyerEmail || !EMAIL_REGEX.test(buyerEmail)) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال بريد إلكتروني صحيح لإتمام الطلب" },
        { status: 400 }
      );
    }

    const creator = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      select: { id: true, isSuspended: true },
    });
    if (!creator || creator.isSuspended) {
      return NextResponse.json({ success: false, error: "الحساب غير متاح" }, { status: 404 });
    }

    const product = await prisma.digitalProduct.findFirst({
      where: { id: productId, creatorId: creator.id, isActive: true },
    });
    if (!product) {
      return NextResponse.json({ success: false, error: "المنتج غير متاح حالياً" }, { status: 404 });
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.digitalOrder.create({
        data: {
          productId: product.id,
          creatorId: creator.id,
          buyerEmail,
          amount: product.price,
          currency: product.currency,
          status: "PAID",
          deliveryUrl: product.fileUrl,
        },
      });
      await tx.digitalProduct.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      });
      return created;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      deliveryUrl: order.deliveryUrl,
      message:
        product.productType === "TIP"
          ? "شكراً لدعمك الكريم! تم تسجيل مساهمتك بنجاح ❤️"
          : "تمت عملية الشراء بنجاح! يمكنك تحميل منتجك الآن 🎉",
    });
  } catch (error) {
    console.error("Digital checkout error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إتمام العملية" },
      { status: 500 }
    );
  }
}
