import { describe, it, expect } from "vitest";
import { isValidImageUrl, sanitizeHexColor } from "@/features/appearance/utils/sanitizer";
import { LinkData, UpdateLinkInput } from "@/features/links/types/links.types";

describe("Link Customization API & Types Unit Tests", () => {
  it("should create valid link object with custom styling fields", () => {
    const link: LinkData = {
      id: "link-custom-1",
      title: "موقعي الشخصي",
      url: "https://example.com",
      position: 0,
      isActive: true,
      thumbnailUrl: "/uploads/thumb-123.webp",
      customBgColor: "#1e293b",
      customTextColor: "#f8fafc",
      customBorderColor: "#38bdf8",
      customShadow: "glow",
    };

    expect(link.thumbnailUrl).toBe("/uploads/thumb-123.webp");
    expect(link.customBgColor).toBe("#1e293b");
    expect(link.customTextColor).toBe("#f8fafc");
    expect(link.customBorderColor).toBe("#38bdf8");
    expect(link.customShadow).toBe("glow");
  });

  it("should allow partial update with custom styling", () => {
    const updatePayload: UpdateLinkInput = {
      thumbnailUrl: "https://images.unsplash.com/photo-car",
      customBgColor: "#000000",
      customShadow: "strong",
    };

    expect(updatePayload.thumbnailUrl).toBe("https://images.unsplash.com/photo-car");
    expect(updatePayload.customBgColor).toBe("#000000");
    expect(updatePayload.customShadow).toBe("strong");
  });

  it("should validate and sanitize thumbnail URLs", () => {
    expect(isValidImageUrl("/uploads/thumb-test.webp")).toBe(true);
    expect(isValidImageUrl("https://images.unsplash.com/photo-123")).toBe(true);
    expect(isValidImageUrl("javascript:alert(1)")).toBe(false);
    expect(isValidImageUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("should sanitize hex colors safely", () => {
    expect(sanitizeHexColor("#123456")).toBe("#123456");
    expect(sanitizeHexColor("#abc")).toBe("#abc");
    expect(sanitizeHexColor("red; background: black")).toBeNull();
    expect(sanitizeHexColor("<script>")).toBeNull();
  });
});
