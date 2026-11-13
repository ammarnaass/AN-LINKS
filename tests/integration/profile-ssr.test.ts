import { describe, it, expect } from "vitest";
import { THEMES } from "@/lib/themes";

describe("Public Profile & Themes Configuration", () => {
  it("should provide at least 4 predefined themes with required styling tokens", () => {
    const themeKeys = Object.keys(THEMES);
    expect(themeKeys.length).toBeGreaterThanOrEqual(4);
    expect(themeKeys).toContain("default");
    expect(themeKeys).toContain("midnight");
    expect(themeKeys).toContain("emerald");
    expect(themeKeys).toContain("sunset");

    for (const key of themeKeys) {
      const theme = THEMES[key];
      expect(theme.name).toBeDefined();
      expect(theme.nameAr).toBeDefined();
      expect(theme.backgroundClass).toBeDefined();
      expect(theme.textPrimary).toBeDefined();
      expect(theme.textSecondary).toBeDefined();
      expect(theme.buttonClass).toBeDefined();
      expect(theme.socialIconClass).toBeDefined();
    }
  });

  it("should have correct SEO metadata generation helper", async () => {
    const { generateProfileMetadata } = await import("@/lib/profile-service");
    const meta = generateProfileMetadata({
      displayName: "متجر الأناقة",
      bio: "أفضل الأزياء والمنتجات الحصرية",
      username: "elegance",
      avatarUrl: "https://example.com/avatar.jpg",
    });

    expect(meta.title).toContain("متجر الأناقة");
    expect(meta.description).toBe("أفضل الأزياء والمنتجات الحصرية");
    expect(meta.openGraph?.title).toContain("متجر الأناقة");
    expect(meta.openGraph?.images).toContain("https://example.com/avatar.jpg");
  });

  it("should filter out inactive links from public profile rendering", async () => {
    const { filterActiveLinks } = await import("@/lib/profile-service");
    const links = [
      { id: "1", title: "موقعي", url: "https://mysite.com", isActive: true, position: 0 },
      { id: "2", title: "رابط معطل", url: "https://hidden.com", isActive: false, position: 1 },
      { id: "3", title: "متجري", url: "https://shop.com", isActive: true, position: 2 },
    ];

    const active = filterActiveLinks(links);
    expect(active).toHaveLength(2);
    expect(active.map((l) => l.id)).toEqual(["1", "3"]);
  });
});
