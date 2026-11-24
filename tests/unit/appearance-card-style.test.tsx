import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CardStylePicker } from "@/features/appearance/components/CardStylePicker";
import { resolveThemeStyles } from "@/features/appearance/utils/theme-resolver";
import { CARD_STYLES } from "@/features/appearance/constants/theme-tokens";

describe("CardStylePicker & Theme Card Resolver Tests", () => {
  describe("CardStylePicker Component", () => {
    it("should render all four card style options", () => {
      const html = renderToStaticMarkup(
        <CardStylePicker
          cardStyle="glass"
          onCardStyleChange={vi.fn()}
        />
      );

      expect(html).toContain("نمط بطاقة الحاوية (Card Style)");
      expect(html).toContain("زجاجي شفاف (Glass)");
      expect(html).toContain("مسمط معتم (Solid)");
      expect(html).toContain("نيون مشع (Glow)");
      expect(html).toContain("مفرغ أنيق (Outline)");
    });

    it("should render active ring and check indicator on selected option", () => {
      const html = renderToStaticMarkup(
        <CardStylePicker
          cardStyle="glow"
          onCardStyleChange={vi.fn()}
        />
      );

      // Should indicate glow style is selected
      expect(html).toContain("ring-2 ring-primary/40");
    });
  });

  describe("Theme Card Resolver", () => {
    it("should resolve glass cardStyle correctly", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        cardStyle: "glass",
      });

      expect(styles.cardClass).toBe(CARD_STYLES.glass);
      expect(styles.cardClass).toContain("backdrop-blur-xl");
    });

    it("should resolve solid cardStyle correctly", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        cardStyle: "solid",
      });

      expect(styles.cardClass).toBe(CARD_STYLES.solid);
      expect(styles.cardClass).toContain("bg-surface-container-low");
    });

    it("should resolve glow cardStyle correctly with button effect", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        cardStyle: "glow",
      });

      expect(styles.cardClass).toBe(CARD_STYLES.glow);
      expect(styles.cardClass).toContain("border-primary/50");
      expect(styles.buttonClass).toContain("hover:border-primary/60");
    });

    it("should resolve outline cardStyle correctly", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        cardStyle: "outline",
      });

      expect(styles.cardClass).toBe(CARD_STYLES.outline);
      expect(styles.cardClass).toContain("bg-transparent");
    });

    it("should fallback gracefully if cardStyle is unspecified", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
      });

      // Default fallback is theme cardClass or glass
      expect(styles.cardClass).toBeDefined();
      expect(styles.cardClass.length).toBeGreaterThan(0);
    });
  });
});
