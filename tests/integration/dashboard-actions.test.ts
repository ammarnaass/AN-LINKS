import { describe, it, expect } from "vitest";
import {
  validateLinkInput,
  reorderLinkItems,
} from "@/lib/dashboard-actions";

describe("Dashboard Actions & Link Management Logic", () => {
  it("should validate and sanitize link addition correctly", () => {
    const validRes = validateLinkInput({
      title: "متجري الإلكتروني",
      url: "salla.sa/mystore",
    });

    expect(validRes.valid).toBe(true);
    expect(validRes.normalizedUrl).toBe("https://salla.sa/mystore");
    expect(validRes.title).toBe("متجري الإلكتروني");
  });

  it("should reject link if title is empty or exceeds 100 characters", () => {
    const emptyRes = validateLinkInput({
      title: "",
      url: "https://example.com",
    });
    expect(emptyRes.valid).toBe(false);
    expect(emptyRes.error).toContain("عنوان الرابط مطلوب");

    const longRes = validateLinkInput({
      title: "أ".repeat(105),
      url: "https://example.com",
    });
    expect(longRes.valid).toBe(false);
    expect(longRes.error).toContain("يجب ألا يتجاوز عنوان الرابط 100 حرف");
  });

  it("should reject malicious or invalid URLs when adding a link", () => {
    const jsRes = validateLinkInput({
      title: "موقع ضار",
      url: "javascript:alert(1)",
    });
    expect(jsRes.valid).toBe(false);

    const ipRes = validateLinkInput({
      title: "عنوان IP",
      url: "http://192.168.1.1",
    });
    expect(ipRes.valid).toBe(false);
  });

  it("should recalculate consecutive zero-indexed positions when reordering items", () => {
    const currentItems = [
      { id: "a", position: 0 },
      { id: "b", position: 1 },
      { id: "c", position: 2 },
    ];

    // Move item 'c' (index 2) to index 0
    const reordered = reorderLinkItems(currentItems, 2, 0);

    expect(reordered.map((i) => i.id)).toEqual(["c", "a", "b"]);
    expect(reordered.map((i) => i.position)).toEqual([0, 1, 2]);
  });
});

