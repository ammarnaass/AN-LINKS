import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/server/auth.options";
import { prisma } from "@/shared/db";
import { sanitizeUrl } from "@/shared/utils/url-sanitizer";

/**
 * Lists and creates Digital Products / Tip Jar items for the authenticated creator.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const products = await prisma.digitalProduct.findMany({
      where: { creatorId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب المنتجات الرقمية" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : null;
    const price = Number(body.price);
    const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "SAR";
    const productType = body.productType === "TIP" ? "TIP" : "DIGITAL";
    const rawFileUrl = typeof body.fileUrl === "string" ? body.fileUrl.trim() : "";

    if (!title || title.length < 2) {
      return NextResponse.json({ success: false, error: "اسم المنتج أو الدعم مطلوب" }, { status: 400 });
    }

    if (!Number.isFinite(price) || price <= 0 || price > 100000) {
      return NextResponse.json({ success: false, error: "يرجى إدخال سعر صالح أكبر من 0" }, { status: 400 });
    }

    let cleanFileUrl: string | null = null;
    if (productType === "DIGITAL" && rawFileUrl) {
      const check = sanitizeUrl(rawFileUrl);
      if (!check.valid || !check.normalizedUrl) {
        return NextResponse.json({ success: false, error: check.error || "رابط الملف غير صالح" }, { status: 400 });
      }
      cleanFileUrl = check.normalizedUrl;
    }

    const product = await prisma.digitalProduct.create({
      data: {
        creatorId: session.user.id,
        title,
        description,
        price: Number(price.toFixed(2)),
        currency,
        productType,
        fileUrl: cleanFileUrl,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create digital product error:", error);
    return NextResponse.json(
      { success: false, error: "فشل إنشاء المنتج الرقمي" },
      { status: 500 }
    );
  }
}
