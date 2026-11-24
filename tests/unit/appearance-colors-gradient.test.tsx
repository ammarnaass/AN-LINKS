import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AdvancedColorPicker,
  DEFAULT_COLOR_PALETTE,
} from "@/features/appearance/components/AdvancedColorPicker";
import { GradientBuilder } from "@/features/appearance/components/GradientBuilder";

describe("AdvancedColorPicker & GradientBuilder Component Tests", () => {
  describe("AdvancedColorPicker", () => {
    it("should render color input, hex input, and default color palette", () => {
      const html = renderToStaticMarkup(
        <AdvancedColorPicker
          value="#2563EB"
          onChange={vi.fn()}
          label="لون الزر"
        />
      );

      expect(html).toContain("لون الزر");
      expect(html).toContain('value="#2563EB"');
      // Should contain swatches from DEFAULT_COLOR_PALETTE
      expect(html).toContain('title="زمردي (#4edea3)"');
      expect(html).toContain('title="أزرق ملكي (#2563EB)"');
    });

    it("should render custom palette when provided", () => {
      const custom = [
        { hex: "#111111", label: "داكن" },
        { hex: "#eeeeee", label: "فاتح" },
      ];
      const html = renderToStaticMarkup(
        <AdvancedColorPicker
          value="#111111"
          onChange={vi.fn()}
          palette={custom}
        />
      );

      expect(html).toContain('title="داكن (#111111)"');
      expect(html).toContain('title="فاتح (#eeeeee)"');
    });
  });

  describe("GradientBuilder", () => {
    it("should parse gradient string and render angle and color controls", () => {
      const initialGrad = "linear-gradient(90deg, #123456 0%, #654321 100%)";
      const html = renderToStaticMarkup(
        <GradientBuilder
          value={initialGrad}
          onChange={vi.fn()}
        />
      );

      expect(html).toContain("صانع التدرجات المخصص");
      expect(html).toContain("90°");
      expect(html).toContain("#123456");
      expect(html).toContain("#654321");
      expect(html).toContain("زاوية التدفق");
    });

    it("should render default gradient when input is null or empty", () => {
      const html = renderToStaticMarkup(
        <GradientBuilder
          value={null}
          onChange={vi.fn()}
        />
      );

      expect(html).toContain("صانع التدرجات المخصص");
      expect(html).toContain("135°");
      expect(html).toContain("#0f172a");
      expect(html).toContain("#1e293b");
    });
  });
});
