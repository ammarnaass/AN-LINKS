import { prisma } from "@/shared/db";
import { validateSaudiIban } from "../validators/settings.validator";

export async function getPayoutProfile(userId: string) {
  const profile = await prisma.creatorPayoutProfile.findUnique({
    where: { userId },
  });
  return profile;
}

export async function updatePayoutProfile(
  userId: string,
  iban: string,
  beneficiaryName: string
) {
  const validation = validateSaudiIban(iban);
  if (!validation.valid || !validation.bank || !validation.cleanIban) {
    throw new Error(validation.error || "رقم الآيبان غير صالح");
  }

  if (!beneficiaryName || beneficiaryName.trim().length < 3) {
    throw new Error("اسم المستفيد الثلاثي مطلوب");
  }

  return prisma.creatorPayoutProfile.upsert({
    where: { userId },
    create: {
      userId,
      bankName: validation.bank.nameAr,
      bankCode: validation.bank.code,
      iban: validation.cleanIban,
      beneficiaryName: beneficiaryName.trim(),
      isVerified: true,
    },
    update: {
      bankName: validation.bank.nameAr,
      bankCode: validation.bank.code,
      iban: validation.cleanIban,
      beneficiaryName: beneficiaryName.trim(),
      isVerified: true,
    },
  });
}

export async function getPayoutBalance(userId: string) {
  const requests = await prisma.payoutRequest.findMany({
    where: { userId, status: { in: ["PENDING", "APPROVED", "TRANSFERRED"] } },
    select: { amount: true, status: true },
  });

  const totalWithdrawn = requests
    .filter((r) => r.status === "TRANSFERRED")
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingWithdrawal = requests
    .filter((r) => r.status === "PENDING" || r.status === "APPROVED")
    .reduce((sum, r) => sum + r.amount, 0);

  // Default baseline creator balance for demo/staging
  const baseEarnings = 1850.0;
  const availableBalance = Math.max(0, baseEarnings - totalWithdrawn - pendingWithdrawal);

  return {
    totalEarnings: baseEarnings,
    totalWithdrawn,
    pendingWithdrawal,
    availableBalance,
    currency: "SAR",
    minWithdrawal: 50.0,
  };
}

export async function requestPayout(userId: string, amount: number) {
  if (!amount || amount < 50) {
    throw new Error("الحد الأدنى لطلب السحب هو 50 ريال سعودي");
  }

  const profile = await prisma.creatorPayoutProfile.findUnique({ where: { userId } });
  if (!profile || !profile.isVerified) {
    throw new Error("يرجى ربط وتأكيد الحساب البنكي والآيبان قبل طلب السحب");
  }

  const balance = await getPayoutBalance(userId);
  if (amount > balance.availableBalance) {
    throw new Error("الرصيد المتاح غير كافٍ لإتمام عملية السحب");
  }

  return prisma.payoutRequest.create({
    data: {
      userId,
      amount,
      currency: "SAR",
      status: "PENDING",
    },
  });
}

export async function getPayoutHistory(userId: string, limit = 10) {
  return prisma.payoutRequest.findMany({
    where: { userId },
    orderBy: { requestedAt: "desc" },
    take: limit,
  });
}
