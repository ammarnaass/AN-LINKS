import { describe, it, expect } from "vitest";
import { resolveThemeStyles } from "@/features/appearance/utils/theme-resolver";
import { generateProfileMetadata, filterActiveLinks } from "@/lib/profile-service";

describe("Fathi Elkashti Creator Profile Verification", () => {
  const fathiMockProfile = {
    displayName: "فتحي القشطي | Fathi Elkashti",
    bio: "تغطية شاملة ومباشرة لأسعار وسوق السيارات المستعملة في الجزائر 🚗🇩🇿 | عروض يومية، بيع وشراء المركبات، واستشارات الفحص - ولاية الوادي (قمار) 📍",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    themeKey: "carbonDark",
    accentColor: "#f59e0b",
    buttonStyle: "glass",
    borderRadius: "rounded-xl",
    font: "Cairo",
    backgroundType: "IMAGE",
    customBackground: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    bgOverlayOpacity: 55,
    buttonShadow: "soft",
    cardStyle: "glass",
    isPublished: true,
  };

  it("should generate SEO metadata correctly for Fathi Elkashti", () => {
    const meta = generateProfileMetadata({
      displayName: fathiMockProfile.displayName,
      bio: fathiMockProfile.bio,
      username: "fathi",
      avatarUrl: fathiMockProfile.avatarUrl,
    });

    expect(meta.title).toContain("فتحي القشطي");
    expect(meta.description).toContain("سوق السيارات المستعملة في الجزائر");
    expect(meta.openGraph?.images).toContain(fathiMockProfile.avatarUrl);
  });

  it("should resolve styling correctly with glass cardStyle and image overlay", () => {
    const styles = resolveThemeStyles(fathiMockProfile);

    expect(styles.backgroundClass).toContain("bg-cover");
    expect(styles.overlayStyle).toEqual({
      backgroundColor: "rgba(0, 0, 0, 0.55)",
    });
    expect(styles.cardClass).toContain("backdrop-blur-xl");
    expect(styles.fontClass).toBe("font-cairo");
  });

  it("should verify active links filtering for automotive showroom links", () => {
    const fathiLinks = [
      { id: "link-1", title: "قناة اليوتيوب", url: "https://youtube.com/@fathi_elkashti", isActive: true, position: 0 },
      { id: "link-2", title: "معرض الشوروم", url: "https://facebook.com/fathi.elkashti.cars", isActive: true, position: 1 },
      { id: "link-3", title: "سيارة مباعة", url: "https://sold-car.com", isActive: false, position: 2 },
    ];

    const active = filterActiveLinks(fathiLinks);
    expect(active).toHaveLength(2);
    expect(active.map((l) => l.id)).toEqual(["link-1", "link-2"]);
  });
});
