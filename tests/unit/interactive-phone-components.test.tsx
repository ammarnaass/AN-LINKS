import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PhoneBrowserBar } from "@/shared/ui/phone/PhoneBrowserBar";
import { PhoneInteractiveLink } from "@/shared/ui/phone/PhoneInteractiveLink";

describe("Interactive Phone UI Components (Browser Bar & Interactive Link)", () => {
  it("renders PhoneBrowserBar with SSL lock and formatted anlinks.dev URL", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneBrowserBar, {
        username: "fathi",
      })
    );
    expect(html).toContain("anlinks.dev/fathi");
    expect(html).toContain("lucide-lock");
    expect(html).toContain("lucide-rotate-cw");
  });

  it("renders PhoneInteractiveLink with thumbnail and custom colors", () => {
    const html = renderToStaticMarkup(
      React.createElement(PhoneInteractiveLink, {
        link: {
          id: "link-1",
          title: "معرض سيارات الجزائر",
          url: "https://example.com/cars",
          thumbnailUrl: "https://example.com/thumb.jpg",
          customBgColor: "#ff0000",
          customTextColor: "#ffffff",
        },
        buttonClass: "rounded-xl",
      })
    );

    expect(html).toContain("معرض سيارات الجزائر");
    expect(html).toContain("background-color:#ff0000");
    expect(html).toContain("color:#ffffff");
    expect(html).toContain("https://example.com/thumb.jpg");
    expect(html).toContain("interactive-link-btn");
  });
});
