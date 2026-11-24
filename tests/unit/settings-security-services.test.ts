import { describe, it, expect } from "vitest";
import {
  validateSettingsProfile,
  validatePasswordChange,
} from "@/features/settings/validators/settings.validator";
import { generateSecret, generateSync, verifySync } from "otplib";

describe("Settings Validator Logic", () => {
  it("should reject empty or missing display names", () => {
    const res = validateSettingsProfile({
      displayName: "",
      email: "valid@example.com",
      username: "gooduser",
    });
    expect(res.valid).toBe(false);
    expect(res.error).toBe("الاسم المعروض مطلوب");
  });

  it("should reject reserved system usernames", () => {
    const res = validateSettingsProfile({
      displayName: "Administrator",
      email: "admin@example.com",
      username: "admin",
    });
    expect(res.valid).toBe(false);
    expect(res.error).toBe("اسم المستخدم هذا محجوز للنظام");
  });

  it("should accept valid profile input", () => {
    const res = validateSettingsProfile({
      displayName: "فيصل الشمري",
      email: "faisal@example.com",
      username: "faisal_pro",
    });
    expect(res.valid).toBe(true);
  });

  it("should reject password change when new password is short or mismatched", () => {
    const shortRes = validatePasswordChange("current123", "short", "short");
    expect(shortRes.valid).toBe(false);
    expect(shortRes.error).toBe("كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف");

    const mismatchRes = validatePasswordChange("current123", "password123", "password456");
    expect(mismatchRes.valid).toBe(false);
    expect(mismatchRes.error).toBe("تأكيد كلمة المرور غير متطابق");
  });

  it("should accept valid password change matching confirmation", () => {
    const res = validatePasswordChange("current123", "NewSecretPass@123", "NewSecretPass@123");
    expect(res.valid).toBe(true);
  });
});

describe("Two-Factor Authentication OTP Verification", () => {
  it("should verify valid OTP token against secret", () => {
    const secret = generateSecret();
    const token = generateSync({ secret });
    const result = verifySync({ token, secret });
    expect(result.valid).toBe(true);
  });

  it("should reject invalid OTP token", () => {
    const secret = generateSecret();
    const result = verifySync({ token: "000000", secret });
    expect(result.valid).toBe(false);
  });
});
