import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LinkAppearanceCustomizer } from "@/features/links/components/LinkAppearanceCustomizer";
import { LinkData } from "@/features/links/types/links.types";

describe("LinkAppearanceCustomizer Component Tests", () => {
  const sampleLink: LinkData = {
    id: "link-1",
    title: "موقعي الشخصي",
    url: "https://example.com",
    position: 0,
    isActive: true,
  };

  it("should render thumbnail section, color pickers, and shadow options", () => {
    const html = renderToStaticMarkup(
      <LinkAppearanceCustomizer link={sampleLink} onUpdate={vi.fn()} />
    );

    expect(html).toContain("الصورة المصغرة للرابط (Thumbnail)");
    expect(html).toContain("رفع صورة");
    expect(html).toContain("رابط خارجي");
    expect(html).toContain("لون خلفية الزر");
    expect(html).toContain("لون الإطار (Border)");
    expect(html).toContain("تأثير الظل والتوهج للرابط");
    expect(html).toContain("بدون ظل");
    expect(html).toContain("نيون متوهج");
  });

  it("should render thumbnail preview and reset button when customized", () => {
    const customizedLink: LinkData = {
      ...sampleLink,
      thumbnailUrl: "/uploads/thumb-car.webp",
      customBgColor: "#ff0000",
      customShadow: "glow",
    };

    const html = renderToStaticMarkup(
      <LinkAppearanceCustomizer link={customizedLink} onUpdate={vi.fn()} />
    );

    expect(html).toContain('src="/uploads/thumb-car.webp"');
    expect(html).toContain("إزالة الصورة");
    expect(html).toContain("استعادة مظهر السمة الافتراضية");
  });

  it("should highlight active shadow style", () => {
    const glowLink: LinkData = {
      ...sampleLink,
      customShadow: "glow",
    };

    const html = renderToStaticMarkup(
      <LinkAppearanceCustomizer link={glowLink} onUpdate={vi.fn()} />
    );

    expect(html).toContain("bg-primary text-on-primary");
  });
});
