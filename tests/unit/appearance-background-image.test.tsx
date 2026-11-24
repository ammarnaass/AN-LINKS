import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BackgroundImagePicker } from "@/features/appearance/components/BackgroundImagePicker";
import { resolveThemeStyles } from "@/features/appearance/utils/theme-resolver";

describe("BackgroundImagePicker & Theme Image Resolver Tests", () => {
  describe("BackgroundImagePicker Component", () => {
    it("should render upload button, overlay slider, and curated image presets", () => {
      const html = renderToStaticMarkup(
        <BackgroundImagePicker
          customBackground="https://images.unsplash.com/photo-test"
          bgOverlayOpacity={40}
          onImageChange={vi.fn()}
          onOverlayOpacityChange={vi.fn()}
        />
      );

      expect(html).toContain("رفع صورة من جهازك");
      expect(html).toContain("نسبة التعتيم على الصورة (Overlay)");
      expect(html).toContain("40%");
      expect(html).toContain("خلفيات سينمائية مقترحة (6 صور جاهزة)");
      expect(html).toContain("تجريدي داكن");
      expect(html).toContain("إزالة الخلفية");
    });

    it("should display custom opacity value", () => {
      const html = renderToStaticMarkup(
        <BackgroundImagePicker
          customBackground={null}
          bgOverlayOpacity={65}
          onImageChange={vi.fn()}
          onOverlayOpacityChange={vi.fn()}
        />
      );

      expect(html).toContain("65%");
      expect(html).not.toContain("إزالة الخلفية");
    });
  });

  describe("Theme Resolver with IMAGE background", () => {
    it("should generate backgroundStyle with url and overlayStyle with rgba", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        backgroundType: "IMAGE",
        customBackground: "https://images.unsplash.com/photo-sample",
        bgOverlayOpacity: 50,
      });

      expect(styles.backgroundClass).toContain("bg-cover");
      expect(styles.backgroundStyle).toEqual({
        backgroundImage: "url(https://images.unsplash.com/photo-sample)",
      });
      expect(styles.overlayStyle).toEqual({
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      });
    });

    it("should handle /uploads/ images securely", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        backgroundType: "IMAGE",
        customBackground: "/uploads/bg-1234.webp",
        bgOverlayOpacity: 30,
      });

      expect(styles.backgroundStyle).toEqual({
        backgroundImage: "url(/uploads/bg-1234.webp)",
      });
      expect(styles.overlayStyle).toEqual({
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      });
    });

    it("should fallback gracefully if image URL contains dangerous injection", () => {
      const styles = resolveThemeStyles({
        themeKey: "layanDark",
        backgroundType: "IMAGE",
        customBackground: "javascript:alert(1)",
        bgOverlayOpacity: 40,
      });

      // Invalid image url should not be injected into backgroundImage
      expect(styles.backgroundStyle?.backgroundImage).toBeUndefined();
    });
  });
});
