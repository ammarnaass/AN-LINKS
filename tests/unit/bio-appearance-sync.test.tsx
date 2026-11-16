import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BioPageContent, ProfileCard, LinkButton, SocialIconsRow } from "@/features/bio";
import { THEMES } from "@/features/appearance";

describe("Task 5: Bio Page & Appearance Synchronization Suite", () => {
  const sampleProfile = {
    displayName: "طارق السعيد",
    bio: "مصمم ومبرمج واجهات",
    avatarUrl: null,
    themeKey: "emerald",
    accentColor: "#10b981",
    buttonStyle: "glass",
    borderRadius: "rounded-full",
    font: "ReadexPro",
    backgroundType: "SOLID",
    customBackground: "#0b1914",
    buttonShadow: "glow",
    socialPosition: "top",
  };

  const sampleLinks = [
    {
      id: "link-1",
      title: "معرض أعمالي",
      url: "https://tariq.design",
      isActive: true,
      position: 0,
    },
    {
      id: "link-2",
      title: "متجر القوالب",
      url: "https://salla.sa/tariq-store",
      isActive: true,
      position: 1,
    },
  ];

  const sampleSocials = [
    { id: "s-1", network: "x", url: "https://x.com/tariq" },
    { id: "s-2", network: "github", url: "https://github.com/tariq" },
  ];

  describe("BioPageContent Theme & Font Application", () => {
    it("should apply resolved backgroundClass, backgroundStyle, and fontClass", () => {
      const html = renderToStaticMarkup(
        <BioPageContent
          profile={sampleProfile}
          username="tariq_dev"
          links={sampleLinks}
          socials={sampleSocials}
          isPreview={true}
        />
      );

      // Background style from customBackground #0b1914
      expect(html).toContain("background-color:#0b1914");
      // Font class for ReadexPro
      expect(html).toContain("font-readex");
      // Display Name & Username
      expect(html).toContain("طارق السعيد");
      expect(html).toContain("@tariq_dev");
    });

    it("should render default theme backgroundClass when backgroundType is THEME", () => {
      const themeProfile = {
        ...sampleProfile,
        backgroundType: "THEME",
        customBackground: null,
      };

      const html = renderToStaticMarkup(
        <BioPageContent
          profile={themeProfile}
          username="tariq_dev"
          links={sampleLinks}
          socials={sampleSocials}
          isPreview={true}
        />
      );

      expect(html).toContain(THEMES.emerald.backgroundClass);
    });
  });

  describe("Social Position Toggling (top vs bottom)", () => {
    it("should render social icons before links when socialPosition is 'top'", () => {
      const html = renderToStaticMarkup(
        <BioPageContent
          profile={{ ...sampleProfile, socialPosition: "top" }}
          username="tariq_dev"
          links={sampleLinks}
          socials={sampleSocials}
          isPreview={true}
        />
      );

      const socialIndex = html.indexOf('title="x"');
      const linkIndex = html.indexOf("معرض أعمالي");

      expect(socialIndex).toBeGreaterThan(-1);
      expect(linkIndex).toBeGreaterThan(-1);
      expect(socialIndex).toBeLessThan(linkIndex);
    });

    it("should render social icons after links when socialPosition is 'bottom'", () => {
      const html = renderToStaticMarkup(
        <BioPageContent
          profile={{ ...sampleProfile, socialPosition: "bottom" }}
          username="tariq_dev"
          links={sampleLinks}
          socials={sampleSocials}
          isPreview={true}
        />
      );

      const socialIndex = html.indexOf('title="x"');
      const linkIndex = html.indexOf("معرض أعمالي");

      expect(socialIndex).toBeGreaterThan(-1);
      expect(linkIndex).toBeGreaterThan(-1);
      expect(socialIndex).toBeGreaterThan(linkIndex);
    });
  });

  describe("ProfileCard Avatar Fallback & Appearance Props", () => {
    it("should render clean initial circle fallback with uppercase first letter when avatarUrl is missing", () => {
      const html = renderToStaticMarkup(
        <ProfileCard
          displayName="سامي الفهد"
          username="sami"
          avatarUrl={null}
        />
      );

      expect(html).toContain("س");
      expect(html).toContain("rounded-full bg-primary/20 text-primary border border-primary/30");
      expect(html).not.toContain("<img");
    });

    it("should render image element when avatarUrl is provided", () => {
      const html = renderToStaticMarkup(
        <ProfileCard
          displayName="سامي الفهد"
          username="sami"
          avatarUrl="https://example.com/avatar.jpg"
        />
      );

      expect(html).toContain("<img");
      expect(html).toContain('src="https://example.com/avatar.jpg"');
    });

    it("should not render social channels inside ProfileCard when socialPosition is 'bottom'", () => {
      const html = renderToStaticMarkup(
        <ProfileCard
          displayName="سامي الفهد"
          username="sami"
          socials={sampleSocials}
          socialPosition="bottom"
        />
      );

      expect(html).not.toContain('title="x"');
      expect(html).not.toContain('title="github"');
    });

    it("should render social channels inside ProfileCard when socialPosition is 'top' or unset", () => {
      const html = renderToStaticMarkup(
        <ProfileCard
          displayName="سامي الفهد"
          username="sami"
          socials={sampleSocials}
        />
      );

      expect(html).toContain('title="x"');
      expect(html).toContain('title="github"');
    });
  });

  describe("LinkButton Styling, Shadows, and Border Radius", () => {
    it("should correctly apply effectiveBorderRadius and avoid undefined in className", () => {
      const html = renderToStaticMarkup(
        <LinkButton
          link={sampleLinks[0]}
          borderRadius="rounded-full"
          buttonStyle="filled"
          isPreview={true}
        />
      );

      expect(html).toContain("rounded-full");
      expect(html).not.toContain("undefined");
    });

    it("should apply buttonShadow and buttonStyle correctly", () => {
      const html = renderToStaticMarkup(
        <LinkButton
          link={sampleLinks[0]}
          buttonStyle="glass"
          buttonShadow="glow"
          isPreview={true}
        />
      );

      expect(html).toContain("backdrop-blur-md");
      expect(html).toContain("shadow-[0_0_20px_rgba(78,222,163,0.35)]");
    });

    it("should apply custom accentColor border when buttonStyle is filled", () => {
      const html = renderToStaticMarkup(
        <LinkButton
          link={sampleLinks[0]}
          buttonStyle="filled"
          accentColor="#10b981"
          isPreview={true}
        />
      );

      expect(html).toContain("border-color:#10b981");
    });
  });
});
