import { describe, it, expect } from "vitest";
import { sanitizeClaimUsername } from "@/lib/claim-validator";

describe("Landing Page Handle Claim Validator", () => {
  it("should sanitize valid latin username", () => {
    const result = sanitizeClaimUsername("salman");
    expect(result.isValid).toBe(true);
    expect(result.username).toBe("salman");
    expect(result.targetUrl).toBe("/register?username=salman");
  });

  it("should strip leading @ and trim whitespace and convert to lowercase", () => {
    const result = sanitizeClaimUsername("  @Ammar-Dev  ");
    expect(result.isValid).toBe(true);
    expect(result.username).toBe("ammar-dev");
    expect(result.targetUrl).toBe("/register?username=ammar-dev");
  });

  it("should reject empty or whitespace-only inputs gracefully", () => {
    const result = sanitizeClaimUsername("   ");
    expect(result.isValid).toBe(false);
    expect(result.username).toBe("");
    expect(result.targetUrl).toBe("/register");
    expect(result.error).toBe("يرجى إدخال اسم مستخدم");
  });

  it("should reject usernames with invalid characters", () => {
    const result = sanitizeClaimUsername("user!@#$");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطة فقط");
  });

  it("should reject usernames that are too short or too long", () => {
    expect(sanitizeClaimUsername("a").isValid).toBe(false);
    expect(sanitizeClaimUsername("a".repeat(31)).isValid).toBe(false);
  });
});
