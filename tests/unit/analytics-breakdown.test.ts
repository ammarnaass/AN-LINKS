import { describe, it, expect } from "vitest";
import { aggregateAnalyticsBreakdowns } from "@/features/analytics/services/analytics-breakdown.service";

describe("Analytics Breakdown Service", () => {
  it("returns default fallback sources and countries when linkIds is empty", async () => {
    const result = await aggregateAnalyticsBreakdowns([], new Date());
    expect(result.trafficSources.length).toBeGreaterThanOrEqual(3);
    expect(result.countries.length).toBeGreaterThanOrEqual(3);
    expect(result.trafficSources[0].name).toContain("Direct");
    expect(result.countries[0].name).toContain("السعودية");
  });

  it("handles non-empty linkIds without throwing errors", async () => {
    const result = await aggregateAnalyticsBreakdowns(["non-existent-id"], new Date());
    expect(result).toHaveProperty("trafficSources");
    expect(result).toHaveProperty("countries");
    expect(Array.isArray(result.trafficSources)).toBe(true);
    expect(Array.isArray(result.countries)).toBe(true);
  });
});
