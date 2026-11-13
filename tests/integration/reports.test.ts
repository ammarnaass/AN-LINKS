import { describe, it, expect } from "vitest";
import { validateReportInput } from "@/lib/report-validator";

describe("Abuse Reporting Validation", () => {
  it("should validate a proper abuse report input", () => {
    const valid = validateReportInput({
      username: "suspicious_user",
      reason: "phishing",
      details: "تحتوي الصفحة على رابط مشبوه يطلب كلمات مرور بنكية",
    });

    expect(valid.valid).toBe(true);
    expect(valid.reason).toBe("phishing");
  });

  it("should reject report if username or reason is missing", () => {
    const noUser = validateReportInput({
      username: "",
      reason: "spam",
    });
    expect(noUser.valid).toBe(false);
    expect(noUser.error).toContain("اسم المستخدم مطلوب");

    const noReason = validateReportInput({
      username: "user123",
      reason: "",
    });
    expect(noReason.valid).toBe(false);
    expect(noReason.error).toContain("سبب البلاغ مطلوب");
  });

  it("should reject invalid reason category", () => {
    const invalidReason = validateReportInput({
      username: "user123",
      reason: "not-a-valid-reason",
    });
    expect(invalidReason.valid).toBe(false);
    expect(invalidReason.error).toContain("فئة البلاغ غير صالحة");
  });

  it("should enforce character limits on report details (max 500 chars)", () => {
    const tooLong = validateReportInput({
      username: "user123",
      reason: "spam",
      details: "أ".repeat(550),
    });
    expect(tooLong.valid).toBe(false);
    expect(tooLong.error).toContain("يجب ألا تتجاوز تفاصيل البلاغ 500 حرف");
  });
});

