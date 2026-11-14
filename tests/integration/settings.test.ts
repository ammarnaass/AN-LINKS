import { describe, it, expect } from "vitest";
import {
  validateSettingsProfile,
  validatePasswordChange,
  validateSaudiIban,
  ProfileSettingsInput,
} from "@/lib/dashboard-actions";

describe("Account & Security Settings Logic", () => {

  it("should validate profile settings updates successfully", () => {
    const valid = validateSettingsProfile({
      displayName: "طارق المنصور",
      email: "tariq@example.com",
      username: "tariq",
      bio: "مطور ومصمم",
    });
    expect(valid.valid).toBe(true);
  });

  it("should reject invalid email or invalid username slug", () => {
    const invalidEmail = validateSettingsProfile({
      displayName: "طارق",
      email: "invalid-email",
      username: "tariq",
    });
    expect(invalidEmail.valid).toBe(false);
    expect(invalidEmail.error).toContain("البريد الإلكتروني");

    const invalidSlug = validateSettingsProfile({
      displayName: "طارق",
      email: "tariq@example.com",
      username: "a", // too short
    });
    expect(invalidSlug.valid).toBe(false);
    expect(invalidSlug.error).toContain("اسم المستخدم");
  });

  it("should validate password change constraints", () => {
    expect(validatePasswordChange("", "newPass123", "newPass123").valid).toBe(false);
    expect(validatePasswordChange("oldPass", "short", "short").valid).toBe(false);
    expect(validatePasswordChange("oldPass", "newPass123", "mismatch").valid).toBe(false);
    expect(validatePasswordChange("oldPass", "newPass123", "newPass123").valid).toBe(true);
  });

  it("should validate Saudi IBAN format for local bank payouts matching Stitch _8", () => {
    expect(validateSaudiIban("SA82 8000 0456 6080 1012 3456").valid).toBe(true);
    expect(validateSaudiIban("SA8280000456608010123456").valid).toBe(true);
    expect(validateSaudiIban("US8280000456608010123456").valid).toBe(false);
    expect(validateSaudiIban("SA123").valid).toBe(false);
  });
});
