import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FAMOUS_CREATORS } from "./data/creators-data.ts";

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function seedFamousCreators(prisma: PrismaClient) {
  console.log("🌟 Seeding VIP Showcase Creators...");
  const defaultPassword = await hashPassword("Creator@123456");

  for (const c of FAMOUS_CREATORS) {
    // 1. Upsert User
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {
        username: c.username,
        role: "USER",
        isSuspended: false,
      },
      create: {
        email: c.email,
        username: c.username,
        passwordHash: defaultPassword,
        role: "USER",
        isSuspended: false,
      },
    });

    // 2. Upsert Profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        displayName: c.displayName,
        bio: c.bio,
        location: c.location,
        avatarUrl: c.avatarUrl,
        themeKey: c.themeKey,
        accentColor: c.accentColor,
        buttonStyle: c.buttonStyle,
        borderRadius: c.borderRadius,
        font: c.font,
        backgroundType: c.backgroundType,
        customBackground: c.customBackground || null,
        bgOverlayOpacity: c.bgOverlayOpacity || 50,
        cardStyle: c.cardStyle,
        buttonShadow: c.buttonShadow,
        socialPosition: c.socialPosition,
        phone: c.phone || null,
        isPublished: true,
      },
      create: {
        userId: user.id,
        displayName: c.displayName,
        bio: c.bio,
        location: c.location,
        avatarUrl: c.avatarUrl,
        themeKey: c.themeKey,
        accentColor: c.accentColor,
        buttonStyle: c.buttonStyle,
        borderRadius: c.borderRadius,
        font: c.font,
        backgroundType: c.backgroundType,
        customBackground: c.customBackground || null,
        bgOverlayOpacity: c.bgOverlayOpacity || 50,
        cardStyle: c.cardStyle,
        buttonShadow: c.buttonShadow,
        socialPosition: c.socialPosition,
        phone: c.phone || null,
        isPublished: true,
      },
    });

    // 3. Clear and Seed Links
    await prisma.link.deleteMany({ where: { userId: user.id } });
    const createdLinks = [];
    for (let i = 0; i < c.links.length; i++) {
      const item = c.links[i];
      const link = await prisma.link.create({
        data: {
          userId: user.id,
          title: item.title,
          url: item.url,
          description: item.description || null,
          position: i,
          isActive: true,
          isPinned: item.isPinned || false,
          clicksCount: item.clicksCount || 0,
        },
      });
      createdLinks.push(link);
    }

    // 4. Clear and Seed Social Links
    await prisma.socialLink.deleteMany({ where: { userId: user.id } });
    for (let i = 0; i < c.socials.length; i++) {
      const s = c.socials[i];
      await prisma.socialLink.create({
        data: {
          userId: user.id,
          network: s.network,
          url: s.url,
          position: i,
        },
      });
    }

    // 5. Seed 14 Days of Daily Stats
    await prisma.dailyProfileStat.deleteMany({ where: { username: c.username } });
    const now = new Date();
    for (let dIdx = 13; dIdx >= 0; dIdx--) {
      const d = new Date(now);
      d.setDate(d.getDate() - dIdx);
      d.setHours(0, 0, 0, 0);

      const baseViews = 1200 + Math.floor(Math.sin(dIdx + user.username.length) * 400);
      await prisma.dailyProfileStat.create({
        data: {
          username: c.username,
          date: d,
          views: baseViews,
        },
      });

      if (createdLinks[0]) {
        await prisma.dailyLinkStat.upsert({
          where: { linkId_date: { linkId: createdLinks[0].id, date: d } },
          update: { clicks: Math.floor(baseViews * 0.18) },
          create: { linkId: createdLinks[0].id, date: d, clicks: Math.floor(baseViews * 0.18) },
        });
      }
    }

    console.log(`  ✅ Seeded Creator: @${c.username} (${c.displayName})`);
  }
}
