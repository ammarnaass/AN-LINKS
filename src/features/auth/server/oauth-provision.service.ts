import { prisma } from "@/shared/db";

export interface ProvisionedOAuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  name: string;
  image?: string | null;
}

function sanitizeUsernameBase(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 16);
  return cleaned.length >= 3 ? cleaned : `creator_${cleaned || "user"}`;
}

async function generateUniqueUsername(email: string): Promise<string> {
  const localPart = email.split("@")[0] || "creator";
  const base = sanitizeUsernameBase(localPart);

  const existing = await prisma.user.findUnique({
    where: { username: base },
    select: { id: true },
  });
  if (!existing) return base;

  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base.slice(0, 14)}_${suffix}`;
}

/**
 * Finds or provisions a local User and Profile record for verified OAuth logins (e.g. Google).
 * Returns null if the account is suspended or missing an email address.
 */
export async function provisionOAuthUser(
  email?: string | null,
  name?: string | null,
  image?: string | null
): Promise<ProvisionedOAuthUser | null> {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: cleanEmail },
    include: { profile: true },
  });

  if (existing) {
    if (existing.isSuspended) return null;
    return {
      id: existing.id,
      email: existing.email,
      username: existing.username,
      role: existing.role,
      name: existing.profile?.displayName ?? existing.username,
      image: existing.profile?.avatarUrl ?? image,
    };
  }

  const username = await generateUniqueUsername(cleanEmail);
  const displayName = (name && name.trim()) || username;

  const created = await prisma.user.create({
    data: {
      email: cleanEmail,
      username,
      role: "USER",
      emailVerified: new Date(),
      profile: {
        create: {
          displayName,
          avatarUrl: image || null,
          themeKey: "layanDark",
          isPublished: true,
        },
      },
    },
    include: { profile: true },
  });

  return {
    id: created.id,
    email: created.email,
    username: created.username,
    role: created.role,
    name: created.profile?.displayName ?? created.username,
    image: created.profile?.avatarUrl,
  };
}
