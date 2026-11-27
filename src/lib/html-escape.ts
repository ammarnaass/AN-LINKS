import crypto from "node:crypto";

/**
 * Escapes HTML metacharacters to prevent XSS/HTML injection in transactional emails.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validates that an external link uses http(s) before embedding in email anchors.
 */
export function sanitizeHttpUrl(raw?: string | null): string | null {
  if (!raw || typeof raw !== "string") return null;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function getUnsubscribeSecret(): string {
  return (
    process.env.MEDIA_ENTITLEMENT_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.PAYMENT_ENCRYPTION_KEY?.trim() ||
    (process.env.NODE_ENV !== "production" ? "dev_unsubscribe_secret" : "")
  );
}

export function createUnsubscribeSignature(creatorId: string, email: string): string {
  const secret = getUnsubscribeSecret();
  if (!secret) return "";
  return crypto
    .createHmac("sha256", secret)
    .update(`unsub:${creatorId}:${email.toLowerCase().trim()}`)
    .digest("hex");
}

export function verifyUnsubscribeSignature(
  creatorId: string,
  email: string,
  sig: string
): boolean {
  const expected = createUnsubscribeSignature(creatorId, email);
  if (!expected || !sig) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
