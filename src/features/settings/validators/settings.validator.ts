export interface ProfileSettingsInput {
  displayName: string;
  email: string;
  username: string;
  bio?: string;
  phone?: string;
}

export function validateSettingsProfile(
  input: ProfileSettingsInput
): { valid: boolean; error?: string } {
  if (!input.displayName || input.displayName.trim().length === 0) {
    return { valid: false, error: "الاسم المعروض مطلوب" };
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { valid: false, error: "البريد الإلكتروني غير صالح" };
  }
  if (!input.username || !/^[a-zA-Z0-9_-]{3,30}$/.test(input.username)) {
    return { valid: false, error: "اسم المستخدم غير صالح" };
  }
  return { valid: true };
}

export function validatePasswordChange(
  currentPass: string,
  newPass: string,
  confirmPass: string
): { valid: boolean; error?: string } {
  if (!currentPass) return { valid: false, error: "كلمة المرور الحالية مطلوبة" };
  if (!newPass || newPass.length < 8) {
    return { valid: false, error: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف" };
  }
  if (newPass !== confirmPass) {
    return { valid: false, error: "تأكيد كلمة المرور غير متطابق" };
  }
  return { valid: true };
}

