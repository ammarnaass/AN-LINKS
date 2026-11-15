import { prisma } from "@/shared/db";
import { PlatformCategory, Prisma } from "@prisma/client";
import { PlatformDTO } from "@/features/links/types/links.types";
import {
  PlatformUpsertInput,
  AdminLinksQuery,
  AdminLinksResponse,
  AdminPlatformAnalyticsResponse,
} from "@/features/admin/types/admin.types";

export async function getAdminPlatforms(): Promise<PlatformDTO[]> {
  const platforms = await prisma.platform.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { links: true, clicks: true } } },
  });

  return platforms.map((p) => ({
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
    _count: { links: p._count.links, clicks: p._count.clicks },
  }));
}

export async function createPlatform(input: PlatformUpsertInput) {
  const cleanSlug = input.slug.trim().toLowerCase();
  const existing = await prisma.platform.findUnique({ where: { slug: cleanSlug } });
  if (existing) throw new Error("رمز المنصة (Slug) مستخدم بالفعل");

  return prisma.platform.create({
    data: {
      slug: cleanSlug,
      nameAr: input.nameAr.trim(),
      nameEn: input.nameEn.trim(),
      category: input.category as PlatformCategory,
      defaultIcon: input.defaultIcon.trim(),
      brandColor: input.brandColor.trim(),
      domainPattern: input.domainPattern.trim(),
      urlPlaceholder: input.urlPlaceholder.trim(),
      isEnabled: input.isEnabled !== undefined ? input.isEnabled : true,
      sortOrder: input.sortOrder !== undefined ? input.sortOrder : 0,
    },
  });
}

export async function updatePlatform(id: string, input: Partial<PlatformUpsertInput>) {
  return prisma.platform.update({
    where: { id },
    data: {
      ...(input.slug ? { slug: input.slug.trim().toLowerCase() } : {}),
      ...(input.nameAr ? { nameAr: input.nameAr.trim() } : {}),
      ...(input.nameEn ? { nameEn: input.nameEn.trim() } : {}),
      ...(input.category ? { category: input.category as PlatformCategory } : {}),
      ...(input.defaultIcon ? { defaultIcon: input.defaultIcon.trim() } : {}),
      ...(input.brandColor ? { brandColor: input.brandColor.trim() } : {}),
      ...(input.domainPattern !== undefined ? { domainPattern: input.domainPattern.trim() } : {}),
      ...(input.urlPlaceholder !== undefined ? { urlPlaceholder: input.urlPlaceholder.trim() } : {}),
      ...(input.isEnabled !== undefined ? { isEnabled: input.isEnabled } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
  });
}

export async function deletePlatform(id: string) {
  return prisma.platform.delete({ where: { id } });
}

function buildAdminLinksWhere(query: AdminLinksQuery): Prisma.LinkWhereInput {
  const where: Prisma.LinkWhereInput = {};
  if (query.platformId && query.platformId !== "all") where.platformId = query.platformId;
  if (query.status === "active") {
    where.isActive = true;
    where.isArchived = false;
  } else if (query.status === "inactive") {
    where.isActive = false;
  } else if (query.status === "pinned") {
    where.isPinned = true;
  } else if (query.status === "archived") {
    where.isArchived = true;
  }

  if (query.search?.trim()) {
    const s = query.search.trim();
    where.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { url: { contains: s, mode: "insensitive" } },
      { user: { username: { contains: s, mode: "insensitive" } } },
      { user: { email: { contains: s, mode: "insensitive" } } },
      { user: { profile: { displayName: { contains: s, mode: "insensitive" } } } },
    ];
  }
  return where;
}

export async function getAdminLinks(query: AdminLinksQuery = {}): Promise<AdminLinksResponse> {
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 20));
  const skip = (page - 1) * limit;
  const where = buildAdminLinksWhere(query);

  const [total, links] = await Promise.all([
    prisma.link.count({ where }),
    prisma.link.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
      include: {
        user: { select: { id: true, email: true, username: true, profile: { select: { displayName: true } } } },
        platform: { select: { id: true, slug: true, nameAr: true, nameEn: true, brandColor: true } },
      },
    }),
  ]);

  return {
    items: links.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      clicksCount: l.clicksCount,
      isActive: l.isActive,
      isPinned: l.isPinned,
      isArchived: l.isArchived,
      user: {
        id: l.user.id,
        name: l.user.profile?.displayName || null,
        email: l.user.email,
        username: l.user.username,
      },
      platform: l.platform,
      createdAt: l.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function updateAdminLink(
  id: string,
  input: { isActive?: boolean; isPinned?: boolean; isArchived?: boolean }
) {
  return prisma.link.update({
    where: { id },
    data: {
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.isPinned !== undefined ? { isPinned: input.isPinned } : {}),
      ...(input.isArchived !== undefined ? { isArchived: input.isArchived } : {}),
    },
  });
}

export async function getAdminPlatformAnalytics(): Promise<AdminPlatformAnalyticsResponse> {
  const [totalLinks, linkClickCount, sumClicks, activePlatformsCount, platforms, deviceGroups, countryGroups, topLinks] =
    await Promise.all([
      prisma.link.count(),
      prisma.linkClick.count(),
      prisma.link.aggregate({ _sum: { clicksCount: true } }),
      prisma.platform.count({ where: { isEnabled: true } }),
      prisma.platform.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { links: true, clicks: true } } },
      }),
      prisma.linkClick.groupBy({ by: ["device"], _count: { _all: true } }),
      prisma.linkClick.groupBy({ by: ["country"], _count: { _all: true }, orderBy: { _count: { country: "desc" } }, take: 10 }),
      prisma.link.findMany({
        where: { isActive: true },
        orderBy: { clicksCount: "desc" },
        take: 10,
        include: { user: { select: { username: true, profile: { select: { displayName: true } } } } },
      }),
    ]);

  const totalClicks = Math.max(linkClickCount, sumClicks._sum.clicksCount || 0);
  const totalDeviceClicks = deviceGroups.reduce((acc, curr) => acc + curr._count._all, 0);
  const totalCountryClicks = countryGroups.reduce((acc, curr) => acc + curr._count._all, 0);

  return {
    totalLinks,
    totalClicks,
    activePlatformsCount,
    platformBreakdown: platforms.map((p) => ({
      slug: p.slug,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      brandColor: p.brandColor,
      clicks: p._count.clicks,
      linksCount: p._count.links,
    })),
    deviceBreakdown: deviceGroups.map((g) => ({
      device: g.device || "UNKNOWN",
      count: g._count._all,
      percentage: totalDeviceClicks > 0 ? Math.round((g._count._all / totalDeviceClicks) * 1000) / 10 : 0,
    })),
    countryBreakdown: countryGroups.map((g) => ({
      country: g.country || "UNKNOWN",
      count: g._count._all,
      percentage: totalCountryClicks > 0 ? Math.round((g._count._all / totalCountryClicks) * 1000) / 10 : 0,
    })),
    topLinks: topLinks.map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      clicksCount: l.clicksCount,
      username: l.user.profile?.displayName || l.user.username || "مستخدم",
    })),
  };
}
