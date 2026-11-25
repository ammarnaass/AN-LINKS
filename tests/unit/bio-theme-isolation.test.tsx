import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as fs from "node:fs";
import * as path from "node:path";
import { resolveThemeStyles } from "@/features/appearance/utils/theme-resolver";
import { THEMES } from "@/features/appearance/constants/theme-presets";
import { BioPageContent } from "@/features/bio/components/BioPageContent";
import { I18nProvider } from "@/shared/i18n";

describe("Bio Page Light/Dark Theme Isolation Suite", () => {
  it("defines carbonDark, minimalWarm, and lavender presets with accurate isDark polarity", () => {
    expect(THEMES.carbonDark.isDark).toBe(true);
    expect(THEMES.layanDark.isDark).toBe(true);
    expect(THEMES.emerald.isDark).toBe(true);
    expect(THEMES.sunset.isDark).toBe(true);

    expect(THEMES.minimalWarm.isDark).toBe(false);
    expect(THEMES.lavender.isDark).toBe(false);
    expect(THEMES.rawabetLight.isDark).toBe(false);
    expect(THEMES.pureWhite.isDark).toBe(false);
  });

  it("resolves font aliases for IBM Plex Sans Arabic and Readex Pro", () => {
    expect(resolveThemeStyles({ font: "IBM Plex Sans Arabic" }).fontClass).toBe("font-plex");
    expect(resolveThemeStyles({ font: "Readex Pro" }).fontClass).toBe("font-readex");
  });

  it("renders bio-theme-dark container on dark creator profiles regardless of global site theme", () => {
    const html = renderToStaticMarkup(
      <I18nProvider initialLocale="ar">
        <BioPageContent
          username="faisal_tech"
          profile={{
            displayName: "فيصل السيف",
            themeKey: "carbonDark",
            backgroundType: "IMAGE",
            customBackground: "https://example.com/bg.jpg",
            bgOverlayOpacity: 65,
            cardStyle: "glass",
            buttonStyle: "glass",
            font: "Cairo",
          }}
          links={[{ id: "l1", title: "يوتيوب", url: "https://youtube.com", isActive: true, position: 0 }]}
          socials={[]}
          isPreview={true}
        />
      </I18nProvider>
    );

    expect(html).toContain("bio-theme-dark");
    expect(html).not.toContain("bio-theme-light");
  });

  it("renders bio-theme-light container on light creator profiles", () => {
    const html = renderToStaticMarkup(
      <I18nProvider initialLocale="ar">
        <BioPageContent
          username="omfarooq"
          profile={{
            displayName: "عمر فاروق",
            themeKey: "minimalWarm",
            cardStyle: "solid",
            buttonStyle: "filled",
            font: "Tajawal",
          }}
          links={[]}
          socials={[]}
          isPreview={true}
        />
      </I18nProvider>
    );

    expect(html).toContain("bio-theme-light");
    expect(html).not.toContain("bio-theme-dark");
  });

  it("scopes .bio-theme-light and .bio-theme-dark CSS tokens in globals.css", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toContain(".bio-theme-light");
    expect(css).toContain(".bio-theme-dark");
  });
});
