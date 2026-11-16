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

  it("should handle malformed URLs safely without throwing", () => {
    expect(extractHostname("http://")).toBeNull();
    expect(extractHostname("https://.")).toBeNull();
    expect(extractHostname("https://...")).toBeNull();
    expect(extractHostname("https://///")).toBeNull();
    expect(extractHostname("http://:80")).toBeNull();
    expect(extractHostname("   http://   ")).toBeNull();
    expect(detectPlatform("http://")).toBeNull();
    expect(detectPlatform("https://.")).toBeNull();
    expect(detectPlatform("https://...")).toBeNull();
    expect(detectPlatform("https://///")).toBeNull();
    expect(detectPlatform("http://:80")).toBeNull();
  });

  it("should reject malicious or non-web schemes and script injections", () => {
    expect(detectPlatform("javascript:alert(1)")).toBeNull();
    expect(detectPlatform("mailto:creator@domain.com")).toBeNull();
    expect(detectPlatform("tel:+966500000000")).toBeNull();
    expect(detectPlatform("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(detectPlatform("ftp://files.youtube.com")).toBeNull();
    expect(detectPlatform("spotify://track/4cOdK2wGLETKBW3PvgPWqT")).toBeNull();
    expect(detectPlatform("custom-app://open/page")).toBeNull();
  });

  it("should prevent domain spoofing and phishing subdomains", () => {
    // Phishing domains that contain platform name as subdomain of attacker domain
    expect(detectPlatform("https://youtube.com.attacker.com/watch")).toBeNull();
    expect(detectPlatform("https://tiktok.com.phishing.org/login")).toBeNull();
    expect(detectPlatform("https://salla.sa.fake-site.com")).toBeNull();
    expect(detectPlatform("https://zid.store.evil.ru")).toBeNull();

    // Domains that prepend platform name
    expect(detectPlatform("https://fakeyoutube.com")).toBeNull();
    expect(detectPlatform("https://not-tiktok.com")).toBeNull();
    expect(detectPlatform("https://my-twitch.tv.evil.com")).toBeNull();
  });

  it("should correctly detect legitimate subdomains of platforms", () => {
    expect(detectPlatform("https://music.youtube.com")?.slug).toBe("youtube");
    expect(detectPlatform("https://studio.youtube.com")?.slug).toBe("youtube");
    expect(detectPlatform("https://store.salla.sa/category")?.slug).toBe("salla");
    expect(detectPlatform("https://merchant.zid.store")?.slug).toBe("zid");
    expect(detectPlatform("https://gist.github.com/user/123")?.slug).toBe("github");
  });

  it("should safely handle internationalized domain names (IDN)", () => {
    const idnUrl = "https://منصة.السعودية/متجر";
    const hostname = extractHostname(idnUrl);
    expect(hostname).toBeDefined();
    expect(hostname).not.toBeNull();
    // Since default platforms don't have Arabic IDN, detectPlatform returns null
    expect(detectPlatform(idnUrl)).toBeNull();

    // With a custom IDN platform pattern matching the punycode or domain
    const idnPlatforms: PlatformPattern[] = [
      {
        slug: "saudi-platform",
        nameAr: "منصة سعودية",
        nameEn: "Saudi Platform",
        category: "COMMERCE",
        defaultIcon: "shopping-bag",
        brandColor: "#007A3D",
        domainPattern: hostname || "منصة.السعودية",
      },
    ];
    expect(detectPlatform(idnUrl, idnPlatforms)?.slug).toBe("saudi-platform");
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

