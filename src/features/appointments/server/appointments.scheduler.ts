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
}

export function calculateAvailableSlots({
  date,
  rule,
  existingBookings,
}: CalculateSlotsParams): ConsultationSlot[] {
  const slots: ConsultationSlot[] = [];
  const startM = parseMinutes(rule.startTime);
  const endM = parseMinutes(rule.endTime);
  const duration = rule.slotMinutes;

  const datePrefix = date.toISOString().split("T")[0];
  const now = new Date();

  for (let current = startM; current + duration <= endM; current += duration) {
    const slotStartStr = formatMinutes(current);
    const slotEndStr = formatMinutes(current + duration);

    const startDateTime = new Date(`${datePrefix}T${slotStartStr}:00.000Z`);
    const endDateTime = new Date(`${datePrefix}T${slotEndStr}:00.000Z`);

    // Check collision against active bookings
    const isBooked = existingBookings.some((b) => {
      const isTimeIntersect = isSlotOverlapping(
        startDateTime,
        endDateTime,
        b.startTime,
        b.endTime
      );
      if (!isTimeIntersect) return false;

      // Confirmed bookings are always unavailable
      if (b.status === "CONFIRMED") return true;

      // Pending bookings are unavailable only if lock has not expired
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
