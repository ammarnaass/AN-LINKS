import { NextResponse } from "next/server";
import { prisma } from "@/shared/db";
import { PlatformDTO } from "@/features/links/types/links.types";

export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      where: { isEnabled: true },
      orderBy: { sortOrder: "asc" },
    });

    const mapped: PlatformDTO[] = platforms.map((p) => ({
      id: p.id,
      slug: p.slug,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      category: p.category,
      defaultIcon: p.defaultIcon,
      brandColor: p.brandColor,
      domainPattern: p.domainPattern,
      urlPlaceholder: p.urlPlaceholder,
      isEnabled: p.isEnabled,
      isVerified: p.isVerified,
      sortOrder: p.sortOrder,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, platforms: mapped });
  } catch (error) {
    console.error("Public platforms fetch error:", error);
    return NextResponse.json({ success: false, error: "فشل جلب المنصات" }, { status: 500 });
  }
}

