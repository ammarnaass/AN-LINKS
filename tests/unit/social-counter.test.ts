import { describe, it, expect, beforeEach } from "vitest";
import {
  formatSocialCountEn,
  formatSocialCountArabic,
  fetchSocialCounter,
  clearSocialCounterCache,
} from "@/features/bio/services/social-counter.service";

describe("Live Social Counters & TTL Cache Engine Suite", () => {
  beforeEach(() => {
    clearSocialCounterCache();
  });

  it("formats counts accurately in English K and M notation", () => {
    expect(formatSocialCountEn(450)).toBe("450");
    expect(formatSocialCountEn(1500)).toBe("1.5K");
    expect(formatSocialCountEn(25000)).toBe("25K");
    expect(formatSocialCountEn(1200000)).toBe("1.2M");
    expect(formatSocialCountEn(3000000)).toBe("3M");
  });

  it("formats counts in Arabic with appropriate platform suffixes", () => {
    expect(formatSocialCountArabic(1500, "youtube")).toBe("1.5K مشترك");
    expect(formatSocialCountArabic(1200000, "youtube")).toBe("1.2M مشترك");
    expect(formatSocialCountArabic(25000, "x")).toBe("25K متابع");
    expect(formatSocialCountArabic(800, "github")).toBe("800 متابع");
    expect(formatSocialCountArabic(95000, "tiktok")).toBe("95K متابع");
  });

  it("fetches counter and verifies TTL caching behavior", async () => {
    const res1 = await fetchSocialCounter("github", "ammarnaass", 60000);
    expect(res1.cached).toBe(false);
    expect(res1.platform).toBe("github");
    expect(res1.handle).toBe("ammarnaass");
    expect(res1.count).toBeGreaterThan(0);

    // Second call within TTL should return cached result
    const res2 = await fetchSocialCounter("github", "ammarnaass", 60000);
    expect(res2.cached).toBe(true);
    expect(res2.count).toBe(res1.count);
    expect(res2.formattedAr).toBe(res1.formattedAr);
  });

  it("invalidates cache after clearSocialCounterCache is called", async () => {
    const res1 = await fetchSocialCounter("youtube", "anlinks_official", 60000);
    expect(res1.cached).toBe(false);

    clearSocialCounterCache();

    const res2 = await fetchSocialCounter("youtube", "anlinks_official", 60000);
    expect(res2.cached).toBe(false);
  });
});
