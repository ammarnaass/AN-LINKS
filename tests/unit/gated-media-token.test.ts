import { describe, it, expect } from "vitest";
import {
  createEntitlementToken,
  verifyEntitlementToken,
} from "@/features/bio/services/gated-media.service";

describe("Gated Media Signed Entitlement Token Engine", () => {
  const secret = "anlinks_media_secret_test_key_123456";
  const productId = "prod_course_123";
  const buyerEmail = "student@example.com";

  it("should create a valid entitlement token and verify it successfully", () => {
    const token = createEntitlementToken(productId, buyerEmail, secret, 24);
    expect(token).toBeDefined();
    expect(token.split(".")).toHaveLength(4);

    const verified = verifyEntitlementToken(token, secret);
    expect(verified.valid).toBe(true);
    expect(verified.productId).toBe(productId);
    expect(verified.buyerEmail).toBe(buyerEmail);
  });

  it("should reject token signed with a different secret", () => {
    const token = createEntitlementToken(productId, buyerEmail, secret, 24);
    const verified = verifyEntitlementToken(token, "wrong_secret_key");
    expect(verified.valid).toBe(false);
    expect(verified.reason).toBe("INVALID_SIGNATURE");
  });

  it("should reject an expired token", () => {
    // TTL = -1 hour (already expired)
    const token = createEntitlementToken(productId, buyerEmail, secret, -1);
    const verified = verifyEntitlementToken(token, secret);
    expect(verified.valid).toBe(false);
    expect(verified.reason).toBe("TOKEN_EXPIRED");
  });

  it("should reject a tampered token", () => {
    const token = createEntitlementToken(productId, buyerEmail, secret, 24);
    const parts = token.split(".");
    // Tamper the product ID
    parts[0] = "tampered_prod_id";
    const tamperedToken = parts.join(".");

    const verified = verifyEntitlementToken(tamperedToken, secret);
    expect(verified.valid).toBe(false);
    expect(verified.reason).toBe("INVALID_SIGNATURE");
  });
});
