import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedFinancials } from "./seed-financials.ts";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log("🌱 Starting AN LINKS database seeding...");

  const adminHash = await hashPassword("Admin@123456");
  const clientHash = await hashPassword("Client@123456");

  // 1. Seed System Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@anlinks.dev" },
    update: {
      passwordHash: adminHash,
      username: "sysadmin",
      role: "ADMIN",
      isSuspended: false,
    },
    create: {
      email: "admin@anlinks.dev",
      passwordHash: adminHash,
      username: "sysadmin",
      role: "ADMIN",
      isSuspended: false,
      profile: {
        create: {
          displayName: "مدير النظام | AN LINKS",
          bio: "الحساب الإداري الرسمي لإدارة وتشغيل منصة الروابط وتلقي البلاغات 🛡️",
          themeKey: "classic",
          accentColor: "#2563EB",
          buttonStyle: "filled",
          borderRadius: "rounded-xl",
          font: "Cairo",
          isPublished: false,
        },
      },
    },
  });
  console.log(`✅ System Admin seeded: ${admin.email} (@${admin.username})`);

  // 2. Seed Client User
  const client = await prisma.user.upsert({
    where: { email: "client@anlinks.dev" },
    update: {
      passwordHash: clientHash,
      username: "faisal_client",
      role: "USER",
      isSuspended: false,
    },
    create: {
      email: "client@anlinks.dev",
      passwordHash: clientHash,
      username: "faisal_client",
      role: "USER",
      isSuspended: false,
      profile: {
        create: {
          displayName: "فيصل الشمري",
          bio: "صانع محتوى تقني وتجارة رقمية 🚀 | روابطي ومتاجري الرسمية",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          themeKey: "layanDark",
          accentColor: "#4edea3",
          buttonStyle: "filled",
          borderRadius: "rounded-xl",
          font: "Cairo",
          isPublished: true,
        },
      },
    },
  });
  console.log(`✅ Client Account seeded: ${client.email} (@${client.username})`);

  // 3. Clear & Seed Client Links
  await prisma.link.deleteMany({ where: { userId: client.id } });
  const linksData = [
    {
      title: "متجري الرقمي - قوالب وتطبيقات",
      url: "https://store.anlinks.dev",
      position: 0,
      isActive: true,
    },
    {
      title: "قناتي على يوتيوب",
      url: "https://youtube.com/@faisal_demo",
      position: 1,
      isActive: true,
    },
    {
      title: "حجز استشارة خاصة عبر واتساب",
      url: "https://wa.me/966501234567",
      position: 2,
      isActive: true,
    },
    {
      title: "رابط تجريبي مؤرشف",
      url: "https://broken-link-example.com",
      position: 3,
      isActive: false,
    },
  ];

  const createdLinks = [];
  for (const item of linksData) {
    const l = await prisma.link.create({
      data: { ...item, userId: client.id },
    });
    createdLinks.push(l);
  }

  // 4. Clear & Seed Social Links
  await prisma.socialLink.deleteMany({ where: { userId: client.id } });
  const socialsData = [
    { network: "x", url: "https://x.com/faisal_client", position: 0 },
    { network: "youtube", url: "https://youtube.com/@faisal_client", position: 1 },
    { network: "github", url: "https://github.com/faisal_client", position: 2 },
    { network: "instagram", url: "https://instagram.com/faisal_client", position: 3 },
  ];
  for (const s of socialsData) {
    await prisma.socialLink.create({
      data: { ...s, userId: client.id },
    });
  }

  // 5. Seed 14 Days of Analytics Data
  await prisma.dailyProfileStat.deleteMany({ where: { username: client.username } });
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const views = 900 + Math.floor(Math.sin(i) * 200) + (14 - i) * 20;
    await prisma.dailyProfileStat.create({
      data: {
        username: client.username,
        date: d,
        views,
      },
    });

    if (createdLinks[0]) {
      await prisma.dailyLinkStat.upsert({
        where: { linkId_date: { linkId: createdLinks[0].id, date: d } },
        update: { clicks: Math.floor(views * 0.12) },
        create: { linkId: createdLinks[0].id, date: d, clicks: Math.floor(views * 0.12) },
      });
    }
  }

  // 6. Seed Sample Pending Abuse Report for Testing
  await prisma.report.deleteMany({ where: { username: client.username } });
  await prisma.report.create({
    data: {
      username: client.username,
      reason: "other",
      details: "بلاغ تجريبي لاختبار دورة مراجعة المشغّل",
      reporterIp: "192.168.1.xxx",
      status: "PENDING",
    },
  });

  // 7. Seed Financial Infrastructure (Gateways, Plans, Currencies)
  await seedFinancials(prisma);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

