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
  const [ordersAgg, bookings, userSub, requests, affiliateAgg] = await Promise.all([
    prisma.digitalOrder.aggregate({
      where: { creatorId: userId, status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.appointmentBooking.findMany({
      where: { creatorId: userId, status: { in: ["CONFIRMED", "COMPLETED"] } },
      select: {
        amountPaid: true,
        creatorNetAmount: true,
        service: { select: { price: true } },
      },
    }),
    prisma.userSubscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { plan: { include: { quotas: true } } },
    }),
    prisma.payoutRequest.findMany({
      where: { userId, status: { in: ["PENDING", "APPROVED", "TRANSFERRED"] } },
      select: { amount: true, status: true },
    }),
    prisma.affiliateCommissionLog.aggregate({
      where: { referrerId: userId, status: "CLEARED" },
      _sum: { commissionAmount: true },
    }),
  ]);

  const ordersGross = ordersAgg._sum?.amount ?? 0;
  const commissionRate = userSub?.plan?.quotas?.storeCommissionRate ?? 5.0;
  const bookingsGross = bookings.reduce((sum, b) => {
    const gross = b.amountPaid > 0 ? b.amountPaid : (b.service?.price ?? 0);
    return sum + gross;
  }, 0);
  const bookingsNet = bookings.reduce((sum, b) => {
    if (b.amountPaid > 0 || b.creatorNetAmount > 0) return sum + b.creatorNetAmount;
    return sum + (b.service?.price ?? 0) * (1 - commissionRate / 100);
  }, 0);
  const grossSales = ordersGross + bookingsGross;

  const netStoreEarnings = ordersGross * (1 - commissionRate / 100) + bookingsNet;
  const clearedAffiliateEarnings = affiliateAgg._sum?.commissionAmount ?? 0;
  const totalEarnings = netStoreEarnings + clearedAffiliateEarnings;

  const totalWithdrawn = requests
    .filter((r) => r.status === "TRANSFERRED")
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingWithdrawal = requests
    .filter((r) => r.status === "PENDING" || r.status === "APPROVED")
    .reduce((sum, r) => sum + r.amount, 0);

  const availableBalance = Math.max(0, totalEarnings - totalWithdrawn - pendingWithdrawal);

  return {
    grossSales: Math.round(grossSales * 100) / 100,
    storeNetEarnings: Math.round(netStoreEarnings * 100) / 100,
    affiliateEarnings: Math.round(clearedAffiliateEarnings * 100) / 100,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    commissionRate,
    totalWithdrawn: Math.round(totalWithdrawn * 100) / 100,
    pendingWithdrawal: Math.round(pendingWithdrawal * 100) / 100,
    availableBalance: Math.round(availableBalance * 100) / 100,
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
