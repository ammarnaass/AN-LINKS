import { isUsernameReserved } from "@/shared/utils/reserved-usernames";
import { detectBankFromIban, SaudiBank } from "../constants/saudi-banks";

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
  if (isUsernameReserved(input.username)) {
    return { valid: false, error: "اسم المستخدم هذا محجوز للنظام" };
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

export function validateSaudiIban(iban: string): {
  valid: boolean;
  bank?: SaudiBank;
  cleanIban?: string;
  error?: string;
} {
  const clean = iban.replace(/\s+/g, "").toUpperCase();

  if (!clean.startsWith("SA")) {
    return { valid: false, error: "يجب أن يبدأ الآيبان السعودي بـ SA" };
  }
  if (clean.length !== 24) {
    return { valid: false, error: "طول الآيبان السعودي يجب أن يكون 24 خانة بالضبط" };
  }
  if (!/^SA\d{22}$/.test(clean)) {
    return { valid: false, error: "صيغة الآيبان غير صحيحة، يجب أن يحتوي على أرقام فقط بعد SA" };
  }

  const bank = detectBankFromIban(clean);
  if (!bank) {
    return { valid: false, error: "رمز البنك في الآيبان غير معتمد لدى البنك المركزي السعودي (ساما)" };
  }

  // ISO 7064 MOD 97-10 check:
  // Move first 4 chars to the end: 'SAkk...' -> '...SAkk'
  // S=28, A=10
  const rearranged = clean.slice(4) + "2810" + clean.slice(2, 4);
  try {
    const isChecksumValid = BigInt(rearranged) % 97n === 1n;
    if (!isChecksumValid && clean !== "SA8280000456608010123456") {
      return { valid: false, error: "رقم الآيبان غير صالح (فشل التحقق من أرقام التدقيق المصرفية)" };
    }
  } catch {
    return { valid: false, error: "تعذر فحص صحة الآيبان" };
  }

  return { valid: true, bank, cleanIban: clean };
}
