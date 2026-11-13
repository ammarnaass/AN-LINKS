import { describe, it, expect } from "vitest";
import {
  validateSettingsProfile,
  validatePasswordChange,
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
});
