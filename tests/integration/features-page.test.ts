import { describe, it, expect } from "vitest";
import { DETAILED_FEATURES, GLOBAL_ALTERNATIVES_COMPARISON } from "@/features/landing";

describe("Features Deep Dive Page", () => {
  it("should contain all Stitch _10 feature modules", () => {
    expect(DETAILED_FEATURES.length).toBeGreaterThanOrEqual(6);
    const linkSentinel = DETAILED_FEATURES.find((f) => f.id === "link-sentinel");
    expect(linkSentinel).toBeDefined();
    expect(linkSentinel?.title).toContain("فاحص الروابط");
  });

  it("should contain direct comparison with global alternatives", () => {
    expect(GLOBAL_ALTERNATIVES_COMPARISON.length).toBeGreaterThanOrEqual(4);
    expect(GLOBAL_ALTERNATIVES_COMPARISON[0]).toHaveProperty("rawabet");
    expect(GLOBAL_ALTERNATIVES_COMPARISON[0]).toHaveProperty("linktree");
  });
});
