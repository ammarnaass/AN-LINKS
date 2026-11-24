import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function seedFathiAccount(prismaClient: PrismaClient = prisma) {
  console.log("🚗 Seeding Fathi Elkashti (فتحي القشطي) account...");

  const passwordHash = await hashPassword("Password@123456");

  // 1. Create or Update User & Profile
  const user = await prismaClient.user.upsert({
    where: { email: "fathi@anlinks.dev" },
    update: {
      passwordHash,
      username: "fathi",
      role: "USER",
      isSuspended: false,
    },
    create: {
      email: "fathi@anlinks.dev",
      passwordHash,
      username: "fathi",
      role: "USER",
      isSuspended: false,
      profile: {
        create: {
          displayName: "فتحي القشطي | Fathi Elkashti",
          location: "ولاية الوادي، الجزائر",
          bio: "تغطية شاملة ومباشرة لأسعار وسوق السيارات المستعملة في الجزائر 🚗🇩🇿 | عروض يومية، بيع وشراء المركبات، واستشارات الفحص - ولاية الوادي (قمار) 📍",
          avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
          phone: "+213661234567",
          themeKey: "carbonDark",
          accentColor: "#f59e0b",
          buttonStyle: "glass",
          borderRadius: "rounded-xl",
          font: "Cairo",
          backgroundType: "IMAGE",
          customBackground: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
          bgOverlayOpacity: 55,
          buttonShadow: "soft",
          socialPosition: "top",
          cardStyle: "glass",
          isPublished: true,
        },
      },
    },
  });

  // Ensure Profile is updated even if user already existed
  await prismaClient.profile.upsert({
    where: { userId: user.id },
    update: {
      displayName: "فتحي القشطي | Fathi Elkashti",
      location: "ولاية الوادي، الجزائر",
      bio: "تغطية شاملة ومباشرة لأسعار وسوق السيارات المستعملة في الجزائر 🚗🇩🇿 | عروض يومية، بيع وشراء المركبات، واستشارات الفحص - ولاية الوادي (قمار) 📍",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      phone: "+213661234567",
      themeKey: "carbonDark",
      accentColor: "#f59e0b",
      buttonStyle: "glass",
      borderRadius: "rounded-xl",
      font: "Cairo",
      backgroundType: "IMAGE",
      customBackground: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      bgOverlayOpacity: 55,
      buttonShadow: "soft",
      socialPosition: "top",
      cardStyle: "glass",
      isPublished: true,
    },
    create: {
      userId: user.id,
      displayName: "فتحي القشطي | Fathi Elkashti",
      location: "ولاية الوادي، الجزائر",
      bio: "تغطية شاملة ومباشرة لأسعار وسوق السيارات المستعملة في الجزائر 🚗🇩🇿 | عروض يومية، بيع وشراء المركبات، واستشارات الفحص - ولاية الوادي (قمار) 📍",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      phone: "+213661234567",
      themeKey: "carbonDark",
      accentColor: "#f59e0b",
      buttonStyle: "glass",
      borderRadius: "rounded-xl",
      font: "Cairo",
      backgroundType: "IMAGE",
      customBackground: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      bgOverlayOpacity: 55,
      buttonShadow: "soft",
      socialPosition: "top",
      cardStyle: "glass",
      isPublished: true,
    },
  });

  // 2. Clear & Seed Links
  await prismaClient.link.deleteMany({ where: { userId: user.id } });
  const linksData = [
    {
      title: "🎬 قناة اليوتيوب الرسمية | جولات وأسعار السيارات",
      url: "https://youtube.com/@fathi_elkashti",
      description: "تغطية أسبوعية حية لأسواق السيارات وحالة المحركات والأسعار الحقيقية",
      position: 0,
      isActive: true,
      clicksCount: 2450,
    },
    {
      title: "🚗 معرض الشوروم | أحدث السيارات المتاحة للبيع الآن",
      url: "https://facebook.com/fathi.elkashti.cars",
      description: "سيارات جاهزة للتسليم الفوري مع فحص الحالة والممشى والأسعار",
      position: 1,
      isActive: true,
      clicksCount: 4120,
    },
    {
      title: "📱 تيك توك | عروض ومقتطفات سريعة من المعرض",
      url: "https://tiktok.com/@fathi_elkashti",
      description: "مقاطع يومية وتحديثات لحظية لكل مركبة جديدة تصل إلى الشوروم",
      position: 2,
      isActive: true,
      clicksCount: 3890,
    },
    {
      title: "💬 واتساب مباشر | حجز موعد معاينة أو استشارة شراء",
      url: "https://wa.me/213661234567",
      description: "تواصل مباشر مع فريق المعرض للرد على كافة استفساراتكم",
      position: 3,
      isActive: true,
      clicksCount: 2780,
    },
    {
      title: "📍 موقع المعرض على خرائط جوجل (ولاية الوادي - قمار)",
      url: "https://maps.google.com/?q=Guemar+El-Oued+Algeria",
      description: "نستقبلكم طيلة أيام الأسبوع في مقر المعرض بقمار - وادي سوف",
      position: 4,
      isActive: true,
      clicksCount: 1340,
    },
    {
      title: "📋 نموذج طلب تصوير وعرض سيارتك للبيع في الفيديو القادم",
      url: "https://forms.anlinks.dev/fathi-car-submission",
      description: "اعرض سيارتك أمام آلاف المشتريين والمهتمين بالمركبات في الجزائر",
      position: 5,
      isActive: true,
      clicksCount: 890,
    },
  ];

  const createdLinks = [];
  for (const item of linksData) {
    const l = await prismaClient.link.create({
      data: { ...item, userId: user.id },
    });
    createdLinks.push(l);
  }

  // 3. Clear & Seed Social Links
  await prismaClient.socialLink.deleteMany({ where: { userId: user.id } });
  const socialsData = [
    { network: "youtube", url: "https://youtube.com/@fathi_elkashti", position: 0 },
    { network: "facebook", url: "https://facebook.com/fathi.elkashti.cars", position: 1 },
    { network: "tiktok", url: "https://tiktok.com/@fathi_elkashti", position: 2 },
    { network: "whatsapp", url: "https://wa.me/213661234567", position: 3 },
    { network: "instagram", url: "https://instagram.com/fathi_elkashti", position: 4 },
  ];
  for (const s of socialsData) {
    await prismaClient.socialLink.create({
      data: { ...s, userId: user.id },
    });
  }

  // 4. Seed 14 Days of Analytics Data
  await prismaClient.dailyProfileStat.deleteMany({ where: { username: "fathi" } });
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const views = 2400 + Math.floor(Math.sin(i * 0.7) * 500) + (14 - i) * 65;
    await prismaClient.dailyProfileStat.create({
      data: {
        username: "fathi",
        date: d,
        views,
      },
    });

    for (const link of createdLinks) {
      await prismaClient.dailyLinkStat.upsert({
        where: { linkId_date: { linkId: link.id, date: d } },
        update: { clicks: Math.floor(views * 0.15) },
        create: { linkId: link.id, date: d, clicks: Math.floor(views * 0.15) },
      });
    }
  }

  console.log(`✅ Fathi Elkashti account successfully seeded: fathi@anlinks.dev (@${user.username})`);
  return user;
}

if (process.argv[1] && process.argv[1].endsWith("seed-fathi.ts")) {
  seedFathiAccount()
    .catch((e) => {
      console.error("❌ Error seeding Fathi account:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
