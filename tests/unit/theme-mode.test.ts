import { describe, it, expect } from "vitest";
import { THEME_TOKENS, resolveThemeClasses } from "@/shared/ui/design-system";

describe("Dual Mode Design Tokens & Resolution", () => {
  it("should match Layan Dark Arabic Bento tokens exactly", () => {
    expect(THEME_TOKENS.dark.surface).toBe("#0f131c");
    expect(THEME_TOKENS.dark.primary).toBe("#4edea3");
    expect(THEME_TOKENS.dark.surfaceContainer).toBe("#1c2028");
  });

  it("should match Rawabet Luxury Light tokens exactly", () => {
    expect(THEME_TOKENS.light.surface).toBe("#faf8ff");
    expect(THEME_TOKENS.light.primary).toBe("#006948");
    expect(THEME_TOKENS.light.surfaceContainer).toBe("#eaedff");
  });

  it("should resolve correct class names for document root", () => {
    expect(resolveThemeClasses("dark")).toBe("dark");
    expect(resolveThemeClasses("light")).toBe("light");
    expect(resolveThemeClasses("system")).toBe("dark");
  });
});
