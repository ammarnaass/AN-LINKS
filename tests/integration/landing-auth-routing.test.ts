import { describe, it, expect } from "vitest";
import { sanitizeClaimUsername } from "@/lib/claim-validator";
import { validateRegistrationInput } from "@/lib/auth";

describe("Landing Auth Routing & Direct Navigation (Task 1)", () => {
  it("should generate direct registration URL with username query from handle claim", () => {
    const claim = sanitizeClaimUsername("sara_creator");
    expect(claim.isValid).toBe(true);
    expect(claim.username).toBe("sara_creator");
    expect(claim.targetUrl).toBe("/register?username=sara_creator");
  });

  it("should fallback to clean /register when handle is empty or whitespace", () => {
    const claim = sanitizeClaimUsername("   ");
    expect(claim.isValid).toBe(false);
    expect(claim.targetUrl).toBe("/register");
  });

  it("should validate that registration input accepts pre-filled claimed username", () => {
    const validation = validateRegistrationInput({
      displayName: "سارة المبدعة",
      username: "sara_creator",
      email: "sara_creator@test.sa",
      password: "StrongPassword#2026",
    });

    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it("should reject invalid username formats when passed from URL", () => {
    const validation = validateRegistrationInput({
      displayName: "مستخدم",
      username: "invalid user name!",
      email: "user@test.sa",
      password: "StrongPassword#2026",
    });

    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
