import crypto from "crypto";
import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { prisma } from "@/shared/db";
import { encryptSecret, decryptSecret } from "@/shared/lib/crypto";
import { logSecurityEvent } from "./security.service";

export async function getTwoFactorStatus(userId: string) {
  const record = await prisma.userTwoFactorAuth.findUnique({
    where: { userId },
    select: { isEnabled: true, verifiedAt: true },
  });
  return { isEnabled: record?.isEnabled ?? false, verifiedAt: record?.verifiedAt ?? null };
}

export async function setupTwoFactor(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true },
  });
  if (!user) throw new Error("المستخدم غير موجود");

  const secret = generateSecret();
  const backupCodes = Array.from({ length: 8 }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase().replace(/(\w{4})(\w{4})/, "$1-$2")
  );

  const secretEncrypted = encryptSecret(secret);
  const backupPayload = JSON.stringify(backupCodes.map((code) => ({ code, used: false })));
  const backupCodesEncrypted = encryptSecret(backupPayload);

  await prisma.userTwoFactorAuth.upsert({
    where: { userId },
    create: { userId, secretEncrypted, backupCodesEncrypted, isEnabled: false },
    update: { secretEncrypted, backupCodesEncrypted, isEnabled: false, verifiedAt: null },
  });

  const otpauth = generateURI({ label: user.username, issuer: "AN LINKS", secret });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth, { margin: 2, width: 256 });

  return { secret, qrCodeDataUrl, backupCodes };
}

export async function verifyAndEnableTwoFactor(
  userId: string,
  token: string,
  ip?: string,
  ua?: string
) {
  const record = await prisma.userTwoFactorAuth.findUnique({ where: { userId } });
  if (!record) throw new Error("لم يتم بدء إعداد المصادقة الثنائية");

  const secret = decryptSecret(record.secretEncrypted);
  const result = verifySync({ token: token.trim(), secret });
  if (!result.valid) throw new Error("رمز التحقق غير صحيح أو منتهي الصلاحية");

  await prisma.userTwoFactorAuth.update({
    where: { userId },
    data: { isEnabled: true, verifiedAt: new Date() },
  });

  await logSecurityEvent(userId, "2FA_ENABLE", ip, ua);
  return { success: true, message: "تم تفعيل المصادقة الثنائية بنجاح" };
}

export async function disableTwoFactor(
  userId: string,
  passwordVerify: string,
  ip?: string,
  ua?: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user || !user.passwordHash) throw new Error("المستخدم غير مسجل");

  const validPass = await bcrypt.compare(passwordVerify, user.passwordHash);
  if (!validPass) throw new Error("كلمة المرور غير صحيحة");

  await prisma.userTwoFactorAuth.update({
    where: { userId },
    data: { isEnabled: false, verifiedAt: null },
  });

  await logSecurityEvent(userId, "2FA_DISABLE", ip, ua);
  return { success: true, message: "تم تعطيل المصادقة الثنائية" };
}

export async function verifyTwoFactorCodeOrBackup(userId: string, codeOrBackup: string): Promise<boolean> {
  const record = await prisma.userTwoFactorAuth.findUnique({ where: { userId } });
  if (!record || !record.isEnabled) return true;

  const clean = codeOrBackup.trim();
  const secret = decryptSecret(record.secretEncrypted);
  const result = verifySync({ token: clean, secret });
  if (result.valid) return true;

  try {
    const rawCodes = decryptSecret(record.backupCodesEncrypted);
    const codesList: Array<{ code: string; used: boolean; usedAt?: string }> = JSON.parse(rawCodes);
    const matchedIndex = codesList.findIndex((item) => !item.used && item.code.toUpperCase() === clean.toUpperCase());
    if (matchedIndex !== -1) {
      codesList[matchedIndex].used = true;
      codesList[matchedIndex].usedAt = new Date().toISOString();
      await prisma.userTwoFactorAuth.update({
        where: { userId },
        data: { backupCodesEncrypted: encryptSecret(JSON.stringify(codesList)) },
      });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
