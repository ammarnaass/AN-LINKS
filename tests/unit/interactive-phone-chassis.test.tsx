import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PhoneChassis } from "@/shared/ui/phone/PhoneChassis";
import { PhoneDynamicIsland } from "@/shared/ui/phone/PhoneDynamicIsland";

describe("Upgraded Realistic Phone Chassis & Dynamic Island", () => {
  it("renders PhoneChassis with default titanium finish and side buttons", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneChassis, null, React.createElement("div", null, "Screen Content"))
    );
    expect(html).toContain("Screen Content");
    expect(html).toContain("rounded-[48px]");
    // Side button indicators
    expect(html).toContain("action-button");
    expect(html).toContain("volume-up");
  });

  it("supports obsidian and gold finishes in PhoneChassis", () => {
    const obsidianHtml = renderToStaticMarkup(
      React.createElement(PhoneChassis, { finish: "obsidian", children: "Screen" })
    );
    expect(obsidianHtml).toContain("from-[#0d121c]");

    const goldHtml = renderToStaticMarkup(
      React.createElement(PhoneChassis, { finish: "gold", children: "Screen" })
    );
    expect(goldHtml).toContain("from-[#2e2619]");
  });

  it("renders PhoneDynamicIsland with interactive pill and battery indicators", () => {
    const html = renderToStaticMarkup(React.createElement(PhoneDynamicIsland));
    expect(html).toContain("dynamic-island-pill");
    expect(html).toContain("lucide-wifi");
    expect(html).toContain("lucide-battery");
  });
});
