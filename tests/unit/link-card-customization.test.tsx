import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LinkCardItem } from "@/features/links/components/LinkCardItem";
import { LinkData } from "@/features/links/types/links.types";

describe("LinkCardItem Customization Integration Tests", () => {
  const standardLink: LinkData = {
    id: "l-1",
    title: "رابط افتراضي",
    url: "https://example.com",
    position: 0,
    isActive: true,
  };

  const customizedLink: LinkData = {
    id: "l-2",
    title: "رابط مخصص",
    url: "https://custom.com",
    position: 1,
    isActive: true,
    thumbnailUrl: "/uploads/thumb-sample.webp",
    customBgColor: "#123456",
    customShadow: "glow",
  };

  it("should render customize button (palette) in actions toolbar", () => {
    const html = renderToStaticMarkup(
      <LinkCardItem
        link={standardLink}
        index={0}
        totalCount={1}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onMove={vi.fn()}
      />
    );

    expect(html).toContain('title="تخصيص مظهر الرابط"');
    expect(html).not.toContain("مظهر مخصص");
  });

  it("should display custom appearance badge and thumbnail image when present", () => {
    const html = renderToStaticMarkup(
      <LinkCardItem
        link={customizedLink}
        index={0}
        totalCount={1}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onMove={vi.fn()}
      />
    );

    expect(html).toContain("مظهر مخصص");
    expect(html).toContain('src="/uploads/thumb-sample.webp"');
  });
});
