import { prisma } from "@/shared/db";
import { ProfileMetadataInput } from "../types/bio.types";
import { isLinkWithinSchedule } from "../utils/link-schedule";

export function generateProfileMetadata(input: ProfileMetadataInput) {
  const title = `${input.displayName} (@${input.username}) | AN LINKS`;
  const description = input.bio || `صفحة الروابط الرسمية لـ ${input.displayName}`;
  const images = input.avatarUrl ? [input.avatarUrl] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images,
    },
  };
}

export function filterActiveLinks<T extends { isActive: boolean; position: number }>(links: T[]): T[] {
  return links
    .filter((link) => link.isActive)
    .sort((a, b) => a.position - b.position);
}

export async function getPublicProfileData(username: string) {
  const cleanUsername = username.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    include: {
      profile: true,
      links: {
        where: { isActive: true, isArchived: false },
        orderBy: { position: "asc" },
      },
      socials: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!user || user.isSuspended || !user.profile || !user.profile.isPublished) {
    return null;
  }

  const now = new Date();
  const visibleLinks = user.links
    .filter((l) => isLinkWithinSchedule(l, now))
    .map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      type: l.type,
      isActive: l.isActive,
      position: l.position,
      icon: l.icon,
      thumbnailUrl: l.thumbnailUrl,
      customBgColor: l.customBgColor,
      customTextColor: l.customTextColor,
      customBorderColor: l.customBorderColor,
      customShadow: l.customShadow,
      hasPin: Boolean(l.pinCode),
      isSensitive: Boolean(l.isSensitive),
    }));

  const [products, services] = await Promise.all([
    prisma.digitalProduct.findMany({
      where: { creatorId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        productType: true,
        salesCount: true,
      },
    }),
    prisma.consultationService.findMany({
      where: { creatorId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        durationMinutes: true,
        price: true,
        currency: true,
        isActive: true,
      },
    }),
  ]);

  return {
    user: {
      id: user.id,
      username: user.username,
    },
    profile: user.profile,
    links: visibleLinks,
    socials: user.socials,
    products,
    services,
  };
}

export async function getPublicProfileByDomain(domain: string) {
  const cleanDomain = domain.toLowerCase().trim();

  const profile = await prisma.profile.findFirst({
    where: {
      customDomain: cleanDomain,
      domainVerified: true,
      isPublished: true,
      user: { isSuspended: false },
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!profile || !profile.user) {
    return null;
  }

  return getPublicProfileData(profile.user.username);
}


