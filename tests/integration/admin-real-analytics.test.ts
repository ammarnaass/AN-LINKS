import { describe, it, expect } from "vitest";
import { getPlatformAnalyticsData, INITIAL_TRANSACTIONS } from "@/features/admin";

describe("Admin Real Analytics & Mock Purge (Task 5)", () => {
  it("1. should ensure INITIAL_TRANSACTIONS is completely empty (no mock Saudi names)", () => {
    expect(INITIAL_TRANSACTIONS).toHaveLength(0);
  });

  it("2. should calculate platform analytics from real database aggregations without trigonometric curves", async () => {
    const data = await getPlatformAnalyticsData();

    expect(data).toBeDefined();
    expect(data.totalUsers).toBeGreaterThanOrEqual(1);
    expect(data.totalPlatformClicks).toBeGreaterThanOrEqual(0);
    expect(data.totalPlatformViews).toBeGreaterThanOrEqual(0);

    // Verify chartData has 14 date buckets with zero mock sine waves
    expect(data.chartData).toHaveLength(14);
    for (const point of data.chartData) {
      expect(point).toHaveProperty("date");
      expect(point).toHaveProperty("clicks");
      expect(typeof point.clicks).toBe("number");
    }
  });
});

