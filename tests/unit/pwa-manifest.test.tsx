import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PwaInstallPrompt } from "@/shared/ui/PwaInstallPrompt";

describe("Progressive Web App (PWA) Manifest & Service Worker Suite", () => {
  const manifestPath = path.join(process.cwd(), "public", "manifest.webmanifest");
  const swPath = path.join(process.cwd(), "public", "sw.js");

  it("verifies manifest.webmanifest exists and meets PWA installability criteria", () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const content = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(content);

    // Basic app identity
    expect(manifest.name).toContain("AN LINKS");
    expect(manifest.short_name).toBe("AN LINKS");
    expect(manifest.start_url).toBe("/dashboard");

    // Display & Orientation
    expect(manifest.display).toBe("standalone");
    expect(manifest.orientation).toBe("portrait");

    // Localization
    expect(manifest.dir).toBe("rtl");
    expect(manifest.lang).toBe("ar");

    // Theming & Colors
    expect(manifest.background_color).toBe("#0a0e17");
    expect(manifest.theme_color).toBe("#4edea3");

    // Icon array verification
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    const icon192 = manifest.icons.find((i: { sizes: string }) => i.sizes.includes("192x192"));
    expect(icon192).toBeDefined();
  });

  it("verifies service worker (sw.js) exists with lifecycle event listeners", () => {
    expect(fs.existsSync(swPath)).toBe(true);
    const swContent = fs.readFileSync(swPath, "utf-8");

    expect(swContent).toContain("an-links-cache-v1");
    expect(swContent).toContain("self.addEventListener(\"install\"");
    expect(swContent).toContain("self.addEventListener(\"activate\"");
    expect(swContent).toContain("self.addEventListener(\"fetch\"");
    expect(swContent).toContain("self.skipWaiting()");
    expect(swContent).toContain("self.clients.claim()");
  });

  it("renders PwaInstallPrompt safely in SSR environment without errors", () => {
    // When running in SSR, initial state is not visible
    const html = renderToStaticMarkup(<PwaInstallPrompt />);
    expect(typeof html).toBe("string");
  });
});
