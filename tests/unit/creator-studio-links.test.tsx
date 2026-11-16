import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SocialIcons,
  SOCIAL_ICON_MAP,
  getSocialIcon,
  GenericLinkIcon,
  SnapchatIcon,
  SpotifyIcon,
  AppleMusicIcon,
  SoundcloudIcon,
  AnghamiIcon,
  SallaIcon,
  ZidIcon,
  DiscordIcon,
  TwitchIcon,
  PinterestIcon,
} from "@/shared/ui";
import { LinkHealthBanner } from "@/features/links/components/LinkHealthBanner";
import { LinkCardItem } from "@/features/links/components/LinkCardItem";
import { ProfileCard } from "@/features/bio/components/ProfileCard";
import { LinkData } from "@/features/links/types/links.types";

describe("Task 4: Creator Studio & Zero-Mock UI Suite", () => {
  describe("SocialIcons & Platform Icons Mapping", () => {
    it("should export SVG components for the 20 platforms and generic link fallback", () => {
      expect(SnapchatIcon).toBeDefined();
      expect(SpotifyIcon).toBeDefined();
      expect(AppleMusicIcon).toBeDefined();
      expect(SoundcloudIcon).toBeDefined();
      expect(AnghamiIcon).toBeDefined();
      expect(SallaIcon).toBeDefined();
      expect(ZidIcon).toBeDefined();
      expect(DiscordIcon).toBeDefined();
      expect(TwitchIcon).toBeDefined();
      expect(PinterestIcon).toBeDefined();
      expect(GenericLinkIcon).toBeDefined();
    });

    it("should map all 20 platforms + aliases in SOCIAL_ICON_MAP", () => {
      const expectedPlatforms = [
        "youtube",
        "tiktok",
        "instagram",
        "x",
        "twitter",
        "snapchat",
        "whatsapp",
        "telegram",
        "linkedin",
        "github",
        "spotify",
        "apple-music",
        "applemusic",
        "soundcloud",
        "anghami",
        "salla",
        "zid",
        "discord",
        "twitch",
        "facebook",
        "pinterest",
        "custom",
        "other",
      ];

      for (const slug of expectedPlatforms) {
        expect(SOCIAL_ICON_MAP[slug]).toBeDefined();
      }
    });

    it("should safely resolve icons via getSocialIcon helper with fallback to GenericLinkIcon", () => {
      expect(getSocialIcon("spotify")).toBe(SpotifyIcon);
      expect(getSocialIcon("salla")).toBe(SallaIcon);
      expect(getSocialIcon("zid")).toBe(ZidIcon);
      expect(getSocialIcon("apple-music")).toBe(AppleMusicIcon);
      expect(getSocialIcon("applemusic")).toBe(AppleMusicIcon);
      expect(getSocialIcon("unknown-platform-slug")).toBe(GenericLinkIcon);
      expect(getSocialIcon("")).toBe(GenericLinkIcon);
    });

    it("should render SVG markup correctly for social icons", () => {
      const html = renderToStaticMarkup(<SocialIcons network="spotify" className="w-5 h-5" />);
      expect(html).toContain("<svg");
      expect(html).toContain("w-5 h-5");
    });
  });

  describe("LinkHealthBanner (Zero-Mock Real Stats)", () => {
    const mockLinks: LinkData[] = [
      {
        id: "l1",
        title: "متجر سلة",
        url: "https://salla.sa/mystore",
        isActive: true,
        isPinned: true,
        clicksCount: 150,
        position: 0,
      },
      {
        id: "l2",
        title: "قناة يوتيوب",
        url: "https://youtube.com/@channel",
        isActive: true,
        isPinned: false,
        clicksCount: 300,
        position: 1,
      },
      {
        id: "l3",
        title: "مسودة",
        url: "https://example.com/draft",
        isActive: false,
        isPinned: false,
        clicksCount: 10,
        position: 2,
      },
    ];

    it("should display real computed stats from links array", () => {
      const html = renderToStaticMarkup(
        <LinkHealthBanner
          isAdding={false}
          onToggleAdd={vi.fn()}
          links={mockLinks}
        />
      );

      // Active links: 2 out of 3
      expect(html).toContain("2/3");
      expect(html).toContain("نشطة");

      // Total clicks: 150 + 300 + 10 = 460
      expect(html).toContain("٤٦٠");
      expect(html).toContain("إجمالي النقرات");

      // Pinned links: 1
      expect(html).toContain("مثبتة في الأعلى");
    });

    it("should NOT contain fake mock texts like '72ms' or 'فحص تلقائي كل 5 دقائق'", () => {
      const html = renderToStaticMarkup(
        <LinkHealthBanner
          isAdding={false}
          onToggleAdd={vi.fn()}
          links={mockLinks}
        />
      );

      expect(html).not.toContain("72ms");
      expect(html).not.toContain("فحص تلقائي كل 5 دقائق");
      expect(html).not.toContain("100% صالحة");
    });
  });

  describe("LinkCardItem (Platform Badges & Zero-Mock Clean)", () => {
    const sampleLink: LinkData = {
      id: "link-salla-1",
      title: "متجري على سلة",
      url: "https://salla.sa/store",
      isActive: true,
      isPinned: true,
      isArchived: false,
      platformId: "salla",
      clicksCount: 42,
      position: 0,
    };

    it("should render real platform badge, clicks counter, and pin badge", () => {
      const html = renderToStaticMarkup(
        <LinkCardItem
          link={sampleLink}
          index={0}
          totalCount={1}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
          onMove={vi.fn()}
        />
      );

      // Title & URL
      expect(html).toContain("متجري على سلة");
      expect(html).toContain("salla.sa/store");

      // Real clicks counter
      expect(html).toContain("٤٢ نقرة");

      // Real platform name
      expect(html).toContain("سلة");

      // Pin badge
      expect(html).toContain("مثبت");

      // Absolutely NO fake sentinel badge
      expect(html).not.toContain("200 OK");
      expect(html).not.toContain("72ms");
      expect(html).not.toContain("استجابة سريعة");
    });

    it("should render archived badge when isArchived is true", () => {
      const archivedLink: LinkData = {
        ...sampleLink,
        isPinned: false,
        isArchived: true,
      };

      const html = renderToStaticMarkup(
        <LinkCardItem
          link={archivedLink}
          index={0}
          totalCount={1}
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
          onMove={vi.fn()}
        />
      );

      expect(html).toContain("مؤرشف");
      expect(html).not.toContain("مثبت");
    });
  });

  describe("ProfileCard (Real Stats & Zero Fake Metrics)", () => {
    it("should display real active links and socials count when provided", () => {
      const html = renderToStaticMarkup(
        <ProfileCard
          displayName="أحمد المطور"
          username="ahmed_dev"
          bio="صانع محتوى تقني"
          linksCount={7}
          socials={[
            { id: "s1", network: "x", url: "https://x.com/ahmed" },
            { id: "s2", network: "github", url: "https://github.com/ahmed" },
          ]}
        />
      );

      expect(html).toContain("أحمد المطور");
      expect(html).toContain("@ahmed_dev");
      expect(html).toContain("٧");
      expect(html).toContain("رابط نشط");
      expect(html).toContain("٢");
      expect(html).toContain("منصة تواصل");
    });

    it("should NOT contain hardcoded mock stats '250K+' or '14+' or '25K'", () => {
      const html = renderToStaticMarkup(
        <ProfileCard
          displayName="أحمد المطور"
          username="ahmed_dev"
          linksCount={3}
          socials={[]}
        />
      );

      expect(html).not.toContain("250K+");
      expect(html).not.toContain("14+");
      expect(html).not.toContain("25K");
      expect(html).not.toContain("متابع رقمي");
      expect(html).not.toContain("مشترك النشرة");
    });
  });
});
