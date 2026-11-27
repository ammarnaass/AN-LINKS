import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import {
  resolveMediaEntitlementSecret,
  verifyEntitlementToken,
} from "@/features/bio/services/gated-media.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { productId, token, orderId, email } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "معرف المحتوى مطلوب" }, { status: 400 });
    }

    const product = await prisma.digitalProduct.findUnique({
      where: { id: productId },
      select: { id: true, title: true, fileUrl: true, productType: true, price: true, currency: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "المحتوى غير موجود" }, { status: 404 });
    }

    const secret = resolveMediaEntitlementSecret();

    if (token) {
      const verified = verifyEntitlementToken(token, secret);
      if (verified.valid && verified.productId === productId) {
        return NextResponse.json({
          success: true,
          unlocked: true,
          title: product.title,
          mediaUrl: product.fileUrl,
        });
      }
    }

    if (orderId && email) {
      const order = await prisma.digitalOrder.findFirst({
        where: {
          id: orderId,
          productId,
          buyerEmail: String(email).toLowerCase().trim(),
          status: "PAID",
          ...(process.env.NODE_ENV === "production" ? { isSandbox: false } : {}),
        },
      });

      if (order) {
        return NextResponse.json({
          success: true,
          unlocked: true,
          title: product.title,
          mediaUrl: product.fileUrl,
        });
      }
    }

    return NextResponse.json(
      { success: false, unlocked: false, error: "رمز الوصول غير صالح أو منتهي الصلاحية" },
      { status: 403 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "خطأ أثناء فك قفل المحتوى";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
