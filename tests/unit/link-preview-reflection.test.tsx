import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PhoneScreenContent } from "@/shared/ui/phone/PhoneScreenContent";
import { LinkButton } from "@/features/bio/components/LinkButton";
import { LinkItem } from "@/features/bio/types/bio.types";

describe("Link Customization Preview & Public Reflection Tests", () => {
  const customizedLink: LinkItem = {
    id: "link-custom",
    title: "سيارة فاخرة للبيع",
    url: "https://cars.example.com",
    isActive: true,
    position: 0,
    thumbnailUrl: "/uploads/thumb-luxury-car.webp",
    customBgColor: "#0f172a",
    customTextColor: "#38bdf8",
    customBorderColor: "#f59e0b",
    customShadow: "glow",
  };

  it("should render customized link inside PhoneScreenContent with thumbnail and custom styles", () => {
    const html = renderToStaticMarkup(
      <PhoneScreenContent
        username="fathi"
        displayName="فتحي القشطي"
        links={[customizedLink]}
      />
    );

    expect(html).toContain("سيارة فاخرة للبيع");
    expect(html).toContain('src="/uploads/thumb-luxury-car.webp"');
    expect(html).toContain("background-color:#0f172a");
    expect(html).toContain("color:#38bdf8");
    expect(html).toContain("border-color:#f59e0b");
    expect(html).toContain("shadow-[0_0_15px_rgba(78,222,163,0.35)]");
  });

  it("should render customized link inside LinkButton for public bio page with thumbnail and styles", () => {
    const html = renderToStaticMarkup(
      <LinkButton
        link={customizedLink}
        themeKey="carbonDark"
        isPreview={false}
      />
    );

    expect(html).toContain("سيارة فاخرة للبيع");
    expect(html).toContain('src="/uploads/thumb-luxury-car.webp"');
    expect(html).toContain("background-color:#0f172a");
    expect(html).toContain("color:#38bdf8");
    expect(html).toContain("border-color:#f59e0b");
    expect(html).toContain("shadow-[0_0_20px_rgba(78,222,163,0.35)]");
  });

  it("should render standard link without thumbnail falling back to Globe icon", () => {
    const defaultLink: LinkItem = {
      id: "link-default",
      title: "رابط افتراضي",
      url: "https://standard.com",
      isActive: true,
      position: 0,
    };

    const html = renderToStaticMarkup(
      <LinkButton
        link={defaultLink}
        themeKey="layanDark"
        isPreview={false}
      />
    );

    expect(html).toContain("رابط افتراضي");
    // Globe icon should be present, thumbnail image should not
    expect(html).not.toContain("<img");
  });
});
