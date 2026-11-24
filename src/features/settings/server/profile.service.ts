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
          avatarUrl: true,
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
    avatarUrl: user.profile?.avatarUrl ?? null,
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
      },
      update: {
        displayName: input.displayName.trim(),
        bio: input.bio?.trim() ?? null,
        phone: input.phone?.trim() ?? null,
      },
    });

    return {
      email: updatedUser.email,
      username: updatedUser.username,
      displayName: updatedProfile.displayName,
      bio: updatedProfile.bio,
      phone: updatedProfile.phone,
    };
  });
}
