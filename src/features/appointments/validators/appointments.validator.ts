import {
  AvailabilityRuleInput,
  ReserveSlotInput,
  ServiceInput,
} from "../types/appointments.types";
import { isValidCalendarDateStr } from "../utils/timezone";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const BOOKING_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseClockMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isValidSafeHttpsUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.startsWith("127.") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host === "169.254.169.254" ||
      host === "0.0.0.0"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

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
      error: "مدة الفترة الزمنية يجب أن تكون 15، 30، 45 أو 60 دقيقة",
    };
  }
  const startM = parseClockMinutes(rule.startTime);
  const endM = parseClockMinutes(rule.endTime);
  if (endM <= startM || (rule.isActive !== false && endM - startM < rule.slotMinutes)) {
    return {
      isValid: false,
      error: "يجب أن تغطي ساعات العمل فترة حجز كاملة على الأقل",
    };
  }
  return { isValid: true };
}

export function validateServiceInput(input: ServiceInput): ValidationResult {
  if (!input.title || input.title.trim().length < 2) {
    return { isValid: false, error: "عنوان الخدمة مطلوب (حرفان على الأقل)" };
  }
  const duration = Number(input.durationMinutes);
  if (!Number.isFinite(duration) || duration < 10 || duration > 480) {
    return { isValid: false, error: "مدة الجلسة يجب أن تكون بين 10 و 480 دقيقة" };
  }
  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 0) {
    return { isValid: false, error: "السعر غير صالح" };
  }
  const buffer = Number(input.bufferMinutes ?? 0);
  if (!Number.isFinite(buffer) || buffer < 0 || buffer > 120) {
    return { isValid: false, error: "فترة الراحة بين الجلسات يجب أن تكون 0–120 دقيقة" };
  }
  const meetingType = input.meetingType || "ONLINE";
  if (!["ONLINE", "PHONE", "IN_PERSON"].includes(meetingType)) {
    return { isValid: false, error: "نوع الاجتماع غير صالح" };
  }
  if (meetingType === "ONLINE" && input.meetingLocation?.trim()) {
    if (!isValidSafeHttpsUrl(input.meetingLocation)) {
      return {
        isValid: false,
        error: "رابط الاجتماع المخصص يجب أن يبدأ بـ https:// ويكون عاماً وآمناً",
      };
    }
  }
  if (meetingType === "IN_PERSON" && (!input.meetingLocation || input.meetingLocation.trim().length < 3)) {
    return { isValid: false, error: "عنوان الحضور الفعلي مطلوب للجلسات الحضورية" };
  }
  return { isValid: true };
}

export function validateReserveSlotInput(
  input: ReserveSlotInput
): ValidationResult {
  if (!input.serviceId || !input.creatorId) {
    return { isValid: false, error: "بيانات الخدمة والمبدع مطلوبة" };
  }
  if (!input.clientName || input.clientName.trim().length < 2) {
    return { isValid: false, error: "الاسم الكامل يجب ألا يقل عن حرفين" };
  }
  if (!input.clientEmail || !BOOKING_EMAIL_REGEX.test(input.clientEmail.trim())) {
    return { isValid: false, error: "صيغة البريد الإلكتروني غير صالحة" };
  }
  if (!(input.startTime instanceof Date) || isNaN(input.startTime.getTime())) {
    return { isValid: false, error: "وقت بدء الموعد غير صالح" };
  }
  if (input.endTime && (!(input.endTime instanceof Date) || input.endTime <= input.startTime)) {
    return { isValid: false, error: "وقت النهاية يجب أن يكون بعد وقت البداية" };
  }
  return { isValid: true };
}

export function validateExceptionDate(dateStr: string): boolean {
  return isValidCalendarDateStr(dateStr);
}
