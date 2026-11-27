import {
  AvailabilityRuleInput,
  ConsultationSlot,
  ExistingBookingStub,
} from "../types/appointments.types";
import {
  zonedWallClockToUtc,
  getZonedDateParts,
  addDaysToDateStr,
  isValidCalendarDateStr,
} from "../utils/timezone";

export const DEFAULT_MIN_NOTICE_MINUTES = 120; // 2 hours notice
export const DEFAULT_MAX_ADVANCE_DAYS = 30;

export function isSlotOverlapping(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
}

export function hasBufferedBookingConflict(
  candidateStart: Date,
  candidateEnd: Date,
  candidateBufferMinutes: number,
  existingBookings: ExistingBookingStub[],
  now = new Date(),
  excludeBookingId?: string
): boolean {
  const candidateBufMs = Math.max(0, candidateBufferMinutes) * 60_000;

  return existingBookings.some((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false;

    const isActiveBooking =
      b.status === "CONFIRMED" ||
      (b.status === "PENDING_PAYMENT" &&
        b.lockedUntil &&
        b.lockedUntil.getTime() > now.getTime());

    if (!isActiveBooking) return false;

    const existingBufMs = Math.max(0, b.bufferMinutes ?? 0) * 60_000;
    const bufferedStartA = candidateStart.getTime();
    const bufferedEndA = candidateEnd.getTime() + candidateBufMs;
    const bufferedStartB = b.startTime.getTime();
    const bufferedEndB = b.endTime.getTime() + existingBufMs;

    return bufferedStartA < bufferedEndB && bufferedEndA > bufferedStartB;
  });
}

function parseMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export interface CalculateSlotsParams {
  date: Date;
  dateStr?: string;
  creatorTimezone?: string;
  rule: AvailabilityRuleInput;
  existingBookings: ExistingBookingStub[];
  durationMinutes?: number;
  bufferMinutes?: number;
  minNoticeMinutes?: number;
  maxAdvanceDays?: number;
  isBlockedDate?: boolean;
  now?: Date;
}

export function calculateAvailableSlots({
  date,
  dateStr: explicitDateStr,
  creatorTimezone = "UTC",
  rule,
  existingBookings,
  durationMinutes,
  bufferMinutes = 0,
  minNoticeMinutes = 15,
  maxAdvanceDays = DEFAULT_MAX_ADVANCE_DAYS,
  isBlockedDate = false,
  now = new Date(),
}: CalculateSlotsParams): ConsultationSlot[] {
  if (isBlockedDate || rule.isActive === false) return [];

  const datePrefix =
    explicitDateStr && isValidCalendarDateStr(explicitDateStr)
      ? explicitDateStr
      : date.toISOString().split("T")[0];

  const todayInZone = getZonedDateParts(now, creatorTimezone).dateStr;
  const maxAllowedDateStr = addDaysToDateStr(todayInZone, maxAdvanceDays);
  if (datePrefix < todayInZone || datePrefix > maxAllowedDateStr) {
    return [];
  }

  const slots: ConsultationSlot[] = [];
  const startM = parseMinutes(rule.startTime);
  const endM = parseMinutes(rule.endTime);
  const step = rule.slotMinutes || 30;
  const serviceDuration =
    durationMinutes && durationMinutes > 0 ? durationMinutes : step;

  const minimumBookingTime = now.getTime() + minNoticeMinutes * 60_000;

  for (let current = startM; current + serviceDuration <= endM; current += step) {
    const slotStartStr = formatMinutes(current);
    const slotEndStr = formatMinutes(current + serviceDuration);

    const startDateTime = zonedWallClockToUtc(
      datePrefix,
      slotStartStr,
      creatorTimezone
    );
    // Skip non-existent DST Spring-Forward hours cleanly
    if (!startDateTime) continue;

    // Derive endDateTime directly by adding exact duration (DST fall-back safe)
    const endDateTime = new Date(
      startDateTime.getTime() + serviceDuration * 60_000
    );

    if (startDateTime.getTime() <= minimumBookingTime) {
      continue;
    }

    const isBooked = hasBufferedBookingConflict(
      startDateTime,
      endDateTime,
      bufferMinutes,
      existingBookings,
      now
    );

    slots.push({
      slotDate: datePrefix,
      startTime: slotStartStr,
      endTime: slotEndStr,
      startDateTime,
      endDateTime,
      isAvailable: !isBooked,
    });
  }

  return slots;
}

export interface ScheduleMatchCheckInput {
  startTime: Date;
  durationMinutes: number;
  creatorTimezone: string;
  rule: AvailabilityRuleInput | null;
  isBlockedDate: boolean;
  minNoticeMinutes?: number;
  maxAdvanceDays?: number;
  now?: Date;
}

/**
 * Verifies server-side that a requested UTC timestamp aligns to an active rule slot.
 */
export function isWithinCreatorSchedule({
  startTime,
  durationMinutes,
  creatorTimezone,
  rule,
  isBlockedDate,
  minNoticeMinutes = 15,
  maxAdvanceDays = DEFAULT_MAX_ADVANCE_DAYS,
  now = new Date(),
}: ScheduleMatchCheckInput): { ok: boolean; error?: string } {
  if (isBlockedDate || !rule || rule.isActive === false) {
    return { ok: false, error: "هذا اليوم غير متاح لاستقبال الحجوزات" };
  }

  if (startTime.getTime() <= now.getTime() + minNoticeMinutes * 60_000) {
    return { ok: false, error: "يجب الحجز قبل موعد الجلسة بالمدة الكافية" };
  }

  const slotParts = getZonedDateParts(startTime, creatorTimezone);
  const todayInZone = getZonedDateParts(now, creatorTimezone).dateStr;
  const maxDate = addDaysToDateStr(todayInZone, maxAdvanceDays);

  if (slotParts.dateStr > maxDate || slotParts.dayOfWeek !== rule.dayOfWeek) {
    return { ok: false, error: "التاريخ المطلوب خارج نطاق جدول العمل المتاح" };
  }

  const ruleStartM = parseMinutes(rule.startTime);
  const ruleEndM = parseMinutes(rule.endTime);
  const slotM = slotParts.totalMinutes;
  const step = rule.slotMinutes || 30;

  if (slotM < ruleStartM || slotM + durationMinutes > ruleEndM) {
    return { ok: false, error: "الوقت المطلوب خارج ساعات عمل المبدع" };
  }

  if ((slotM - ruleStartM) % step !== 0) {
    return { ok: false, error: "الوقت المختار لا يطابق فواصل الجدول المعتمدة" };
  }

  return { ok: true };
}
