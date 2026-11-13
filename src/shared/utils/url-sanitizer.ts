const BLOCKED_SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "cutt.ly",
  "is.gd",
  "buff.ly",
  "ow.ly",
  "goo.gl",
  "rebrand.ly",
]);

const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^\[?[a-fA-F0-9:]+\]?$/;

export interface SanitizeUrlResult {
  valid: boolean;
  normalizedUrl?: string;
  error?: string;
}

export function sanitizeUrl(rawUrl: string): SanitizeUrlResult {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, error: "الرابط مطلوب" };
  }

  let trimmed = rawUrl.trim();

  // Block dangerous schemes immediately
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return { valid: false, error: "مخطط الرابط غير مسموح به لأسباب أمنية" };
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);

    // Only allow http and https
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "يجب أن يبدأ الرابط بـ http أو https" };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return { valid: false, error: "لا يمكن استخدام روابط localhost" };
    }

    // Block raw IPv4 and IPv6
    if (IPV4_REGEX.test(hostname) || (hostname.startsWith("[") && IPV6_REGEX.test(hostname))) {
      return { valid: false, error: "لا يُسمح باستخدام عناوين IP المباشرة" };
    }

    // Block known double redirect shorteners
    if (BLOCKED_SHORTENERS.has(hostname)) {
      return { valid: false, error: "لا يُسمح باستخدام خدمات تقصير الروابط لمنع التصيد الاحتيالي" };
    }

    // Verify valid domain format (must contain at least one dot and valid characters)
    if (!hostname.includes(".") || hostname.startsWith(".") || hostname.endsWith(".")) {
      return { valid: false, error: "صيغة النطاق غير صالحة" };
    }

    // Clean normalized output: strip trailing slash only if original input did not have one and path is root
    let normalized = parsed.toString();
    if (parsed.pathname === "/" && !parsed.search && !parsed.hash) {
      if (!trimmed.endsWith("/")) {
        normalized = normalized.replace(/\/$/, "");
      }
    }

    return {
      valid: true,
      normalizedUrl: normalized,
    };
  } catch {
    return { valid: false, error: "صيغة الرابط غير صالحة" };
  }
}

