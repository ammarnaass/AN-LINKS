import { describe, it, expect } from "vitest";
import {
  detectPlatform,
  extractHostname,
  DEFAULT_PLATFORM_PATTERNS,
  PlatformPattern,
} from "@/features/links/services/platform-detector";

describe("Platform Detector Utility", () => {
  it("should have 20 default platform patterns defined", () => {
    expect(DEFAULT_PLATFORM_PATTERNS).toHaveLength(20);
    const slugs = DEFAULT_PLATFORM_PATTERNS.map((p) => p.slug);
    expect(slugs).toContain("youtube");
    expect(slugs).toContain("tiktok");
    expect(slugs).toContain("instagram");
    expect(slugs).toContain("x");
    expect(slugs).toContain("salla");
    expect(slugs).toContain("zid");
    expect(slugs).toContain("custom");
  });

  it("should extract hostname safely from various URL formats", () => {
    expect(extractHostname("https://www.youtube.com/watch?v=123")).toBe("www.youtube.com");
    expect(extractHostname("http://salla.sa/mystore")).toBe("salla.sa");
    expect(extractHostname("tiktok.com/@username")).toBe("tiktok.com");
    expect(extractHostname("")).toBeNull();
    expect(extractHostname("   ")).toBeNull();
    expect(extractHostname("not an url @@##")).toBeNull();
  });

  it("should detect standard social and video platforms accurately", () => {
    expect(detectPlatform("https://www.youtube.com/watch?v=abc")?.slug).toBe("youtube");
    expect(detectPlatform("https://youtu.be/abc")?.slug).toBe("youtube");
    expect(detectPlatform("https://tiktok.com/@user")?.slug).toBe("tiktok");
    expect(detectPlatform("https://instagram.com/user")?.slug).toBe("instagram");
    expect(detectPlatform("https://x.com/user")?.slug).toBe("x");
    expect(detectPlatform("https://twitter.com/user")?.slug).toBe("x");
    expect(detectPlatform("https://snapchat.com/add/user")?.slug).toBe("snapchat");
  });

  it("should detect messaging platforms accurately", () => {
    expect(detectPlatform("https://wa.me/966500000000")?.slug).toBe("whatsapp");
    expect(detectPlatform("https://whatsapp.com/channel/abc")?.slug).toBe("whatsapp");
    expect(detectPlatform("https://t.me/username")?.slug).toBe("telegram");
  });

  it("should detect Saudi & regional commerce platforms (Salla & Zid)", () => {
    expect(detectPlatform("https://salla.sa/mybrand")?.slug).toBe("salla");
    expect(detectPlatform("https://salla.com/mybrand")?.slug).toBe("salla");
    expect(detectPlatform("https://zid.store/mybrand")?.slug).toBe("zid");
    expect(detectPlatform("https://zid.sa/mybrand")?.slug).toBe("zid");
  });

  it("should detect music and streaming platforms accurately", () => {
    expect(detectPlatform("https://open.spotify.com/artist/123")?.slug).toBe("spotify");
    expect(detectPlatform("https://music.apple.com/album/123")?.slug).toBe("apple-music");
    expect(detectPlatform("https://soundcloud.com/artist/track")?.slug).toBe("soundcloud");
    expect(detectPlatform("https://play.anghami.com/artist/123")?.slug).toBe("anghami");
    expect(detectPlatform("https://twitch.tv/streamer")?.slug).toBe("twitch");
  });

  it("should detect developer & professional networks accurately", () => {
    expect(detectPlatform("https://github.com/developer")?.slug).toBe("github");
    expect(detectPlatform("https://linkedin.com/in/profile")?.slug).toBe("linkedin");
    expect(detectPlatform("https://discord.gg/community")?.slug).toBe("discord");
  });

  it("should return null for unrecognized domains or invalid inputs", () => {
    expect(detectPlatform("https://unknown-random-site.com")).toBeNull();
    expect(detectPlatform("https://example.org/test")).toBeNull();
    expect(detectPlatform("")).toBeNull();
    expect(detectPlatform("invalid url")).toBeNull();
    expect(detectPlatform(null as unknown as string)).toBeNull();
  });

  it("should support custom platform patterns list if supplied", () => {
    const customList: PlatformPattern[] = [
      {
        slug: "my-custom-portal",
        nameAr: "بوابتي الخاصة",
        nameEn: "My Portal",
        category: "CUSTOM",
        defaultIcon: "globe",
        brandColor: "#123456",
        domainPattern: "myportal.net|portal.internal",
      },
    ];

    expect(detectPlatform("https://myportal.net/dashboard", customList)?.slug).toBe("my-custom-portal");
    expect(detectPlatform("https://youtube.com", customList)).toBeNull();
  });
});

