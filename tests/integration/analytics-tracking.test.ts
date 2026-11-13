import { describe, it, expect } from "vitest";
import { getNormalizedDate, shouldCountClick } from "@/lib/tracking-service";

describe("Analytics Tracking & Click Redirection Helpers", () => {
  it("should normalize dates to UTC midnight for daily aggregation", () => {
    const d1 = new Date("2026-11-13T14:35:10Z");
    const normalized = getNormalizedDate(d1);

    expect(normalized.getUTCHours()).toBe(0);
    expect(normalized.getUTCMinutes()).toBe(0);
    expect(normalized.getUTCSeconds()).toBe(0);
    expect(normalized.getUTCFullYear()).toBe(2026);
    expect(normalized.getUTCMonth()).toBe(10); // 0-indexed: 10 is Nov
    expect(normalized.getUTCDate()).toBe(13);
  });

  it("should count clicks for regular human browsers", () => {
    const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)";
    const headers = new Headers();

    const count = shouldCountClick(userAgent, headers);
    expect(count).toBe(true);
  });

  it("should ignore clicks from bots and prefetch triggers", () => {
    const bots = [
      "facebookexternalhit/1.1",
      "WhatsApp/2.21",
      "Twitterbot/1.0",
      "TelegramBot",
    ];

    for (const bot of bots) {
      expect(shouldCountClick(bot, new Headers())).toBe(false);
    }

    const prefetchHeaders = new Headers();
    prefetchHeaders.set("purpose", "prefetch");
    expect(shouldCountClick("Mozilla/5.0", prefetchHeaders)).toBe(false);
  });
});
