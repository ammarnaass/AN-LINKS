import { describe, it, expect } from "vitest";
import { THEMES, BUTTON_STYLES, BORDER_RADIUS_MAP, FONTS } from "@/lib/themes";

describe("Appearance & Themes Customizer Logic", () => {
  it("should have all required Stitch luxury themes configured", () => {
    expect(THEMES).toHaveProperty("layanDark");
    expect(THEMES).toHaveProperty("rawabetLight");
    expect(THEMES).toHaveProperty("emerald");
    expect(THEMES).toHaveProperty("midnight");

    const layan = THEMES.layanDark;
    expect(layan.nameAr).toContain("ليان داكن");
    expect(layan.backgroundClass).toBeDefined();

    const rawabet = THEMES.rawabetLight;
    expect(rawabet.nameAr).toContain("روابط فاخر");
    expect(rawabet.textPrimary).toBeDefined();
  });

  it("should support diverse Arabic typography options", () => {
    expect(FONTS).toHaveProperty("IBMPlex");
    expect(FONTS).toHaveProperty("Cairo");
    expect(FONTS).toHaveProperty("Tajawal");

    expect(FONTS.IBMPlex.name).toBe("IBM Plex Sans Arabic");
    expect(FONTS.Cairo.name).toBe("Cairo");
  });

  it("should support filled, glass, and soft button styling options", () => {
    expect(BUTTON_STYLES).toHaveProperty("filled");
    expect(BUTTON_STYLES).toHaveProperty("glass");
    expect(BUTTON_STYLES).toHaveProperty("soft");
  });

  it("should map corner radius options accurately", () => {
    expect(BORDER_RADIUS_MAP).toHaveProperty("sm");
    expect(BORDER_RADIUS_MAP).toHaveProperty("md");
    expect(BORDER_RADIUS_MAP).toHaveProperty("full");
  });
});

