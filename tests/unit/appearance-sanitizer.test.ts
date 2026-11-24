import { describe, it, expect } from "vitest";
import {
  sanitizeCustomBackground,
  isValidImageUrl,
} from "@/features/appearance/utils/sanitizer";

describe("Appearance Security Sanitizer Tests", () => {
  describe("Hex Color Validation", () => {
    it("should allow valid 3, 6, and 8 character hex colors", () => {
      expect(sanitizeCustomBackground("#fff")).toBe("#fff");
      expect(sanitizeCustomBackground("#4edea3")).toBe("#4edea3");
      expect(sanitizeCustomBackground("#0f131cff")).toBe("#0f131cff");
      expect(sanitizeCustomBackground("  #2563EB  ")).toBe("#2563EB");
    });

    it("should reject invalid hex colors", () => {
      expect(sanitizeCustomBackground("#gg0000")).toBeNull();
      expect(sanitizeCustomBackground("fff")).toBeNull();
      expect(sanitizeCustomBackground("#12")).toBeNull();
      expect(sanitizeCustomBackground("#123456789")).toBeNull();
    });
  });

  describe("CSS Gradient Validation", () => {
    it("should allow safe linear and radial gradients", () => {
      const grad1 = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
      const grad2 = "radial-gradient(circle at center, #251545 0%, #0f0c1b 100%)";
      expect(sanitizeCustomBackground(grad1)).toBe(grad1);
      expect(sanitizeCustomBackground(grad2)).toBe(grad2);
    });

    it("should reject gradients with semi-colons, braces, or injections", () => {
      expect(sanitizeCustomBackground("linear-gradient(#000, #fff); background-image: none;")).toBeNull();
      expect(sanitizeCustomBackground("linear-gradient(#000, #fff) { color: red }")).toBeNull();
      expect(sanitizeCustomBackground("linear-gradient(url('evil.png'))")).toBeNull();
    });
  });

  describe("Image Path & URL Validation", () => {
    it("should allow legitimate local uploads", () => {
      expect(isValidImageUrl("/uploads/avatar-1700000000-abc123.webp")).toBe(true);
      expect(isValidImageUrl("/uploads/bg-theme_4.png")).toBe(true);
      expect(sanitizeCustomBackground("/uploads/avatar-test.jpg")).toBe("/uploads/avatar-test.jpg");
    });

    it("should allow safe external HTTPS images", () => {
      const url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";
      expect(isValidImageUrl(url)).toBe(true);
      expect(sanitizeCustomBackground(url)).toBe(url);
    });

    it("should block malicious patterns such as javascript:, url(), expression(), quotes, and angle brackets", () => {
      expect(isValidImageUrl("javascript:alert(1)")).toBe(false);
      expect(isValidImageUrl("url(evil.com)")).toBe(false);
      expect(isValidImageUrl('https://example.com/image.png" onerror="alert(1)')).toBe(false);
      expect(isValidImageUrl("https://example.com/image.png<script>")).toBe(false);
      expect(sanitizeCustomBackground("javascript:alert(1)")).toBeNull();
      expect(sanitizeCustomBackground("url('https://evil.com/bg.png')")).toBeNull();
      expect(sanitizeCustomBackground("@import url('evil.css')")).toBeNull();
      expect(sanitizeCustomBackground("expression(alert(1))")).toBeNull();
    });
  });
});
