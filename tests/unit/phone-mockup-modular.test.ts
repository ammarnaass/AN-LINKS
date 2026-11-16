import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  PhoneMockup,
  PhoneChassis,
  PhoneDynamicIsland,
  PhoneScreenContent,
  FloatingMetricCards,
} from "@/shared/ui";

describe("Modular Phone Mockup Suite (SSR Node Compatibility)", () => {
  it("should render PhoneDynamicIsland with clock and island status pill", () => {
    const html = renderToStaticMarkup(React.createElement(PhoneDynamicIsland));
    expect(html).toContain("9:41");
    expect(html).toContain("bg-black");
    expect(html).toContain("rounded-full");
  });

  it("should render PhoneChassis with titanium buttons and home indicator", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneChassis, null, React.createElement("div", null, "Inner Screen"))
    );
    expect(html).toContain("Inner Screen");
    expect(html).toContain("rounded-[48px]");
    expect(html).toContain("rounded-l-md"); // side hardware button
  });

  it("should render PhoneScreenContent with zero fake data and empty state by default", () => {
    const html = renderToStaticMarkup(React.createElement(PhoneScreenContent));
    // Must NOT contain any hardcoded mock data
    expect(html).not.toContain("فيصل الشمري");
    expect(html).not.toContain("faisal_client");
    expect(html).not.toContain("متجري الرقمي");
    expect(html).not.toContain("photo-1534528741775");
    // Must contain clean zero-data fallback
    expect(html).toContain("لا توجد روابط منشورة حالياً");
    expect(html).toContain("ر"); // fallback letter
    expect(html).toContain("مدعوم بواسطة روابط");
  });

  it("should render PhoneScreenContent with explicit user profile and active links", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "عمار خالد",
        username: "ammar_dev",
        bio: "مطور برمجيات ومهندس حلول سحابية",
        links: [
          { id: "1", title: "موقعي الشخصي", url: "https://ammar.dev", isActive: true },
          { id: "2", title: "مسودة غير منشورة", url: "https://draft.com", isActive: false },
        ],
      })
    );
    expect(html).toContain("عمار خالد");
    expect(html).toContain("@ammar_dev");
    expect(html).toContain("مطور برمجيات ومهندس حلول سحابية");
    expect(html).toContain("موقعي الشخصي");
    // Inactive link must NOT be rendered
    expect(html).not.toContain("مسودة غير منشورة");
    expect(html).toContain("مدعوم بواسطة روابط");
  });

  it("should resolve visual identity tokens including custom background, font, and button shadow", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "نورة القحطاني",
        username: "noura",
        themeKey: "layanDark",
        font: "Tajawal",
        backgroundType: "SOLID",
        customBackground: "#1a1a2e",
        buttonShadow: "glow",
        links: [{ id: "1", title: "حسابي في لينكد إن", url: "https://linkedin.com", isActive: true }],
      })
    );
    expect(html).toContain("font-tajawal");
    expect(html).toContain("background-color:#1a1a2e");
    expect(html).toContain("shadow-[0_0_20px_rgba(78,222,163,0.35)]");
    expect(html).toContain("حسابي في لينكد إن");
  });

  it("should render social icons bar according to socialPosition prop", () => {
    // Top position (default)
    const topHtml = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "سالم",
        socialPosition: "top",
        socials: [{ network: "x", url: "https://x.com" }],
        links: [{ id: "1", title: "رابط رقم 1", url: "https://example.com", isActive: true }],
      })
    );
    const topSocialIdx = topHtml.indexOf("x.com");
    const topLinkIdx = topHtml.indexOf("رابط رقم 1");
    // When top, social icon markup appears before link title in DOM
    const topSvgIdx = topHtml.indexOf("w-3.5 h-3.5");
    expect(topSvgIdx).toBeLessThan(topLinkIdx);

    // Bottom position
    const bottomHtml = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "سالم",
        socialPosition: "bottom",
        socials: [{ network: "x", url: "https://x.com" }],
        links: [{ id: "1", title: "رابط رقم 1", url: "https://example.com", isActive: true }],
      })
    );
    const bottomSvgIdx = bottomHtml.indexOf("w-3.5 h-3.5");
    const bottomLinkIdx = bottomHtml.indexOf("رابط رقم 1");
    expect(bottomSvgIdx).toBeGreaterThan(bottomLinkIdx);
  });

  it("should not render social icons bar when socials array is empty", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "سالم",
        socials: [],
      })
    );
    expect(html).not.toContain("w-3.5 h-3.5");
  });

  it("should render FloatingMetricCards with 3 floating status badges", () => {
    const html = renderToStaticMarkup(React.createElement(FloatingMetricCards));
    expect(html).toContain("مبيعات فورية");
    expect(html).toContain("+149 ر.س");
    expect(html).toContain("حالة الروابط");
    expect(html).toContain("100% نشطة");
    expect(html).toContain("إجمالي الزيارات");
    expect(html).toContain("+14,280");
  });

  it("should render master PhoneMockup uniting chassis, island, and screen", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneMockup, {
        displayName: "سارة القرني",
        username: "sara_tech",
        showFloatingCards: true,
      })
    );
    expect(html).toContain("سارة القرني");
    expect(html).toContain("@sara_tech");
    expect(html).toContain("مبيعات فورية"); // Floating card
    expect(html).toContain("9:41"); // Dynamic island
  });
});
