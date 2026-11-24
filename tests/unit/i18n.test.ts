import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ar,
  en,
  fr,
  getDictionary,
  isRtl,
  getDirection,
  getFontClass,
  normalizeLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from "@/shared/i18n";
import { LanguageSwitcher } from "@/shared/ui/i18n/LanguageSwitcher";
import { I18nProvider } from "@/shared/i18n/context/I18nProvider";

describe("i18n Multilingual System Suite (AR / EN / FR)", () => {
  it("has complete dictionary key parity between ar, en, and fr", () => {
    function getKeys(obj: Record<string, any>, prefix = ""): string[] {
      if (!obj || typeof obj !== "object") return [];
      return Object.entries(obj).flatMap(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        return typeof value === "object" && value !== null
          ? getKeys(value, fullKey)
          : [fullKey];
      });
    }

    const arKeys = getKeys(ar).sort();
    const enKeys = getKeys(en).sort();
    const frKeys = getKeys(fr).sort();

    expect(enKeys).toEqual(arKeys);
    expect(frKeys).toEqual(arKeys);
  });

  it("resolves direction and fonts accurately per locale", () => {
    expect(isRtl("ar")).toBe(true);
    expect(isRtl("en")).toBe(false);
    expect(isRtl("fr")).toBe(false);

    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("fr")).toBe("ltr");

    expect(getFontClass("ar")).toBe("font-cairo");
    expect(getFontClass("en")).toBe("font-sans");
    expect(getFontClass("fr")).toBe("font-sans");
  });

  it("normalizes locale codes safely with fallback to ar", () => {
    expect(normalizeLocale("ar")).toBe("ar");
    expect(normalizeLocale("ar-SA")).toBe("ar");
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("fr")).toBe("fr");
    expect(normalizeLocale("fr-FR")).toBe("fr");
    expect(normalizeLocale("unknown")).toBe("ar");
    expect(normalizeLocale(null)).toBe("ar");
  });

  it("renders LanguageSwitcher in minimal variant with globe icon and flag", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        { initialLocale: "ar" },
        React.createElement(LanguageSwitcher, { variant: "minimal" })
      )
    );
    expect(html).toContain("🇸🇦");
    expect(html).toContain("AR");
  });

  it("renders LanguageSwitcher in pills variant displaying all 3 languages", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        { initialLocale: "en" },
        React.createElement(LanguageSwitcher, { variant: "pills" })
      )
    );
    expect(html).toContain("العربية");
    expect(html).toContain("English");
    expect(html).toContain("Français");
  });

  it("renders LanguageSwitcher in dropdown variant", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        { initialLocale: "fr" },
        React.createElement(LanguageSwitcher, { variant: "dropdown" })
      )
    );
    expect(html).toContain("🇫🇷");
    expect(html).toContain("Français");
  });
});
