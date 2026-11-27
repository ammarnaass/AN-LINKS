import crypto from "crypto";
import { decryptSecret } from "@/shared/lib/crypto";

const ENCRYPTED_SECRET_REGEX = /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i;

export function resolveWebhookSigningSecret(storedSecret: string): string {
  if (!storedSecret) return "";
  if (ENCRYPTED_SECRET_REGEX.test(storedSecret.trim())) {
    try {
      return decryptSecret(storedSecret.trim());
    } catch {
      return storedSecret;
    }
  }
  return storedSecret;
}

export function createWebhookSignature(
  payload: string,
  secret: string,
  timestamp?: number
): string {
  const ts = timestamp ?? Math.floor(Date.now() / 1000);
  const signaturePayload = `${ts}.${payload}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(signaturePayload)
    .digest("hex");

  return `t=${ts},v1=${hmac}`;
}

export function verifyWebhookSignature(
  payload: string,
  header: string,
  secret: string,
  toleranceSeconds = 300
): boolean {
  try {
    const parts = header.split(",");
    const tPart = parts.find((p) => p.startsWith("t="));
    const v1Part = parts.find((p) => p.startsWith("v1="));

    if (!tPart || !v1Part) return false;

    const timestamp = parseInt(tPart.substring(2), 10);
    const signature = v1Part.substring(3);

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > toleranceSeconds) {
      return false; // Signature expired
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}
