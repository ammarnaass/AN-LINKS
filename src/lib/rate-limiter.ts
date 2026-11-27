import { NextResponse } from "next/server";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const MAX_STORE_ENTRIES = 5000;
const store = new Map<string, RateLimitBucket>();

/**
 * Extracts a normalized client IP address from incoming proxy/CDN headers.
 */
export function getClientIp(request: Request): string {
  if (process.env.VERCEL === "1") {
    const vercelIp = request.headers.get("x-vercel-forwarded-for");
    if (vercelIp?.trim()) return vercelIp.split(",")[0]?.trim() || "127.0.0.1";
    const realIp = request.headers.get("x-real-ip");
    if (realIp?.trim()) return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp?.trim()) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded?.trim()) {
    return forwarded.split(",")[0]?.trim() || "127.0.0.1";
  }

  return "127.0.0.1";
}

function pruneExpiredBuckets(now: number) {
  if (store.size < MAX_STORE_ENTRIES) return;
  for (const [k, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(k);
    }
  }
  while (store.size >= MAX_STORE_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey === undefined) break;
    store.delete(oldestKey);
  }
}

/**
 * Checks and increments an in-memory fixed-window rate limit counter for a composite key.
 */
export function checkRateLimit(
  key: string,
  { maxAttempts, windowMs }: RateLimitOptions,
  now: number = Date.now()
): RateLimitResult {
  pruneExpiredBuckets(now);

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(0, maxAttempts - 1),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, maxAttempts - existing.count),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

/**
 * Enforces a route rate limit and returns a localized HTTP 429 response when exceeded, or null if allowed.
 */
export function enforceRateLimit(
  request: Request,
  namespace: string,
  options: RateLimitOptions,
  customIdentity?: string
): NextResponse | null {
  const identity = customIdentity || getClientIp(request);
  const res = checkRateLimit(`${namespace}:${identity}`, options);
  if (res.allowed) return null;

  return NextResponse.json(
    {
      success: false,
      error: "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً والمحاولة لاحقاً.",
      retryAfterSeconds: res.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(res.retryAfterSeconds),
      },
    }
  );
}

export function resetRateLimitStore() {
  store.clear();
}
