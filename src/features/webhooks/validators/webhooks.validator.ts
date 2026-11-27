import dns from "node:dns/promises";
import net from "node:net";

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^0\./,
  /^0\.0\.0\.0$/,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/, // CGNAT 100.64.0.0/10
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // AWS/GCP link-local metadata
  /^::$/,
  /^::1$/,
  /^::ffff:/i,
  /^f[cd][0-9a-f]{2}:/i, // IPv6 ULA fc00::/7
  /^fe[89ab][0-9a-f]:/i, // IPv6 link-local fe80::/10
  /^(0x[0-9a-f]+|0[0-7]+|\d+)$/i, // Single numeric/octal/hex encoded IP
];

export function isPrivateOrLocalIp(hostname: string): boolean {
  const cleanHost = hostname.replace(/^\[|\]$/g, "").trim().toLowerCase();
  if (!cleanHost) return true;
  if (net.isIPv4(cleanHost)) {
    const parts = cleanHost.split(".").map(Number);
    const [a, b] = parts;
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    return false;
  }
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(cleanHost));
}

export function validateWebhookUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }
    if (url.username || url.password) {
      return false;
    }
    if (isPrivateOrLocalIp(url.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function assertSafeWebhookUrl(
  urlStr: string
): Promise<{ ok: boolean; error?: string }> {
  if (!validateWebhookUrl(urlStr)) {
    return {
      ok: false,
      error: "يجب تقديم رابط ويب صالح وآمن (غير محلي أو خاص)",
    };
  }
  try {
    const parsed = new URL(urlStr);
    const cleanHost = parsed.hostname.replace(/^\[|\]$/g, "");
    if (net.isIP(cleanHost)) {
      return isPrivateOrLocalIp(cleanHost)
        ? { ok: false, error: "محظور الاتصال بعناوين IP خاصة أو داخلية" }
        : { ok: true };
    }
    const resolved = await dns.lookup(cleanHost, { all: true });
    if (!resolved.length || resolved.some((entry) => isPrivateOrLocalIp(entry.address))) {
      return {
        ok: false,
        error: "اسم النطاق يوجّه إلى عنوان شبكة داخلية أو محجوبة",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "تعذر التحقق من عنوان DNS الخاص بالرابط الخارجي",
    };
  }
}

export interface WebhookEndpointValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateWebhookEndpointInput(input: {
  url: string;
  events: string[];
}): WebhookEndpointValidationResult {
  if (!input.url || !validateWebhookUrl(input.url)) {
    return {
      isValid: false,
      error: "يجب تقديم رابط ويب صالح وآمن (غير محلي أو خاص)",
    };
  }

  if (!Array.isArray(input.events) || input.events.length === 0) {
    return {
      isValid: false,
      error: "يجب تحديد حدث واحد على الأقل",
    };
  }

  return { isValid: true };
}
