import {
  AvailabilityRuleInput,
  ConsultationSlot,
  ExistingBookingStub,
} from "../types/appointments.types";

export function isSlotOverlapping(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return startA.getTime() < endB.getTime() && endA.getTime() > startB.getTime();
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

interface CalculateSlotsParams {
  date: Date;
  rule: AvailabilityRuleInput;
  existingBookings: ExistingBookingStub[];
  durationMinutes?: number;
}

const MINIMUM_NOTICE_MINUTES = 15;

export function calculateAvailableSlots({
  date,
  rule,
  existingBookings,
  durationMinutes,
}: CalculateSlotsParams): ConsultationSlot[] {
  const slots: ConsultationSlot[] = [];
  const startM = parseMinutes(rule.startTime);
  const endM = parseMinutes(rule.endTime);
  const step = rule.slotMinutes || 30;
  const serviceDuration = durationMinutes && durationMinutes > 0 ? durationMinutes : step;

  const datePrefix = date.toISOString().split("T")[0];
  const now = new Date();
  const minimumBookingTime = new Date(now.getTime() + MINIMUM_NOTICE_MINUTES * 60 * 1000);

  for (let current = startM; current + serviceDuration <= endM; current += step) {
    const slotStartStr = formatMinutes(current);
    const slotEndStr = formatMinutes(current + serviceDuration);

    const startDateTime = new Date(`${datePrefix}T${slotStartStr}:00.000Z`);
    const endDateTime = new Date(`${datePrefix}T${slotEndStr}:00.000Z`);

    // Past slot filter
    if (startDateTime.getTime() <= minimumBookingTime.getTime()) {
      continue;
    }

    // Collision check against active bookings
    const isBooked = existingBookings.some((b) => {
      const isTimeIntersect = isSlotOverlapping(
        startDateTime,
        endDateTime,
        b.startTime,
        b.endTime
      );
      if (!isTimeIntersect) return false;

      if (b.status === "CONFIRMED") return true;

      if (b.status === "PENDING_PAYMENT" && b.lockedUntil) {
        return b.lockedUntil.getTime() > now.getTime();
      }

      return false;
    });

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
