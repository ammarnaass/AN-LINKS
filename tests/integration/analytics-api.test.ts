import { describe, it, expect } from "vitest";
import {
  calculateCTR,
  generateDateRange,
  aggregateTimeSeries,
} from "@/lib/analytics-service";

describe("Analytics Aggregation & CTR Calculations", () => {
  it("should calculate CTR percentage accurately", () => {
    // 50 clicks out of 200 views = 25%
    expect(calculateCTR(200, 50)).toBe(25.0);

    // 1 click out of 3 views = 33.3%
    expect(calculateCTR(3, 1)).toBe(33.3);

    // 0 views should return 0.0 without division by zero
    expect(calculateCTR(0, 0)).toBe(0.0);
    expect(calculateCTR(0, 10)).toBe(0.0);
  });

  it("should generate continuous daily date series for 7 days and 30 days", () => {
    const range7 = generateDateRange(7);
    expect(range7).toHaveLength(7);

    const range30 = generateDateRange(30);
    expect(range30).toHaveLength(30);

    // Dates should be sorted chronologically
    expect(new Date(range7[0]).getTime()).toBeLessThan(new Date(range7[6]).getTime());
  });

  it("should merge sparse database records into full daily time series with zero padding", () => {
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    const sparseData = [
      { date: dateStr, count: 42 },
    ];

    const series = aggregateTimeSeries(sparseData, 7);
    expect(series).toHaveLength(7);

    // The entry for today should have count 42
    const todayEntry = series.find((s) => s.date === dateStr);
    expect(todayEntry?.count).toBe(42);

    // Missing days should default to 0
    const zeroDays = series.filter((s) => s.count === 0);
    expect(zeroDays.length).toBe(6);
  });
});

