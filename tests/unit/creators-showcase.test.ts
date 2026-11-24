import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("VIP Creators Showcase Verification Suite", () => {
  const expectedUsernames = [
    "faisal_tech",
    "omfarooq",
    "sara_lifestyle",
    "elfiky_legacy",
    "kareem_ismail",
  ];

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should have all 5 VIP creators seeded in the database", async () => {
    const users = await prisma.user.findMany({
      where: { username: { in: expectedUsernames } },
      include: {
        profile: true,
        links: true,
        socials: true,
      },
    });

    expect(users).toHaveLength(5);
    const foundUsernames = users.map((u) => u.username);
    for (const u of expectedUsernames) {
      expect(foundUsernames).toContain(u);
    }
  });

  it("should verify profile details, themes, and fonts are unique and valid", async () => {
    const profiles = await prisma.profile.findMany({
      where: { user: { username: { in: expectedUsernames } } },
      include: { user: true },
    });

    const themes = new Set(profiles.map((p) => p.themeKey));
    const fonts = new Set(profiles.map((p) => p.font));

    // Diverse themes across creators
    expect(themes.size).toBeGreaterThanOrEqual(4);
    expect(fonts.size).toBeGreaterThanOrEqual(4);

    for (const p of profiles) {
      expect(p.displayName).toBeTruthy();
      expect(p.bio).toBeTruthy();
      expect(p.avatarUrl).toBeTruthy();
      expect(p.isPublished).toBe(true);
    }
  });

  it("should verify each creator has active links and valid socials", async () => {
    for (const username of expectedUsernames) {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          links: { where: { isActive: true } },
          socials: true,
        },
      });

      expect(user).toBeDefined();
      expect(user!.links.length).toBeGreaterThanOrEqual(3);
      expect(user!.socials.length).toBeGreaterThanOrEqual(3);

      // Check pinned link
      const pinned = user!.links.find((l) => l.isPinned);
      expect(pinned).toBeDefined();
    }
  });

  it("should verify daily statistics are populated for charts", async () => {
    for (const username of expectedUsernames) {
      const stats = await prisma.dailyProfileStat.findMany({
        where: { username },
      });

      expect(stats.length).toBeGreaterThanOrEqual(14);
      const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
      expect(totalViews).toBeGreaterThan(10000);
    }
  });
});
