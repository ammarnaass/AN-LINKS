import { prisma } from "@/shared/db";
import {
  AffiliateAttributionResult,
  SubscriptionCommissionInput,
  CreatorAffiliateSummary,
} from "../types/affiliate.types";

const DEFAULT_COMMISSION_RATE = 20.0; // 20% recurring creator commission
const ESCROW_DAYS = 30; // 30-day anti-chargeback safety hold

export async function recordReferralAttribution(
  referredUserId: string,
  rawCode: string
): Promise<AffiliateAttributionResult> {
  if (!rawCode || !referredUserId) {
    return { attributed: false, reason: "MISSING_INPUT" };
  }

  const cleanCode = rawCode.trim().toLowerCase();
  const referrer = await prisma.user.findFirst({
    where: {
      OR: [{ referralCode: cleanCode }, { username: cleanCode }],
      isSuspended: false,
    },
    select: { id: true },
  });

  if (!referrer) {
    return { attributed: false, reason: "REFERRER_NOT_FOUND" };
  }

  // Anti-self-referral prevention guard
  if (referrer.id === referredUserId) {
    return { attributed: false, reason: "SELF_REFERRAL_BLOCKED" };
  }

  await prisma.user.update({
    where: { id: referredUserId },
    data: { referredById: referrer.id },
  });

  return { attributed: true, referrerId: referrer.id };
}

export async function processSubscriptionCommission(input: SubscriptionCommissionInput) {
  const buyer = await prisma.user.findUnique({
    where: { id: input.buyerUserId },
    select: { referredById: true },
  });

  if (!buyer || !buyer.referredById) {
    return null; // Organic subscriber without referral
  }

  const commissionAmount = Math.round(
    input.invoiceAmount * (DEFAULT_COMMISSION_RATE / 100) * 100
  ) / 100;

  const now = new Date();
  const escrowUntil = new Date(now.getTime() + ESCROW_DAYS * 24 * 60 * 60 * 1000);

  return await prisma.affiliateCommissionLog.create({
    data: {
      referrerId: buyer.referredById,
      referredUserId: input.buyerUserId,
      subscriptionId: input.subscriptionId,
      invoiceId: input.invoiceId,
      planSlug: input.planSlug,
      invoiceAmount: input.invoiceAmount,
      commissionRate: DEFAULT_COMMISSION_RATE,
      commissionAmount,
      status: "ESCROW",
      escrowUntil,
    },
  });
}

export async function settleEscrowCommissions(): Promise<number> {
  const now = new Date();
  const result = await prisma.affiliateCommissionLog.updateMany({
    where: {
      status: "ESCROW",
      escrowUntil: { lte: now },
    },
    data: {
      status: "CLEARED",
      clearedAt: now,
    },
  });
  return result.count;
}

export async function getCreatorAffiliateSummary(userId: string): Promise<CreatorAffiliateSummary> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, referralCode: true },
  });

  const referralCode = user?.referralCode || user?.username || userId;
  const baseUrl = process.env.NEXTAUTH_URL || "https://anlinks.dev";
  const referralLink = `${baseUrl}/?ref=${referralCode}`;

  const [referralsCount, logs] = await Promise.all([
    prisma.user.count({ where: { referredById: userId } }),
    prisma.affiliateCommissionLog.findMany({
      where: { referrerId: userId },
      select: { commissionAmount: true, status: true },
    }),
  ]);

  let escrowBalance = 0;
  let clearedBalance = 0;
  let paidBalance = 0;

  for (const log of logs) {
    if (log.status === "ESCROW") escrowBalance += log.commissionAmount;
    if (log.status === "CLEARED") clearedBalance += log.commissionAmount;
    if (log.status === "PAID") paidBalance += log.commissionAmount;
  }

  return {
    referralCode,
    referralLink,
    totalReferrals: referralsCount,
    escrowBalance: Math.round(escrowBalance * 100) / 100,
    clearedBalance: Math.round(clearedBalance * 100) / 100,
    paidBalance: Math.round(paidBalance * 100) / 100,
    commissionRate: DEFAULT_COMMISSION_RATE,
  };
}
