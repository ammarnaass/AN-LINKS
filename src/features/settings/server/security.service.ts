import bcrypt from "bcryptjs";
import { prisma } from "@/shared/db";
import { validatePasswordChange } from "../validators/settings.validator";

export async function logSecurityEvent(
  userId: string,
  eventType: string,
  ipAddress?: string,
  userAgent?: string,
  details?: Record<string, unknown>
) {
  try {
    await prisma.securityAuditLog.create({
      data: {
        userId,
        eventType,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        details: details ? JSON.parse(JSON.stringify(details)) : undefined,
      },
    });
  } catch (err) {
    console.error("Failed to log security event:", err);
  }
}

export async function changePassword(
  userId: string,
  currentPass: string,
  newPass: string,
  confirmPass: string,
  ipAddress?: string,
  userAgent?: string
) {
  const validation = validatePasswordChange(currentPass, newPass, confirmPass);
  if (!validation.valid) {
    throw new Error(validation.error || "بيانات تغيير كلمة المرور غير صالحة");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user || !user.passwordHash) {
    throw new Error("المستخدم غير موجود أو لا يملك كلمة مرور مسجلة");
  }

  const isValid = await bcrypt.compare(currentPass, user.passwordHash);
  if (!isValid) {
    await logSecurityEvent(userId, "PASSWORD_CHANGE_FAILED", ipAddress, userAgent);
    throw new Error("كلمة المرور الحالية غير صحيحة");
  }

  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPass, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  await logSecurityEvent(userId, "PASSWORD_CHANGE", ipAddress, userAgent);
  return { success: true, message: "تم تحديث كلمة المرور بنجاح" };
}

export async function getSecurityAuditLogs(userId: string, limit = 15) {
  return prisma.securityAuditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      eventType: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      details: true,
    },
  });
}
