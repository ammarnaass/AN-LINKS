import { describe, it, expect } from "vitest";
import { STITCH_THEMES, getThemeTokens } from "@/lib/design-system";

describe("Stitch Design System Tokens", () => {
  it("should define Layan Dark Arabic Bento and Rawabet Luxury Light themes", () => {
    expect(STITCH_THEMES.layanDark).toBeDefined();
    expect(STITCH_THEMES.rawabetLight).toBeDefined();

    // Verify Layan Dark primary and background
    expect(STITCH_THEMES.layanDark.colors.primary).toBe("#4edea3");
    expect(STITCH_THEMES.layanDark.colors["primary-container"]).toBe("#10b981");
    expect(STITCH_THEMES.layanDark.colors.surface).toBe("#0f131c");
    expect(STITCH_THEMES.layanDark.colors["surface-container-high"]).toBe("#262a33");

    // Verify Rawabet Light tokens
    expect(STITCH_THEMES.rawabetLight.colors.surface).toBe("#faf8ff");
    expect(STITCH_THEMES.rawabetLight.colors.primary).toBe("#006948");
  });

  it("should resolve theme tokens with fallback to layanDark", () => {
    const defaultTokens = getThemeTokens();
    expect(defaultTokens.name).toBe("Layan Dark Arabic Bento");
    expect(defaultTokens.isDark).toBe(true);

    const lightTokens = getThemeTokens("rawabetLight");
    expect(lightTokens.name).toBe("Rawabet Luxury Light");
    expect(lightTokens.isDark).toBe(false);

    const fallbackTokens = getThemeTokens("non_existent_key");
    expect(fallbackTokens.name).toBe("Layan Dark Arabic Bento");
  });
});
