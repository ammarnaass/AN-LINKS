import crypto from "crypto";

export interface EntitlementVerificationResult {
  valid: boolean;
  productId?: string;
  buyerEmail?: string;
  reason?: string;
}

export function createEntitlementToken(
  productId: string,
  buyerEmail: string,
  secret: string,
  ttlHours = 720 // 30 days default
): string {
  const expiryTimestamp = Math.floor(Date.now() / 1000) + ttlHours * 3600;
  const pB64 = Buffer.from(productId).toString("base64url");
  const eB64 = Buffer.from(buyerEmail.toLowerCase().trim()).toString("base64url");

  const dataPayload = `${pB64}.${eB64}.${expiryTimestamp}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataPayload)
    .digest("hex");

  return `${pB64}.${eB64}.${expiryTimestamp}.${signature}`;
}

export function verifyEntitlementToken(
  token: string,
  secret: string
): EntitlementVerificationResult {
  try {
    if (!token || typeof token !== "string") {
      return { valid: false, reason: "MISSING_TOKEN" };
    }

    const parts = token.split(".");
    if (parts.length !== 4) {
      return { valid: false, reason: "MALFORMED_TOKEN" };
    }

    const [pB64, eB64, expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);
    const now = Math.floor(Date.now() / 1000);

    if (now > expiry) {
      return { valid: false, reason: "TOKEN_EXPIRED" };
    }

    const dataPayload = `${pB64}.${eB64}.${expiryStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(dataPayload)
      .digest("hex");

    const validSig = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );

    if (!validSig) {
      return { valid: false, reason: "INVALID_SIGNATURE" };
    }

    const productId = Buffer.from(pB64, "base64url").toString("utf-8");
    const buyerEmail = Buffer.from(eB64, "base64url").toString("utf-8");

    return {
      valid: true,
      productId,
      buyerEmail,
    };
  } catch {
    return { valid: false, reason: "VERIFICATION_ERROR" };
  }
}
