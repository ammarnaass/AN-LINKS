import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH_BYTES = 16; // 128-bit authentication tag

/**
 * Retrieves and validates the 32-byte encryption key from the environment.
 * Accepts either a 64-character hex string or a 32-byte raw string.
 */
function getEncryptionKey(): Buffer {
  const rawKey = process.env.PAYMENT_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error(
      "PAYMENT_ENCRYPTION_KEY environment variable is missing. It must be set to 32 bytes (64 hex characters or 32 raw bytes)."
    );
  }

  // Check 64-character hex representation
  if (rawKey.length === 64 && /^[0-9a-fA-F]{64}$/.test(rawKey)) {
    return Buffer.from(rawKey, "hex");
  }

  // Check 32 raw UTF-8 bytes
  const utf8Buffer = Buffer.from(rawKey, "utf-8");
  if (utf8Buffer.length === 32) {
    return utf8Buffer;
  }

  throw new Error(
    "PAYMENT_ENCRYPTION_KEY must be 32 bytes (64 hex characters or 32 raw bytes)."
  );
}

/**
 * Encrypts a plain-text secret using AES-256-GCM.
 * Returns payload formatted as `${ivHex}:${authTagHex}:${encryptedHex}`.
 */
export function encryptSecret(plainText: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM cipher payload in format `${ivHex}:${authTagHex}:${encryptedHex}`.
 * Throws an informative error if payload format is malformed or tampering occurs.
 */
export function decryptSecret(cipherPayload: string): string {
  if (typeof cipherPayload !== "string" || !cipherPayload.trim()) {
    throw new Error("Invalid cipher payload: payload must be a non-empty string");
  }

  const parts = cipherPayload.split(":");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid cipher payload format: expected ${ivHex}:${authTagHex}:${encryptedHex}"
    );
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  if (!ivHex || !authTagHex) {
    throw new Error(
      "Invalid cipher payload: IV and auth tag must be present non-empty hex strings"
    );
  }

  const key = getEncryptionKey();

  try {
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    if (iv.length !== IV_LENGTH_BYTES && iv.length !== 16) {
      throw new Error(`Invalid IV length: expected ${IV_LENGTH_BYTES} or 16 bytes`);
    }

    if (authTag.length !== AUTH_TAG_LENGTH_BYTES) {
      throw new Error(`Invalid auth tag length: expected ${AUTH_TAG_LENGTH_BYTES} bytes`);
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err: unknown) {
    throw new Error(
      `Failed to decrypt secret (tampered or malformed payload): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

/**
 * Masks a secret string for safe display or logging.
 * Retains recognizable provider prefix (e.g., sk_live_, whsec_) and last 4 characters.
 * Example: `sk_live_51NzABC1234567890abcdef3a8f` -> `sk_live_••••••••3a8f`
 */
export function maskSecret(secret: string): string {
  if (!secret) return "";

  // If already masked, preserve it without altering
  if (secret.includes("••••")) return secret;

  const MASK_BULLETS = "••••••••";

  // Check for common prefix patterns (e.g. sk_live_, sk_test_, whsec_, pk_live_, etc.)
  const prefixMatch = secret.match(/^([a-zA-Z0-9]+_(?:[a-zA-Z0-9]+_)?)(\S+)$/);
  if (prefixMatch) {
    const prefix = prefixMatch[1];
    const rest = prefixMatch[2];
    if (rest.length <= 4) {
      return `${prefix}${MASK_BULLETS}`;
    }
    const suffix = rest.slice(-4);
    return `${prefix}${MASK_BULLETS}${suffix}`;
  }

  // Without recognizable underscore prefix
  if (secret.length <= 8) {
    return MASK_BULLETS;
  }

  const suffix = secret.slice(-4);
  return `${MASK_BULLETS}${suffix}`;
}
