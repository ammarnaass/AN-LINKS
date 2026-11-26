export interface ReferralCodeValidationResult {
  isValid: boolean;
  error?: string;
}

const REFERRAL_CODE_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

export function validateReferralCode(code: string): ReferralCodeValidationResult {
  if (!code || typeof code !== "string") {
    return { isValid: false, error: "كود الإحالة مطلوب" };
  }
  const clean = code.trim();
  if (clean.length < 3 || clean.length > 30) {
    return { isValid: false, error: "كود الإحالة يجب أن يتراوح بين 3 و 30 حرفاً" };
  }
  if (!REFERRAL_CODE_REGEX.test(clean)) {
    return { isValid: false, error: "كود الإحالة يحتوي على رموز غير مسموحة" };
  }
  return { isValid: true };
}
