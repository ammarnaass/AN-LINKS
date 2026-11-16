import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PhoneMockup, PhoneScreenContent } from "@/shared/ui";
import {
  THEMES,
  FONTS,
  BUTTON_STYLES,
  BUTTON_SHADOWS,
  BORDER_RADIUS_MAP,
} from "@/features/appearance";

describe("PhoneMockup & PhoneScreenContent Live Visual Reflection Suite", () => {
  const sampleLinks = [
    { id: "link-1", title: "موقعي الشخصي", url: "https://ammar.dev", isActive: true },
    { id: "link-2", title: "متجري الإلكتروني", url: "https://salla.sa/store", isActive: true },
  ];

  const sampleSocials = [
    { network: "x", url: "https://x.com/developer" },
    { network: "github", url: "https://github.com/developer" },
  ];

  describe("1. All 12 Themes Applied to Mockup and Screen", () => {
    const canonicalThemeKeys = [
      "layanDark",
      "rawabetLight",
      "emerald",
      "neonPurple",
      "oceanBlue",
      "sunsetFire",
      "desertSand",
      "slateMinimal",
      "rosePastel",
      "cyberDark",
      "freshDawn",
      "pureWhite",
    ];

    it.each(canonicalThemeKeys)(
      "should correctly reflect theme '%s' in PhoneScreenContent",
      (themeKey) => {
        const theme = THEMES[themeKey];
        expect(theme).toBeDefined();

        const html = renderToStaticMarkup(
          <PhoneScreenContent
            displayName="فيصل السديري"
            username="faisal"
            themeKey={themeKey}
            links={sampleLinks}
          />
        );

        // Verify background class from the theme
        expect(html).toContain(theme.backgroundClass);
        // Verify primary text color class
        expect(html).toContain(theme.textPrimary);
        // Verify base button class from the theme is present
        expect(html).toContain(theme.buttonClass);
      }
    );

    it.each(canonicalThemeKeys)(
      "should correctly reflect theme '%s' inside the master PhoneMockup chassis",
      (themeKey) => {
        const theme = THEMES[themeKey];
        const html = renderToStaticMarkup(
          <PhoneMockup
            displayName="سارة التميمي"
            username="sara"
            themeKey={themeKey}
            links={sampleLinks}
            showFloatingCards={false}
          />
        );

        // Master mockup renders DynamicIsland and PhoneChassis
        expect(html).toContain("9:41");
        expect(html).toContain(theme.backgroundClass);
        expect(html).toContain("سارة التميمي");
      }
    );
  });

  describe("2. Custom Background Reflection (Solid Hex & Gradient)", () => {
    it("should reflect Solid Hex custom background (#0f172a) and remove default theme background class", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="عبدالله الزهراني"
          username="abdullah"
          backgroundType="SOLID"
          customBackground="#0f172a"
          links={sampleLinks}
        />
      );

      // Verify inline background-color style is applied
      expect(html).toContain("background-color:#0f172a");
      // Default theme background class should be omitted when custom background is active
      expect(html).not.toContain(THEMES.layanDark.backgroundClass);
    });

    it("should reflect Gradient custom background and remove default theme background class", () => {
      const gradient = "linear-gradient(135deg, #1e1b4b, #0f172a)";
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="ريم الحربي"
          username="reem"
          backgroundType="GRADIENT"
          customBackground={gradient}
          links={sampleLinks}
        />
      );

      // Verify inline background style contains the linear gradient
      expect(html).toContain("background:linear-gradient(135deg, #1e1b4b, #0f172a)");
      expect(html).not.toContain(THEMES.layanDark.backgroundClass);
    });

    it("should reflect custom background within full PhoneMockup wrapper", () => {
      const gradient = "linear-gradient(135deg, #1e1b4b, #0f172a)";
      const html = renderToStaticMarkup(
        <PhoneMockup
          displayName="خالد العتيبي"
          username="khaled"
          backgroundType="GRADIENT"
          customBackground={gradient}
          links={sampleLinks}
          showFloatingCards={false}
        />
      );

      expect(html).toContain("background:linear-gradient(135deg, #1e1b4b, #0f172a)");
      expect(html).toContain("9:41");
    });

    it("should fallback to theme background when custom background is malicious or invalid", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="فهد الدوسري"
          username="fahad"
          themeKey="oceanBlue"
          backgroundType="SOLID"
          customBackground="url('https://malicious.site/hack.png')"
          links={sampleLinks}
        />
      );

      // Should sanitize and fall back safely to oceanBlue background class
      expect(html).toContain(THEMES.oceanBlue.backgroundClass);
      expect(html).not.toContain("url(");
    });
  });

  describe("3. All 4 Button Styles Reflection", () => {
    const buttonStyles = ["filled", "glass", "soft", "outline"] as const;

    it.each(buttonStyles)(
      "should apply button style '%s' to active links inside PhoneScreenContent",
      (style) => {
        const html = renderToStaticMarkup(
          <PhoneScreenContent
            displayName="منصور الشمري"
            buttonStyle={style}
            links={sampleLinks}
          />
        );

        const expectedModifier = BUTTON_STYLES[style];
        expect(html).toContain(expectedModifier);
        expect(html).toContain("موقعي الشخصي");
      }
    );

    it("should apply glass button styling across PhoneMockup links", () => {
      const html = renderToStaticMarkup(
        <PhoneMockup
          displayName="نوف الرشيدي"
          buttonStyle="glass"
          links={sampleLinks}
          showFloatingCards={false}
        />
      );

      expect(html).toContain("backdrop-blur-md");
      expect(html).toContain("موقعي الشخصي");
    });
  });

  describe("4. All 4 Button Shadows Reflection", () => {
    const shadows = ["none", "soft", "strong", "glow"] as const;

    it.each(shadows)(
      "should apply button shadow '%s' to active link buttons",
      (shadow) => {
        const html = renderToStaticMarkup(
          <PhoneScreenContent
            displayName="بدر المطيري"
            buttonShadow={shadow}
            links={sampleLinks}
          />
        );

        const expectedShadow = BUTTON_SHADOWS[shadow];
        expect(html).toContain(expectedShadow);
      }
    );

    it("should render glow shadow with emerald accent tint in PhoneMockup", () => {
      const html = renderToStaticMarkup(
        <PhoneMockup
          displayName="ياسر العمري"
          buttonShadow="glow"
          links={sampleLinks}
          showFloatingCards={false}
        />
      );

      expect(html).toContain("shadow-[0_0_20px_rgba(78,222,163,0.35)]");
    });
  });

  describe("5. All 4 Border Radiuses Reflection", () => {
    const radiuses = [
      "rounded-none",
      "rounded-md",
      "rounded-xl",
      "rounded-full",
    ] as const;

    it.each(radiuses)(
      "should apply border radius '%s' to link buttons in PhoneScreenContent",
      (radius) => {
        const html = renderToStaticMarkup(
          <PhoneScreenContent
            displayName="ماجد القحطاني"
            borderRadius={radius}
            links={sampleLinks}
          />
        );

        const expectedRadius = BORDER_RADIUS_MAP[radius];
        expect(html).toContain(expectedRadius);
        expect(html).toContain("موقعي الشخصي");
      }
    );
  });

  describe("6. All 5 Arabic Fonts Reflection", () => {
    const fonts = ["Cairo", "Tajawal", "IBMPlex", "Almarai", "ReadexPro"] as const;

    it.each(fonts)(
      "should apply font family class for font '%s' to PhoneScreenContent container",
      (font) => {
        const fontConfig = FONTS[font];
        expect(fontConfig).toBeDefined();

        const html = renderToStaticMarkup(
          <PhoneScreenContent
            displayName="لمى الشهري"
            font={font}
            links={sampleLinks}
          />
        );

        expect(html).toContain(fontConfig.className);
      }
    );

    it("should apply selected font class within full PhoneMockup", () => {
      const html = renderToStaticMarkup(
        <PhoneMockup
          displayName="منى السبيعي"
          font="ReadexPro"
          links={sampleLinks}
          showFloatingCards={false}
        />
      );

      expect(html).toContain("font-readex");
    });
  });

  describe("7. Strict Zero Fake Data Compliance", () => {
    it("should render avatar initial letter circle when avatarUrl is null", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="طارق العبدلي"
          avatarUrl={null}
          links={sampleLinks}
        />
      );

      // Must render initial letter container
      expect(html).toContain("ط");
      expect(html).toContain("text-2xl");
      // Must not render <img> tag
      expect(html).not.toContain("<img");
      // Must not contain any external fake image source (Unsplash, etc.)
      expect(html).not.toContain("unsplash.com");
      expect(html).not.toContain("photo-1534528741775");
    });

    it("should render avatar initial letter circle when avatarUrl is undefined", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="سعود بن ناصر"
          avatarUrl={undefined}
          links={sampleLinks}
        />
      );

      expect(html).toContain("س");
      expect(html).toContain("text-2xl");
      expect(html).not.toContain("<img");
    });

    it("should render real avatar <img> when avatarUrl is provided", () => {
      const customAvatar = "https://images.anlinks.dev/avatars/real-user.jpg";
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="سعود بن ناصر"
          avatarUrl={customAvatar}
          links={sampleLinks}
        />
      );

      expect(html).toContain("<img");
      expect(html).toContain(customAvatar);
    });

    it("should render clean empty state when links array is empty", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="هند البلوشي"
          username="hind"
          links={[]}
        />
      );

      // Clean empty state message
      expect(html).toContain("لا توجد روابط منشورة حالياً");
      // Zero mock links
      expect(html).not.toContain("متجري الرقمي");
      expect(html).not.toContain("فيصل الشمري");
      expect(html).not.toContain("faisal_client");
    });

    it("should render clean empty state when all provided links are inactive", () => {
      const inactiveLinks = [
        { id: "1", title: "رابط مسودة 1", url: "https://draft1.com", isActive: false },
        { id: "2", title: "رابط مسودة 2", url: "https://draft2.com", isActive: false },
      ];

      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="هند البلوشي"
          username="hind"
          links={inactiveLinks}
        />
      );

      expect(html).toContain("لا توجد روابط منشورة حالياً");
      expect(html).not.toContain("رابط مسودة 1");
      expect(html).not.toContain("رابط مسودة 2");
    });
  });

  describe("8. Social Position Reordering (Top vs Bottom)", () => {
    it("should position social icons BEFORE links when socialPosition is 'top'", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="وليد الشريف"
          socialPosition="top"
          socials={sampleSocials}
          links={sampleLinks}
        />
      );

      const socialIdx = html.indexOf("bg-surface-container/70");
      const linkIdx = html.indexOf("موقعي الشخصي");

      expect(socialIdx).toBeGreaterThan(-1);
      expect(linkIdx).toBeGreaterThan(-1);
      expect(socialIdx).toBeLessThan(linkIdx);
    });

    it("should position social icons AFTER links when socialPosition is 'bottom'", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="وليد الشريف"
          socialPosition="bottom"
          socials={sampleSocials}
          links={sampleLinks}
        />
      );

      const socialIdx = html.indexOf("bg-surface-container/70");
      const linkIdx = html.indexOf("موقعي الشخصي");

      expect(socialIdx).toBeGreaterThan(-1);
      expect(linkIdx).toBeGreaterThan(-1);
      expect(socialIdx).toBeGreaterThan(linkIdx);
    });

    it("should not render any social icons wrapper if socials list is empty", () => {
      const html = renderToStaticMarkup(
        <PhoneScreenContent
          displayName="وليد الشريف"
          socials={[]}
          links={sampleLinks}
        />
      );

      expect(html).not.toContain("bg-surface-container/70");
      expect(html).not.toContain("w-7 h-7 rounded-full");
    });
  });

  describe("9. PhoneMockup Master Integration Test", () => {
    it("combines all customized identity parameters simultaneously in PhoneMockup", () => {
      const html = renderToStaticMarkup(
        <PhoneMockup
          displayName="جمال بن حمد"
          username="jamal"
          bio="رائد أعمال تقني"
          themeKey="sunsetFire"
          buttonStyle="glass"
          buttonShadow="glow"
          borderRadius="rounded-full"
          font="ReadexPro"
          backgroundType="SOLID"
          customBackground="#1a0c0c"
          socialPosition="bottom"
          socials={sampleSocials}
          links={sampleLinks}
          showFloatingCards={true}
        />
      );

      // Chassis & Dynamic Island
      expect(html).toContain("9:41");
      expect(html).toContain("rounded-[48px]");
      // Floating cards
      expect(html).toContain("مبيعات فورية");
      // Typography
      expect(html).toContain("font-readex");
      // Background custom solid
      expect(html).toContain("background-color:#1a0c0c");
      // Button styling & shadow & radius
      expect(html).toContain("backdrop-blur-md");
      expect(html).toContain("shadow-[0_0_20px_rgba(78,222,163,0.35)]");
      expect(html).toContain("rounded-full");
      // Content & Branding
      expect(html).toContain("جمال بن حمد");
      expect(html).toContain("@jamal");
      expect(html).toContain("رائد أعمال تقني");
      expect(html).toContain("مدعوم بواسطة روابط | AN LINKS");
    });
  });
});
