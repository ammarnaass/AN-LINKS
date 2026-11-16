import { describe, it, expect } from "vitest";
import {
  THEMES,
  FONTS,
  BUTTON_STYLES,
  BUTTON_SHADOWS,
  resolveThemeStyles,
} from "@/features/appearance";

describe("Theme Resolver & Presets Engine", () => {
  it("should have all 12 rich Arab-tailored theme presets with surfaceColor", () => {
    const requiredPresets = [
      "layanDark",
      "rawabetLight",
      "emerald",
      "neonPurple",
      "oceanBlue",
      "sunsetFire",
      "desertSand",
      "slateMinimal",
      "rosePastel",
      "cyberDark",
      "freshDawn",
      "pureWhite",
    ];

    for (const key of requiredPresets) {
      expect(THEMES).toHaveProperty(key);
      const theme = THEMES[key];
      expect(theme.id).toBe(key);
      expect(theme.name).toBeDefined();
      expect(theme.nameAr).toBeDefined();
      expect(theme.surfaceColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.backgroundClass).toBeDefined();
      expect(theme.cardClass).toBeDefined();
      expect(theme.buttonClass).toBeDefined();
      expect(theme.accentColor).toBeDefined();
    }
  });

  it("should support all 5 Arabic fonts with correct Tailwind class names", () => {
    const requiredFonts = ["Cairo", "Tajawal", "IBMPlex", "Almarai", "ReadexPro"];
    for (const font of requiredFonts) {
      expect(FONTS).toHaveProperty(font);
      expect(FONTS[font].className).toBeDefined();
      expect(FONTS[font].className).toMatch(/^font-/);
    }

    expect(FONTS.Cairo.className).toBe("font-cairo");
    expect(FONTS.Tajawal.className).toBe("font-tajawal");
    expect(FONTS.IBMPlex.className).toBe("font-plex");
    expect(FONTS.Almarai.className).toBe("font-almarai");
    expect(FONTS.ReadexPro.className).toBe("font-readex");
  });

  it("should resolve default styles when profile is empty or undefined", () => {
    const resolved = resolveThemeStyles(undefined);
    expect(resolved.backgroundClass).toBe(THEMES.layanDark.backgroundClass);
    expect(resolved.backgroundStyle).toBeUndefined();
    expect(resolved.fontClass).toBe("font-cairo");
    expect(resolved.surfaceColor).toBe("#181c24");
    expect(resolved.buttonClass).toContain(THEMES.layanDark.buttonClass);
    expect(resolved.buttonClass).toContain("border-transparent"); // filled
    expect(resolved.buttonClass).toContain("shadow-none"); // none
  });

  it("should handle SOLID background with sanitized hex color", () => {
    const resolved = resolveThemeStyles({
      backgroundType: "SOLID",
      customBackground: "#ff5722",
    });
    expect(resolved.backgroundClass).toBe("");
    expect(resolved.backgroundStyle).toEqual({ backgroundColor: "#ff5722" });
  });

  it("should reject malicious customBackground in SOLID mode and fallback to theme", () => {
    const resolved = resolveThemeStyles({
      themeKey: "emerald",
      backgroundType: "SOLID",
      customBackground: "url('https://evil.com/leak')",
    });
    expect(resolved.backgroundClass).toBe(THEMES.emerald.backgroundClass);
    expect(resolved.backgroundStyle).toBeUndefined();
  });

  it("should handle GRADIENT background with sanitized linear-gradient", () => {
    const gradient = "linear-gradient(to right, #4edea3, #10b981)";
    const resolved = resolveThemeStyles({
      backgroundType: "GRADIENT",
      customBackground: gradient,
    });
    expect(resolved.backgroundClass).toBe("");
    expect(resolved.backgroundStyle).toEqual({ background: gradient });
  });

  it("should combine button styles and shadows accurately", () => {
    const resolved = resolveThemeStyles({
      themeKey: "oceanBlue",
      buttonStyle: "glass",
      buttonShadow: "glow",
    });

    expect(resolved.buttonClass).toContain(THEMES.oceanBlue.buttonClass);
    expect(resolved.buttonClass).toContain(BUTTON_STYLES.glass);
    expect(resolved.buttonClass).toContain(BUTTON_SHADOWS.glow);
  });

  it("should resolve font selection correctly", () => {
    const resolvedReadex = resolveThemeStyles({ font: "ReadexPro" });
    expect(resolvedReadex.fontClass).toBe("font-readex");

    const resolvedTajawal = resolveThemeStyles({ font: "Tajawal" });
    expect(resolvedTajawal.fontClass).toBe("font-tajawal");
  });
});
