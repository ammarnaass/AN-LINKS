import prisma from "./prisma";

export interface ProfileMetadataInput {
  displayName: string;
  bio?: string | null;
  username: string;
  avatarUrl?: string | null;
}

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
        where: { isActive: true },
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

  return {
    user: {
      id: user.id,
      username: user.username,
    },
    profile: user.profile,
    links: user.links,
    socials: user.socials,
  };
}

