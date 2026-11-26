import { AvailabilityRuleInput, ReserveSlotInput } from "../types/appointments.types";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAvailabilityRule(
  rule: AvailabilityRuleInput
): ValidationResult {
  if (rule.dayOfWeek < 0 || rule.dayOfWeek > 6) {
    return { isValid: false, error: "يوم الأسبوع غير صالح (0 إلى 6)" };
  }
  if (!TIME_REGEX.test(rule.startTime)) {
    return { isValid: false, error: "صيغة وقت البداية غير صالحة (HH:MM)" };
  }
  if (!TIME_REGEX.test(rule.endTime)) {
    return { isValid: false, error: "صيغة وقت النهاية غير صالحة (HH:MM)" };
  }
  if (![15, 30, 45, 60].includes(rule.slotMinutes)) {
    return {
      isValid: false,
      error: "مدة الجلسة يجب أن تكون 15، 30، 45 أو 60 دقيقة",
    };
  }
  if (rule.startTime >= rule.endTime) {
    return {
      isValid: false,
      error: "وقت النهاية يجب أن يكون بعد وقت البداية",
    };
  }
  return { isValid: true };
}

export function validateReserveSlotInput(
  input: ReserveSlotInput
): ValidationResult {
  if (!input.serviceId) {
    return { isValid: false, error: "معرف الخدمة مطلوب" };
  }
  if (!input.creatorId) {
    return { isValid: false, error: "معرف صانع المحتوى مطلوب" };
  }
  if (!input.clientName || input.clientName.trim().length < 2) {
    return { isValid: false, error: "الاسم يجب ألا يقل عن حرفين" };
  }
  if (!input.clientEmail || !EMAIL_REGEX.test(input.clientEmail)) {
    return { isValid: false, error: "البريد الإلكتروني غير صالح" };
  }
  if (!(input.startTime instanceof Date) || isNaN(input.startTime.getTime())) {
    return { isValid: false, error: "وقت البداية غير صالح" };
  }
  if (!(input.endTime instanceof Date) || isNaN(input.endTime.getTime())) {
    return { isValid: false, error: "وقت النهاية غير صالح" };
  }
  if (input.endTime <= input.startTime) {
    return { isValid: false, error: "وقت النهاية يجب أن يكون بعد وقت البداية" };
  }
  return { isValid: true };
}
