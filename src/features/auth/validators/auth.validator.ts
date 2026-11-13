import { isUsernameReserved } from "@/shared/utils/reserved-usernames";
import { RegistrationInput, ValidationResult } from "../types/auth.types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateUsernameFormat(rawUsername: string): string | null {
  if (!rawUsername) return null;
  const username = rawUsername.trim();
  if (username.length < 3) return "اسم المستخدم قصير جداً (3 أحرف على الأقل)";
  if (username.length > 30) return "اسم المستخدم يجب ألا يتجاوز 30 حرفاً";
  if (!USERNAME_REGEX.test(username)) {
    return "اسم المستخدم يجب أن يحتوي فقط على أحرف لاتينية، أرقام، شرطة (-) أو شرطة سفلية (_)";
  }
  if (isUsernameReserved(username)) {
    return "اسم المستخدم هذا محجوز مسبقاً من قِبل النظام";
  }
  return null;
}

export function validateRegistrationInput(input: RegistrationInput): ValidationResult {
  const errors: string[] = [];

  // Validate Email
  if (!input.email || !EMAIL_REGEX.test(input.email.trim())) {
    errors.push("صيغة البريد الإلكتروني غير صالحة");
  }

  // Validate Password
  if (!input.password || input.password.length < 8) {
    errors.push("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
  }

  // Validate Username
  const uError = validateUsernameFormat(input.username);
  if (uError) {
    errors.push(uError);
  }

  // Validate Display Name
  if (!input.displayName || input.displayName.trim().length === 0) {
    errors.push("الاسم الظاهر مطلوب");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
