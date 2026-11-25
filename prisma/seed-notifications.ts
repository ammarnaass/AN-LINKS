import { PrismaClient } from "@prisma/client";

export async function seedNotifications(prisma: PrismaClient) {
  console.log("📢 Seeding System Notifications...");
  await prisma.systemNotification.deleteMany({});

  const n1 = await prisma.systemNotification.create({
    data: {
      title: "مرحباً بكم في AN LINKS 2026 🚀",
      message: "اكتشف بطاقتك الذكية الجديدة بتقنية NFC وتصميم شارة التوثيق وإطار صورتك الاحترافي الآن!",
      type: "ANNOUNCEMENT",
      target: "ALL",
      position: "BOTTOM_LEFT",
      color: "#6366f1",
      icon: "Megaphone",
      actionLabel: "استكشف المزايا",
      actionUrl: "/features",
      autoDismissSeconds: 15,
      priority: 10,
      isActive: true,
      startsAt: new Date(Date.now() - 60000),
    },
  });

  const n2 = await prisma.systemNotification.create({
    data: {
      title: "عرض حصري: باقة Pro السنوية ⭐",
      message: "احصل على خصم 40% وتفعيل فوري للدومين المخصص والتحليلات الجغرافية المتقدمة.",
      type: "PROMO",
      target: "CREATORS_ONLY",
      position: "BOTTOM_LEFT",
      color: "#06b6d4",
      icon: "Sparkles",
      actionLabel: "ترقية الحساب",
      actionUrl: "/pricing",
      autoDismissSeconds: 20,
      priority: 5,
      isActive: true,
      startsAt: new Date(Date.now() - 60000),
    },
  });

  const n3 = await prisma.systemNotification.create({
    data: {
      title: "تحديث أمني جديد 🛡️",
      message: "تم تفعيل حماية إضافية للتحقق الثنائي ومفاتيح المرور Passkeys لجميع الحسابات.",
      type: "ANNOUNCEMENT",
      target: "ALL",
      position: "BOTTOM_LEFT",
      color: "#10b981",
      icon: "ShieldCheck",
      actionLabel: "إعدادات الأمان",
      actionUrl: "/dashboard/settings/security",
      autoDismissSeconds: 12,
      priority: 3,
      isActive: false,
      startsAt: new Date(Date.now() - 60000),
    },
  });

  console.log(`✅ Seeded ${[n1, n2, n3].length} system notifications.`);
}
