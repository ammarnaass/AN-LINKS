import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandLogo } from "@/shared/ui";

describe("BrandLogo LTR Integrity Test Suite", () => {
  it("should enforce dir='ltr' to prevent reversed rendering in Arabic RTL", () => {
    const html = renderToStaticMarkup(React.createElement(BrandLogo, { variant: "full" }));

    // Container must have dir="ltr"
    expect(html).toContain('dir="ltr"');

    // AN must precede LINKS in DOM order
    const anIndex = html.indexOf(">AN<");
    const linksIndex = html.indexOf(">LINKS<");
    expect(anIndex).toBeGreaterThan(-1);
    expect(linksIndex).toBeGreaterThan(-1);
    expect(anIndex).toBeLessThan(linksIndex);

    // Emblem must precede text in DOM order
    const svgIndex = html.indexOf("<svg");
    expect(svgIndex).toBeLessThan(anIndex);
  });

  it("should preserve LTR direction in minimal variant", () => {
    const html = renderToStaticMarkup(React.createElement(BrandLogo, { variant: "minimal" }));
    expect(html).toContain('dir="ltr"');
    const anIndex = html.indexOf(">AN<");
    const linksIndex = html.indexOf(">LINKS<");
    expect(anIndex).toBeLessThan(linksIndex);
  });
});
