import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateRegistrationInput, hashPassword, verifyPassword } from "@/lib/auth";

describe("Authentication & Registration Logic", () => {
  it("should validate valid registration inputs successfully", () => {
    const res = validateRegistrationInput({
      email: "test@example.com",
      password: "securepassword123",
      username: "designer_sa",
      displayName: "المصمم أحمد",
    });

    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("should reject invalid email formats", () => {
    const res = validateRegistrationInput({
      email: "not-an-email",
      password: "securepassword123",
      username: "designer_sa",
      displayName: "أحمد",
    });

    expect(res.valid).toBe(false);
    expect(res.errors).toContain("صيغة البريد الإلكتروني غير صالحة");
  });

  it("should reject short passwords", () => {
    const res = validateRegistrationInput({
      email: "test@example.com",
      password: "123",
      username: "designer_sa",
      displayName: "أحمد",
    });

    expect(res.valid).toBe(false);
    expect(res.errors).toContain("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
  });

  it("should reject usernames with non-alphanumeric/invalid characters", () => {
    const res = validateRegistrationInput({
      email: "test@example.com",
      password: "securepassword123",
      username: "user name with spaces!",
      displayName: "أحمد",
    });

    expect(res.valid).toBe(false);
    expect(res.errors).toContain("اسم المستخدم يجب أن يحتوي فقط على أحرف لاتينية، أرقام، شرطة (-) أو شرطة سفلية (_)");
  });

  it("should reject reserved usernames like api, dashboard, admin", () => {
    const res = validateRegistrationInput({
      email: "test@example.com",
      password: "securepassword123",
      username: "dashboard",
      displayName: "أحمد",
    });

    expect(res.valid).toBe(false);
    expect(res.errors).toContain("اسم المستخدم هذا محجوز مسبقاً من قِبل النظام");
  });

  it("should reject short or long usernames", () => {
    const shortRes = validateRegistrationInput({
      email: "test@example.com",
      password: "securepassword123",
      username: "ab",
      displayName: "أحمد",
    });
    expect(shortRes.valid).toBe(false);

    const longRes = validateRegistrationInput({
      email: "test@example.com",
      password: "securepassword123",
      username: "a".repeat(35),
      displayName: "أحمد",
    });
    expect(longRes.valid).toBe(false);
  });

  it("should securely hash and verify passwords using bcryptjs", async () => {
    const password = "mySuperSecretPassword123";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await verifyPassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("wrongPassword", hash);
    expect(isWrongMatch).toBe(false);
  });
});
