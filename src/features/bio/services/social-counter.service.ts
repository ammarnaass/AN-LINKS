export type SupportedSocialPlatform =
  | "youtube"
  | "github"
  | "twitter"
  | "x"
  | "tiktok"
  | "instagram";

export interface SocialCounterResult {
  platform: SupportedSocialPlatform;
  handle: string;
  count: number;
  formattedAr: string;
  formattedEn: string;
  cached: boolean;
  fetchedAt: Date;
}

interface CacheEntry {
  count: number;
  expiresAt: number;
}

// In-memory TTL cache to prevent API rate limiting & latency
const counterCache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export function formatSocialCountEn(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toString();
}

export function formatSocialCountArabic(count: number, platform: SupportedSocialPlatform): string {
  const numStr = formatSocialCountEn(count);
  switch (platform) {
    case "youtube":
      return `${numStr} مشترك`;
    case "github":
    case "twitter":
    case "x":
    case "tiktok":
    case "instagram":
    default:
      return `${numStr} متابع`;
  }
}

export function clearSocialCounterCache(): void {
  counterCache.clear();
}

export async function fetchSocialCounter(
  platform: SupportedSocialPlatform,
  rawHandle: string,
  ttlMs = DEFAULT_TTL_MS
): Promise<SocialCounterResult> {
  const handle = rawHandle.trim().replace(/^@/, "").toLowerCase();
  const cacheKey = `${platform}:${handle}`;
  const now = Date.now();

  const cached = counterCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return {
      platform,
      handle,
      count: cached.count,
      formattedAr: formatSocialCountArabic(cached.count, platform),
      formattedEn: formatSocialCountEn(cached.count),
      cached: true,
      fetchedAt: new Date(now),
    };
  }

  // Deterministic mock/simulator counter based on handle hash for consistent stats without external rate limits
  let seed = 0;
  for (let i = 0; i < handle.length; i++) {
    seed = (seed << 5) - seed + handle.charCodeAt(i);
    seed |= 0;
  }
  const baseCount = Math.abs(seed) % 950_000 + 1_500;

  counterCache.set(cacheKey, {
    count: baseCount,
    expiresAt: now + ttlMs,
  });

  return {
    platform,
    handle,
    count: baseCount,
    formattedAr: formatSocialCountArabic(baseCount, platform),
    formattedEn: formatSocialCountEn(baseCount),
    cached: false,
    fetchedAt: new Date(now),
  };
}
