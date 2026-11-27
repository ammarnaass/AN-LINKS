import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { enforceRateLimit } from "@/lib/rate-limiter";
import { enqueueWebhookEvent } from "@/features/webhooks";
import {
  createEntitlementToken,
  resolveMediaEntitlementSecret,
} from "@/features/bio/services/gated-media.service";

interface RouteParams {
  params: Promise<{ username: string }>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Processes a digital product purchase, Tip Jar contribution, or locked media unlock
 * from a creator's Bio page with gateway validation and sandbox isolation.
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
    const gatewayCodeInput = typeof body.gatewayCode === "string" ? body.gatewayCode.trim() : "";

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

    let resolvedGatewayCode = "free";
    let isSandboxOrder = false;

    if (product.price > 0) {
      const gateway = await prisma.paymentGateway.findFirst({
        where: {
          ...(gatewayCodeInput ? { code: gatewayCodeInput } : {}),
          isEnabled: true,
          supportedCurrencies: { has: product.currency },
        },
        orderBy: { sortOrder: "asc" },
      });

      if (!gateway) {
        return NextResponse.json(
          { success: false, error: "لا توجد بوابة دفع مفعلة لهذه العملة حالياً" },
          { status: 400 }
        );
      }

      if (!gateway.isTestMode) {
        return NextResponse.json(
          { success: false, error: "تتطلب بوابات الدفع الحية إتمام المصادقة عبر مزود الدفع الخارجي" },
          { status: 402 }
        );
      }

      resolvedGatewayCode = gateway.code;
      isSandboxOrder = true;
    }

    const isGatedMedia = product.productType === "LOCKED_MEDIA";
    const entitlementToken = isGatedMedia
      ? createEntitlementToken(product.id, buyerEmail, resolveMediaEntitlementSecret())
      : null;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.digitalOrder.create({
        data: {
          productId: product.id,
          creatorId: creator.id,
          buyerEmail,
          amount: product.price,
          currency: product.currency,
          status: "PAID",
          gatewayCode: resolvedGatewayCode,
          isSandbox: isSandboxOrder,
          deliveryUrl: isGatedMedia ? null : product.fileUrl,
        },
      });
      await tx.digitalProduct.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      });
      return created;
    });

    void enqueueWebhookEvent({
      creatorId: creator.id,
      event: "order.completed",
      payload: {
        orderId: order.id,
        productId: product.id,
        productTitle: product.title,
        productType: product.productType,
        buyerEmail,
        amount: product.price,
        currency: product.currency,
        gatewayCode: resolvedGatewayCode,
        isSandbox: isSandboxOrder,
        createdAt: order.createdAt,
      },
    }).catch((err) => console.error("Webhook order.completed failed:", err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      isSandbox: isSandboxOrder,
      gatewayCode: resolvedGatewayCode,
      entitlementToken,
      deliveryUrl: isGatedMedia ? null : order.deliveryUrl,
      message:
        product.productType === "TIP"
          ? "شكراً لدعمك الكريم! تم تسجيل مساهمتك بنجاح ❤️"
          : isGatedMedia
            ? "تم فتح قفل المحتوى الحصري بنجاح 🎉"
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
