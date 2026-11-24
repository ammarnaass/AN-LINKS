import { prisma } from "@/shared/db";
import {
  ProfileSettingsInput,
  validateSettingsProfile,
} from "../validators/settings.validator";

export async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      profile: {
        select: {
          displayName: true,
          bio: true,
          phone: true,
          location: true,
          avatarUrl: true,
          metaPixelId: true,
          tiktokPixelId: true,
          googleAnalyticsId: true,
          snapchatPixelId: true,
        },
      },
    },
  });

  if (!user) throw new Error("المستخدم غير موجود");

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    displayName: user.profile?.displayName ?? "",
    bio: user.profile?.bio ?? "",
    phone: user.profile?.phone ?? "",
    location: user.profile?.location ?? "",
    avatarUrl: user.profile?.avatarUrl ?? null,
    metaPixelId: user.profile?.metaPixelId ?? null,
    tiktokPixelId: user.profile?.tiktokPixelId ?? null,
    googleAnalyticsId: user.profile?.googleAnalyticsId ?? null,
    snapchatPixelId: user.profile?.snapchatPixelId ?? null,
  };
}

export async function updateProfileData(
  userId: string,
  input: ProfileSettingsInput
) {
  const validation = validateSettingsProfile(input);
  if (!validation.valid) {
    throw new Error(validation.error || "بيانات الملف الشخصي غير صالحة");
  }

  const existingEmail = await prisma.user.findFirst({
    where: { email: input.email.toLowerCase().trim(), NOT: { id: userId } },
    select: { id: true },
  });
  if (existingEmail) {
    throw new Error("البريد الإلكتروني مستخدم بالفعل من قبل حساب آخر");
  }

  const existingUsername = await prisma.user.findFirst({
    where: { username: input.username.toLowerCase().trim(), NOT: { id: userId } },
    select: { id: true },
  });
  if (existingUsername) {
    throw new Error("اسم المستخدم محجوز لحساب آخر");
  }

  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        email: input.email.toLowerCase().trim(),
        username: input.username.toLowerCase().trim(),
      },
    });

    const updatedProfile = await tx.profile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: input.displayName.trim(),
        bio: input.bio?.trim() ?? null,
        phone: input.phone?.trim() ?? null,
        location: input.location?.trim() ?? null,
        metaPixelId: input.metaPixelId?.trim() || null,
        tiktokPixelId: input.tiktokPixelId?.trim() || null,
        googleAnalyticsId: input.googleAnalyticsId?.trim() || null,
        snapchatPixelId: input.snapchatPixelId?.trim() || null,
      },
      update: {
        displayName: input.displayName.trim(),
        bio: input.bio?.trim() ?? null,
        phone: input.phone?.trim() ?? null,
        location: input.location?.trim() ?? null,
        metaPixelId: input.metaPixelId?.trim() || null,
        tiktokPixelId: input.tiktokPixelId?.trim() || null,
        googleAnalyticsId: input.googleAnalyticsId?.trim() || null,
        snapchatPixelId: input.snapchatPixelId?.trim() || null,
      },
    });

    return {
      email: updatedUser.email,
      username: updatedUser.username,
      displayName: updatedProfile.displayName,
      bio: updatedProfile.bio,
      phone: updatedProfile.phone,
      location: updatedProfile.location,
      metaPixelId: updatedProfile.metaPixelId,
      tiktokPixelId: updatedProfile.tiktokPixelId,
      googleAnalyticsId: updatedProfile.googleAnalyticsId,
      snapchatPixelId: updatedProfile.snapchatPixelId,
    };
  });
}
