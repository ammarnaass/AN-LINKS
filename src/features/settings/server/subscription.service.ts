import { prisma } from "@/shared/db";

export async function getActiveSubscription(userId: string) {
  const [sub, linksCount, socialsCount] = await Promise.all([
    prisma.userSubscription.findUnique({
      where: { userId },
      include: {
        plan: {
          include: {
            quotas: true,
          },
        },
      },
    }),
    prisma.link.count({ where: { userId, isArchived: false } }),
    prisma.socialLink.count({ where: { userId } }),
  ]);

  if (sub && (sub.status === "ACTIVE" || sub.status === "TRIAL")) {
    const quota = sub.plan.quotas;
    return {
      isSubscribed: true,
      plan: {
        id: sub.plan.id,
        slug: sub.plan.slug,
        nameAr: sub.plan.nameAr,
        nameEn: sub.plan.nameEn,
        badgeAr: sub.plan.badgeAr,
      },
      status: sub.status,
      billingCycle: sub.billingCycle,
      currency: sub.currency,
      amountPaid: sub.amountPaid,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      quotas: {
        links: { used: linksCount, max: quota?.maxLinks ?? 50 },
        socials: { used: socialsCount, max: 20 },
        customDomain: quota?.allowCustomDomain ?? false,
        advancedThemes: quota?.allowAdvancedThemes ?? false,
        removeBranding: quota?.allowRemoveBranding ?? false,
        detailedAnalytics: quota?.allowDetailedAnalytics ?? false,
        allowAppointments: quota?.allowAppointments ?? true,
        storeCommissionRate: quota?.storeCommissionRate ?? 5.0,
      },
    };
  }

  // Free Tier Fallback
  const freePlan = await prisma.subscriptionPlan.findFirst({
    where: { slug: "free" },
    include: { quotas: true },
  });

  const quota = freePlan?.quotas;
  return {
    isSubscribed: false,
    plan: {
      id: freePlan?.id ?? "free",
      slug: "free",
      nameAr: freePlan?.nameAr ?? "الباقة المجانية",
      nameEn: freePlan?.nameEn ?? "Free Tier",
      badgeAr: null,
    },
    status: "ACTIVE",
    billingCycle: "MONTHLY",
    currency: "SAR",
    amountPaid: 0,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    quotas: {
      links: { used: linksCount, max: quota?.maxLinks ?? 5 },
      socials: { used: socialsCount, max: 4 },
      customDomain: quota?.allowCustomDomain ?? false,
      advancedThemes: quota?.allowAdvancedThemes ?? false,
      removeBranding: quota?.allowRemoveBranding ?? false,
      detailedAnalytics: quota?.allowDetailedAnalytics ?? false,
      allowAppointments: quota?.allowAppointments ?? false,
      storeCommissionRate: quota?.storeCommissionRate ?? 10.0,
    },
  };
}

export async function cancelSubscriptionAtPeriodEnd(userId: string) {
  const sub = await prisma.userSubscription.findUnique({ where: { userId } });
  if (!sub) {
    throw new Error("لا يوجد اشتراك نشط قابل للإلغاء");
  }

  return prisma.userSubscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true },
  });
}

export async function getUserInvoices(userId: string, limit = 10) {
  return prisma.financialInvoice.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
