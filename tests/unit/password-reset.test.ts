import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createPasswordResetToken,
  verifyAndResetPassword,
} from "@/features/auth/services/password-reset.service";
import { prisma } from "@/shared/db";

describe("Password Reset Service Unit Tests", () => {
  beforeEach(async () => {
    // Clean up reset tokens
    await prisma.passwordResetToken.deleteMany({
      where: { email: { in: ["reset-test@anlinks.dev", "nonexistent@anlinks.dev"] } },
    });
  });

  it("handles non-existent user safely without throwing error or leaking state", async () => {
    const res = await createPasswordResetToken("nonexistent@anlinks.dev");
    expect(res.ok).toBe(true);
    expect(res.token).toBeUndefined();
  });

  it("rejects reset when token is missing or password is too short", async () => {
    const res1 = await verifyAndResetPassword("", "ValidPass123!");
    expect(res1.ok).toBe(false);
    expect(res1.error).toContain("غير صالح");

    const res2 = await verifyAndResetPassword("sometoken", "short");
    expect(res2.ok).toBe(false);
    expect(res2.error).toContain("8 أحرف");
  });

  it("rejects reset with non-existent token", async () => {
    const res = await verifyAndResetPassword("definitely_not_a_valid_token_xyz_123", "ValidNewPassword123!");
    expect(res.ok).toBe(false);
    expect(res.error).toContain("غير صالح أو منتهي الصلاحية");
  });

  it("rejects expired token and deletes it", async () => {
    const expiredToken = "expired_token_mock_test_123456789";
    await prisma.passwordResetToken.create({
      data: {
        email: "reset-test@anlinks.dev",
        token: expiredToken,
        expiresAt: new Date(Date.now() - 60000), // 1 minute in the past
      },
    });

    const res = await verifyAndResetPassword(expiredToken, "ValidNewPassword123!");
    expect(res.ok).toBe(false);
    expect(res.error).toContain("انتهت صلاحية");

    // Token should have been removed
    const remaining = await prisma.passwordResetToken.findUnique({
      where: { token: expiredToken },
    });
    expect(remaining).toBeNull();
  });
});
