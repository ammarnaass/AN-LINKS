import crypto from "crypto";
import { prisma } from "@/shared/db";
import { hashPassword } from "../server/auth.options";
import { sendPasswordResetEmail } from "@/lib/mailer";

export interface PasswordResetResult {
  ok: boolean;
  error?: string;
  token?: string;
}

function hashResetToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Creates a secure time-limited password reset token for a registered user.
 */
export async function createPasswordResetToken(email: string): Promise<PasswordResetResult> {
  const cleanEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  // For security, do not leak whether an email exists or not
  if (!user) {
    return { ok: true };
  }

  // Delete any existing reset tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email: cleanEmail },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email: cleanEmail,
      token: tokenHash,
      expiresAt,
    },
  });

  await sendPasswordResetEmail(cleanEmail, token);

  return { ok: true, token };
}

/**
 * Verifies a reset token and updates the user's password.
 */
export async function verifyAndResetPassword(
  token: string,
  newPassword: string
): Promise<PasswordResetResult> {
  if (!token?.trim()) {
    return { ok: false, error: "رمز الاستعادة غير صالح أو مفقود" };
  }

  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: "يجب ألا تقل كلمة المرور عن 8 أحرف" };
  }

  const trimmed = token.trim();
  const tokenHash = hashResetToken(trimmed);
  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: {
      OR: [{ token: tokenHash }, { token: trimmed }],
    },
  });

  if (!resetRecord) {
    return { ok: false, error: "رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية" };
  }

  if (resetRecord.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
    return { ok: false, error: "انتهت صلاحية هذا الرابط. يرجى طلب رابط جديد" };
  }

  const user = await prisma.user.findUnique({
    where: { email: resetRecord.email },
  });

  if (!user) {
    return { ok: false, error: "المستخدم غير موجود" };
  }

  const newHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    }),
    prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    }),
    prisma.userSession.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false },
    }),
    prisma.securityAuditLog.create({
      data: {
        userId: user.id,
        eventType: "PASSWORD_CHANGE",
        details: { method: "RESET_TOKEN" },
      },
    }),
  ]);

  return { ok: true };
}
