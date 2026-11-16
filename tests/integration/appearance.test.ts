import { describe, it, expect } from "vitest";
import {
  THEMES,
  BUTTON_STYLES,
  BUTTON_SHADOWS,
  BORDER_RADIUS_MAP,
  FONTS,
  resolveThemeStyles,
} from "@/features/appearance";

describe("Appearance & Visual Identity Integration Suite", () => {
  const canonicalThemes = [
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

  describe("1. All 12 Theme Presets & surfaceColor", () => {
    it("should configure all 12 rich Arab-tailored theme presets", () => {
      for (const themeKey of canonicalThemes) {
        expect(THEMES).toHaveProperty(themeKey);
        const theme = THEMES[themeKey];

        expect(theme.id).toBe(themeKey);
        expect(theme.name).toBeDefined();
        expect(theme.name.length).toBeGreaterThan(0);
        expect(theme.nameAr).toBeDefined();
        expect(theme.nameAr.length).toBeGreaterThan(0);
        expect(theme.backgroundClass).toBeDefined();
        expect(theme.cardClass).toBeDefined();
        expect(theme.textPrimary).toBeDefined();
        expect(theme.textSecondary).toBeDefined();
        expect(theme.buttonClass).toBeDefined();
        expect(theme.socialIconClass).toBeDefined();
        expect(theme.accentColor).toBeDefined();

        // Must define a valid 6-hex surfaceColor
        expect(theme.surfaceColor).toBeDefined();
        expect(theme.surfaceColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it("should retain backward-compatible aliases with defined surfaceColor", () => {
      const compatAliases = ["default", "midnight", "sunset", "violet", "slate", "gold"];
      for (const alias of compatAliases) {
        expect(THEMES).toHaveProperty(alias);
        expect(THEMES[alias].surfaceColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  });

  describe("2. All 5 Arabic Fonts with Tailwind Classes", () => {
    const canonicalFonts = [
      { key: "Cairo", className: "font-cairo", name: "Cairo" },
      { key: "Tajawal", className: "font-tajawal", name: "Tajawal" },
      { key: "IBMPlex", className: "font-plex", name: "IBM Plex Sans Arabic" },
      { key: "Almarai", className: "font-almarai", name: "Almarai" },
      { key: "ReadexPro", className: "font-readex", name: "Readex Pro" },
    ];

    it.each(canonicalFonts)(
      "should map font '$key' to '$className' and English name '$name'",
      ({ key, className, name }) => {
        expect(FONTS).toHaveProperty(key);
        const fontConfig = FONTS[key];
        expect(fontConfig.name).toBe(name);
        expect(fontConfig.nameAr).toBeDefined();
        expect(fontConfig.className).toBe(className);
      }
    );
  });

  describe("3. All 4 Button Styles", () => {
    it("should support filled, glass, soft, and outline button styling options", () => {
      expect(BUTTON_STYLES).toHaveProperty("filled");
      expect(BUTTON_STYLES).toHaveProperty("glass");
      expect(BUTTON_STYLES).toHaveProperty("soft");
      expect(BUTTON_STYLES).toHaveProperty("outline");

      expect(BUTTON_STYLES.filled).toContain("border-transparent");
      expect(BUTTON_STYLES.glass).toContain("backdrop-blur-md");
      expect(BUTTON_STYLES.soft).toContain("bg-opacity-70");
      expect(BUTTON_STYLES.outline).toContain("bg-transparent");
      expect(BUTTON_STYLES.outline).toContain("border-2");
    });
  });

  describe("4. All 4 Button Shadows", () => {
    it("should support none, soft, strong, and glow button shadows", () => {
      expect(BUTTON_SHADOWS).toHaveProperty("none");
      expect(BUTTON_SHADOWS).toHaveProperty("soft");
      expect(BUTTON_SHADOWS).toHaveProperty("strong");
      expect(BUTTON_SHADOWS).toHaveProperty("glow");

      expect(BUTTON_SHADOWS.none).toBe("shadow-none");
      expect(BUTTON_SHADOWS.soft).toContain("shadow-md");
      expect(BUTTON_SHADOWS.strong).toContain("shadow-xl");
      expect(BUTTON_SHADOWS.glow).toBe("shadow-[0_0_20px_rgba(78,222,163,0.35)]");
    });
  });

  describe("5. Canonical Border Radiuses", () => {
    it("should map canonical and short border radius tokens accurately", () => {
      // Canonical tokens
      expect(BORDER_RADIUS_MAP).toHaveProperty("rounded-none");
      expect(BORDER_RADIUS_MAP).toHaveProperty("rounded-md");
      expect(BORDER_RADIUS_MAP).toHaveProperty("rounded-xl");
      expect(BORDER_RADIUS_MAP).toHaveProperty("rounded-full");

      expect(BORDER_RADIUS_MAP["rounded-none"]).toBe("rounded-none");
      expect(BORDER_RADIUS_MAP["rounded-md"]).toBe("rounded-md");
      expect(BORDER_RADIUS_MAP["rounded-xl"]).toBe("rounded-xl");
      expect(BORDER_RADIUS_MAP["rounded-full"]).toBe("rounded-full");

      // Short aliases for backwards compatibility
      expect(BORDER_RADIUS_MAP.none).toBe("rounded-none");
      expect(BORDER_RADIUS_MAP.sm).toBe("rounded-md");
      expect(BORDER_RADIUS_MAP.md).toBe("rounded-xl");
      expect(BORDER_RADIUS_MAP.full).toBe("rounded-full");
    });
  });

  describe("6. resolveThemeStyles Integration Checks", () => {
    it("should resolve default layout styles when profile is empty or null", () => {
      const resolved = resolveThemeStyles(null);
      expect(resolved.backgroundClass).toBe(THEMES.layanDark.backgroundClass);
      expect(resolved.backgroundStyle).toBeUndefined();
      expect(resolved.fontClass).toBe("font-cairo");
      expect(resolved.surfaceColor).toBe("#181c24");
      expect(resolved.cardClass).toBe(THEMES.layanDark.cardClass);
      expect(resolved.buttonClass).toContain(THEMES.layanDark.buttonClass);
      expect(resolved.buttonClass).toContain("border-transparent");
      expect(resolved.buttonClass).toContain("shadow-none");
    });

    it("should resolve specific theme presets correctly", () => {
      const rawabet = resolveThemeStyles({ themeKey: "rawabetLight" });
      expect(rawabet.backgroundClass).toBe(THEMES.rawabetLight.backgroundClass);
      expect(rawabet.surfaceColor).toBe("#ffffff");
      expect(rawabet.textPrimaryClass).toBe(THEMES.rawabetLight.textPrimary);

      const emerald = resolveThemeStyles({ themeKey: "emerald" });
      expect(emerald.backgroundClass).toBe(THEMES.emerald.backgroundClass);
      expect(emerald.surfaceColor).toBe("#181c24");
      expect(emerald.textSecondaryClass).toBe(THEMES.emerald.textSecondary);
    });

    it("should resolve custom solid background and clear backgroundClass", () => {
      const resolved = resolveThemeStyles({
        backgroundType: "SOLID",
        customBackground: "#0f172a",
      });

      expect(resolved.backgroundClass).toBe("");
      expect(resolved.backgroundStyle).toEqual({ backgroundColor: "#0f172a" });
    });

    it("should resolve custom gradient background and clear backgroundClass", () => {
      const gradient = "linear-gradient(135deg, #1e1b4b, #0f172a)";
      const resolved = resolveThemeStyles({
        backgroundType: "GRADIENT",
        customBackground: gradient,
      });

      expect(resolved.backgroundClass).toBe("");
      expect(resolved.backgroundStyle).toEqual({ background: gradient });
    });

    it("should sanitize and reject unsafe background styles and fall back to theme background", () => {
      const maliciousInputs = [
        "url('https://malicious.site/script.js')",
        "expression(alert('xss'))",
        "javascript:alert(1)",
        "red; behavior: url(xss.htc)",
      ];

      for (const input of maliciousInputs) {
        const resolved = resolveThemeStyles({
          themeKey: "slateMinimal",
          backgroundType: "SOLID",
          customBackground: input,
        });

        expect(resolved.backgroundClass).toBe(THEMES.slateMinimal.backgroundClass);
        expect(resolved.backgroundStyle).toBeUndefined();
      }
    });

    it("should correctly compose buttonStyle and buttonShadow combinations", () => {
      const combinations = [
        {
          style: "glass",
          shadow: "glow",
          expectedStyle: BUTTON_STYLES.glass,
          expectedShadow: BUTTON_SHADOWS.glow,
        },
        {
          style: "soft",
          shadow: "strong",
          expectedStyle: BUTTON_STYLES.soft,
          expectedShadow: BUTTON_SHADOWS.strong,
        },
        {
          style: "outline",
          shadow: "soft",
          expectedStyle: BUTTON_STYLES.outline,
          expectedShadow: BUTTON_SHADOWS.soft,
        },
        {
          style: "filled",
          shadow: "none",
          expectedStyle: BUTTON_STYLES.filled,
          expectedShadow: BUTTON_SHADOWS.none,
        },
      ];

      for (const combo of combinations) {
        const resolved = resolveThemeStyles({
          themeKey: "cyberDark",
          buttonStyle: combo.style,
          buttonShadow: combo.shadow,
        });

        expect(resolved.buttonClass).toContain(THEMES.cyberDark.buttonClass);
        expect(resolved.buttonClass).toContain(combo.expectedStyle);
        expect(resolved.buttonClass).toContain(combo.expectedShadow);
      }
    });

    it("should resolve typography font classes accurately", () => {
      const cairo = resolveThemeStyles({ font: "Cairo" });
      expect(cairo.fontClass).toBe("font-cairo");

      const tajawal = resolveThemeStyles({ font: "Tajawal" });
      expect(tajawal.fontClass).toBe("font-tajawal");

      const plex = resolveThemeStyles({ font: "IBMPlex" });
      expect(plex.fontClass).toBe("font-plex");

      const almarai = resolveThemeStyles({ font: "Almarai" });
      expect(almarai.fontClass).toBe("font-almarai");

      const readex = resolveThemeStyles({ font: "ReadexPro" });
      expect(readex.fontClass).toBe("font-readex");

      // Fallback for unknown font
      const fallback = resolveThemeStyles({ font: "NonExistentFont" });
      expect(fallback.fontClass).toBe("font-cairo");
    });
  });
});
