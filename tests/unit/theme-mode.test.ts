import { describe, it, expect } from "vitest";
import { THEME_TOKENS, resolveThemeClasses } from "@/shared/ui/design-system";

describe("Theme Mode Tokens & Resolution", () => {
  it("should provide valid dark and light mode color tokens", () => {
    expect(THEME_TOKENS.dark.surface).toBe("#0f131c");
    expect(THEME_TOKENS.light.surface).toBe("#f9f9fe");
    expect(THEME_TOKENS.dark.primary).toBe("#4edea3");
    expect(THEME_TOKENS.light.primary).toBe("#006948");
  });

  it("should return correct root class name for mode", () => {
    expect(resolveThemeClasses("dark")).toContain("dark");
    expect(resolveThemeClasses("light")).toBe("light");
  });
});
