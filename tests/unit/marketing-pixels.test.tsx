import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/script", () => {
  return {
    default: ({ src, children, id }: any) => {
      return React.createElement("script", { "data-testid": id || "script", src }, children);
    },
  };
});

import { TrackingPixels } from "@/features/bio/components/TrackingPixels";
import { ProfileData } from "@/features/bio/types/bio.types";

describe("Marketing Pixels Component Tests", () => {
  const baseProfile: ProfileData = {
    displayName: "عمار للاختبار",
    isPublished: true,
  };

  it("returns null when isPreview is true", () => {
    const profileWithPixels: ProfileData = {
      ...baseProfile,
      googleAnalyticsId: "G-1234567890",
      metaPixelId: "987654321012345",
    };

    const html = renderToStaticMarkup(
      React.createElement(TrackingPixels, { profile: profileWithPixels, isPreview: true })
    );
    expect(html).toBe("");
  });

  it("renders Google Analytics tag when valid GA ID is provided", () => {
    const profile: ProfileData = {
      ...baseProfile,
      googleAnalyticsId: "G-ABC123XYZ0",
    };

    const html = renderToStaticMarkup(
      React.createElement(TrackingPixels, { profile, isPreview: false })
    );
    expect(html).toContain("googletagmanager.com/gtag/js?id=G-ABC123XYZ0");
    expect(html).toContain("G-ABC123XYZ0");
  });

  it("renders Meta Pixel tag when valid Meta Pixel ID is provided", () => {
    const profile: ProfileData = {
      ...baseProfile,
      metaPixelId: "123456789012345",
    };

    const html = renderToStaticMarkup(
      React.createElement(TrackingPixels, { profile, isPreview: false })
    );
    expect(html).toContain("connect.facebook.net/en_US/fbevents.js");
    expect(html).toContain("123456789012345");
  });

  it("renders TikTok Pixel and Snapchat Pixel tags", () => {
    const profile: ProfileData = {
      ...baseProfile,
      tiktokPixelId: "C6XYZ123456789",
      snapchatPixelId: "snap-pixel-id-001",
    };

    const html = renderToStaticMarkup(
      React.createElement(TrackingPixels, { profile, isPreview: false })
    );
    expect(html).toContain("analytics.tiktok.com/i18n/pixel/events.js");
    expect(html).toContain("C6XYZ123456789");
    expect(html).toContain("sc-static.net/scevent.min.js");
    expect(html).toContain("snap-pixel-id-001");
  });

  it("safely skips malicious or invalid pixel IDs with quotes or scripts", () => {
    const profile: ProfileData = {
      ...baseProfile,
      googleAnalyticsId: `G-TEST"; alert(1); //`,
      metaPixelId: `<script>alert('xss')</script>`,
    };

    const html = renderToStaticMarkup(
      React.createElement(TrackingPixels, { profile, isPreview: false })
    );
    expect(html).not.toContain("alert");
  });
});
