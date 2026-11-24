import { prisma } from "@/shared/db";

/**
 * Updates or sets a user's location / residence from the Admin Console.
 */
export async function updateUserLocation(userId: string, location: string | null) {
  const sanitized = location?.trim() ? location.trim().slice(0, 120) : null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    return { ok: false, status: 404, error: "المستخدم غير موجود" };
  }

  const updatedProfile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      displayName: user.username,
      location: sanitized,
    },
    update: {
      location: sanitized,
    },
  });

  return { ok: true, status: 200, location: updatedProfile.location };
}
