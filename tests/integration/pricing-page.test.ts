import { describe, it, expect } from "vitest";
import { PRICING_PLANS, COMPARISON_FEATURES, calculatePrice } from "@/features/landing";

describe("Pricing Page Data & Logic", () => {
  it("should have 3 core tiers matching Stitch _1 spec", () => {
    expect(PRICING_PLANS).toHaveLength(3);
    expect(PRICING_PLANS[0].name).toBe("البداية المجانية");
    expect(PRICING_PLANS[1].name).toBe("صانع المحتوى المحترف");
    expect(PRICING_PLANS[2].name).toBe("الأعمال والوكالات");
  });

  it("should calculate 20% discount on yearly billing cycle", () => {
    const monthly = calculatePrice(PRICING_PLANS[1], false);
    const yearlyMonthlyEquiv = calculatePrice(PRICING_PLANS[1], true);
    expect(yearlyMonthlyEquiv).toBeLessThan(monthly);
    expect(yearlyMonthlyEquiv).toBe(19); // 24/mo -> 19/mo on yearly
  });

  it("should provide full feature comparison matrix", () => {
    expect(COMPARISON_FEATURES.length).toBeGreaterThan(8);
  });
});

