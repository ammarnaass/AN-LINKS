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

  it("should render PhoneScreenContent with profile, links, and branding", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneScreenContent, {
        displayName: "فيصل الشمري",
        username: "faisal_client",
        bio: "صانع محتوى وتجارة رقمية",
        links: [
          { id: "1", title: "متجري الرقمي", url: "https://store.anlinks.dev", isActive: true },
          { id: "2", title: "رابط معطل", url: "https://draft.com", isActive: false },
        ],
      })
    );
    expect(html).toContain("فيصل الشمري");
    expect(html).toContain("@faisal_client");
    expect(html).toContain("صانع محتوى وتجارة رقمية");
    expect(html).toContain("متجري الرقمي");
    // Inactive link must NOT be rendered
    expect(html).not.toContain("رابط معطل");
    expect(html).toContain("مدعوم بواسطة روابط");
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

