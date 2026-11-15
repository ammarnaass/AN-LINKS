import { describe, it, expect, vi } from "vitest";
import { PLATFORMS_SEED_DATA, seedPlatforms } from "../../prisma/seed-platforms.ts";
import { PlatformCategory } from "@prisma/client";

describe("Seed Platforms Configuration & Execution", () => {
  it("should contain exactly 20 supported platforms", () => {
    expect(PLATFORMS_SEED_DATA).toHaveLength(20);
  });

  it("should contain unique slugs for all platforms", () => {
    const slugs = PLATFORMS_SEED_DATA.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(20);
  });

  it("should contain unique sortOrder values for all platforms", () => {
    const sortOrders = PLATFORMS_SEED_DATA.map((p) => p.sortOrder);
    const uniqueSortOrders = new Set(sortOrders);
    expect(uniqueSortOrders.size).toBe(20);
  });

  it("should have all required fields filled with valid formats", () => {
    for (const p of PLATFORMS_SEED_DATA) {
      expect(p.slug.trim()).not.toBe("");
      expect(p.nameAr.trim()).not.toBe("");
      expect(p.nameEn.trim()).not.toBe("");
      expect(Object.values(PlatformCategory)).toContain(p.category);
      expect(p.defaultIcon.trim()).not.toBe("");
      expect(p.brandColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(p.domainPattern.trim()).not.toBe("");
      expect(p.urlPlaceholder).toMatch(/^https?:\/\//);
      expect(typeof p.isEnabled).toBe("boolean");
      expect(typeof p.isVerified).toBe("boolean");
      expect(p.sortOrder).toBeGreaterThan(0);
    }
  });

  it("should include key expected platforms: youtube, salla, zid, tiktok, x, whatsapp", () => {
    const slugs = PLATFORMS_SEED_DATA.map((p) => p.slug);
    expect(slugs).toContain("youtube");
    expect(slugs).toContain("salla");
    expect(slugs).toContain("zid");
    expect(slugs).toContain("tiktok");
    expect(slugs).toContain("x");
    expect(slugs).toContain("whatsapp");
    expect(slugs).toContain("custom");
  });

  it("should execute seedPlatforms function without errors calling prisma.platform.upsert", async () => {
    const upsertMock = vi.fn().mockResolvedValue({});
    const mockPrisma = {
      platform: {
        upsert: upsertMock,
      },
    } as any;

    await seedPlatforms(mockPrisma);

    expect(upsertMock).toHaveBeenCalledTimes(20);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: "youtube" },
        create: expect.objectContaining({ slug: "youtube", nameEn: "YouTube" }),
      })
    );
  });
});
