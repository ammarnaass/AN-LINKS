import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { encryptSecret, decryptSecret, maskSecret } from "@/shared/lib/crypto";

describe("Core Cryptography (AES-256-GCM)", () => {
  const originalEnv = process.env.PAYMENT_ENCRYPTION_KEY;
  const VALID_HEX_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const VALID_32BYTE_RAW_KEY = "12345678901234567890123456789012";

  beforeEach(() => {
    process.env.PAYMENT_ENCRYPTION_KEY = VALID_HEX_KEY;
  });

  afterEach(() => {
    process.env.PAYMENT_ENCRYPTION_KEY = originalEnv;
  });

  describe("encryptSecret", () => {
    it("encrypts plaintext and returns format ${ivHex}:${authTagHex}:${encryptedHex}", () => {
      const plaintext = "sk_live_very_secret_api_key_12345";
      const cipherPayload = encryptSecret(plaintext);

      expect(cipherPayload).toBeTypeOf("string");
      const parts = cipherPayload.split(":");
      expect(parts).toHaveLength(3);

      const [ivHex, authTagHex, encryptedHex] = parts;
      expect(ivHex).toMatch(/^[0-9a-fA-F]+$/);
      // GCM standard IV is 12 bytes = 24 hex characters
      expect(ivHex.length).toBe(24);
      // Auth Tag is 16 bytes = 32 hex characters
      expect(authTagHex).toMatch(/^[0-9a-fA-F]{32}$/);
      // Encrypted hex
      expect(encryptedHex).toMatch(/^[0-9a-fA-F]+$/);
      expect(encryptedHex.length).toBeGreaterThan(0);
    });

    it("produces different ciphertexts (different IVs) for the same plaintext", () => {
      const plaintext = "fixed_secret_value";
      const cipher1 = encryptSecret(plaintext);
      const cipher2 = encryptSecret(plaintext);

      expect(cipher1).not.toBe(cipher2);
      expect(cipher1.split(":")[0]).not.toBe(cipher2.split(":")[0]);
    });

    it("works with a 32 raw bytes key", () => {
      process.env.PAYMENT_ENCRYPTION_KEY = VALID_32BYTE_RAW_KEY;
      const cipher = encryptSecret("test_payload");
      const decrypted = decryptSecret(cipher);
      expect(decrypted).toBe("test_payload");
    });

    it("throws an error when PAYMENT_ENCRYPTION_KEY is missing", () => {
      delete process.env.PAYMENT_ENCRYPTION_KEY;
      expect(() => encryptSecret("my_secret")).toThrow(/PAYMENT_ENCRYPTION_KEY/i);
    });

    it("throws an error when PAYMENT_ENCRYPTION_KEY is of invalid length", () => {
      process.env.PAYMENT_ENCRYPTION_KEY = "too_short_key";
      expect(() => encryptSecret("my_secret")).toThrow(/32 bytes/i);

      process.env.PAYMENT_ENCRYPTION_KEY = "0123456789abcdef"; // 16 chars
      expect(() => encryptSecret("my_secret")).toThrow(/32 bytes/i);
    });
  });

  describe("decryptSecret", () => {
    it("decrypts valid ciphertext back to original plaintext", () => {
      const plaintexts = [
        "sk_live_51M0abcdef123456789",
        "whsec_test_webhook_secret_998877",
        "رمز-سري-عربي-معقد-12345",
        "Special chars: !@#$%^&*()_+~`-={}|[]:\";'<>?,./",
        "",
      ];

      for (const text of plaintexts) {
        const encrypted = encryptSecret(text);
        const decrypted = decryptSecret(encrypted);
        expect(decrypted).toBe(text);
      }
    });

    it("throws informative error on malformed payload format", () => {
      const malformedPayloads = [
        "",
        "not-a-valid-payload",
        "only:two:parts:here:extra",
        "::",
        "singlepart",
      ];

      for (const malformed of malformedPayloads) {
        expect(() => decryptSecret(malformed)).toThrow(/Invalid cipher payload/i);
      }
    });

    it("throws an informative error if tampering occurs on ciphertext or auth tag", () => {
      const encrypted = encryptSecret("confidential_payment_data");
      const [ivHex, authTagHex, encryptedHex] = encrypted.split(":");

      // Tamper ciphertext
      const tamperedCipher = encryptedHex.slice(0, -2) + (encryptedHex.endsWith("aa") ? "bb" : "aa");
      const tamperedPayload = `${ivHex}:${authTagHex}:${tamperedCipher}`;
      expect(() => decryptSecret(tamperedPayload)).toThrow(/tamper|fail/i);

      // Tamper auth tag
      const tamperedTag = authTagHex.slice(0, -2) + (authTagHex.endsWith("00") ? "11" : "00");
      const tamperedTagPayload = `${ivHex}:${tamperedTag}:${encryptedHex}`;
      expect(() => decryptSecret(tamperedTagPayload)).toThrow(/tamper|fail/i);
    });

    it("throws an error if decryption key changes or is invalid", () => {
      const encrypted = encryptSecret("secret_value");
      process.env.PAYMENT_ENCRYPTION_KEY = "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210";
      expect(() => decryptSecret(encrypted)).toThrow(/tamper|fail/i);
    });
  });

  describe("maskSecret", () => {
    it("masks Stripe/payment API keys preserving prefix and last 4 chars", () => {
      expect(maskSecret("sk_live_51NzABC1234567890abcdef3a8f")).toBe("sk_live_••••••••3a8f");
      expect(maskSecret("sk_test_51NzABC1234567890abcdef3a8f")).toBe("sk_test_••••••••3a8f");
      expect(maskSecret("whsec_51NzABC1234567890abcdef3a8f")).toBe("whsec_••••••••3a8f");
      expect(maskSecret("pk_live_51NzABC1234567890abcdef3a8f")).toBe("pk_live_••••••••3a8f");
    });

    it("masks secrets without prefix displaying mask and last 4 chars", () => {
      expect(maskSecret("mySecretTokenLongerThanEight3a8f")).toBe("••••••••3a8f");
    });

    it("masks short secrets entirely", () => {
      expect(maskSecret("12345678")).toBe("••••••••");
      expect(maskSecret("short")).toBe("••••••••");
    });

    it("handles empty or blank string gracefully", () => {
      expect(maskSecret("")).toBe("");
    });

    it("preserves already masked secrets without double masking", () => {
      const alreadyMasked = "sk_live_••••••••3a8f";
      expect(maskSecret(alreadyMasked)).toBe(alreadyMasked);
    });
  });
});

