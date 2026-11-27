import { describe, it, expect } from "vitest";
import {
  isSlotOverlapping,
  calculateAvailableSlots,
  generateMeetingUrl,
} from "@/features/appointments";

describe("Appointments Engine & Atomic Scheduler Unit Tests", () => {
  it("accurately detects time slot overlap", () => {
    const slot1Start = new Date("2026-11-30T09:00:00Z");
    const slot1End = new Date("2026-11-30T10:00:00Z");

    const overlapStart = new Date("2026-11-30T09:30:00Z");
    const overlapEnd = new Date("2026-11-30T10:30:00Z");

    const nonOverlapStart = new Date("2026-11-30T10:00:00Z");
    const nonOverlapEnd = new Date("2026-11-30T11:00:00Z");

    expect(isSlotOverlapping(slot1Start, slot1End, overlapStart, overlapEnd)).toBe(true);
    expect(isSlotOverlapping(slot1Start, slot1End, nonOverlapStart, nonOverlapEnd)).toBe(false);
  });

  it("calculates slots respecting service duration and existing bookings", () => {
    // Future date to avoid past-slot filter
    const futureDate = new Date("2028-06-15T00:00:00Z");

    const rule = {
      dayOfWeek: 4,
      startTime: "09:00",
      endTime: "11:00",
      slotMinutes: 30,
    };

    const existingBookings = [
      {
        startTime: new Date("2028-06-15T09:30:00Z"),
        endTime: new Date("2028-06-15T10:00:00Z"),
        status: "CONFIRMED",
      },
    ];

    const slots = calculateAvailableSlots({
      date: futureDate,
      rule,
      existingBookings,
      durationMinutes: 30,
    });

    expect(slots.length).toBe(4);
    // 09:00 - 09:30: available
    expect(slots[0].startTime).toBe("09:00");
    expect(slots[0].isAvailable).toBe(true);
    // 09:30 - 10:00: booked
    expect(slots[1].startTime).toBe("09:30");
    expect(slots[1].isAvailable).toBe(false);
    // 10:00 - 10:30: available
    expect(slots[2].startTime).toBe("10:00");
    expect(slots[2].isAvailable).toBe(true);
  });

  it("generates valid meeting URLs with custom URL support", () => {
    const customZoom = "https://zoom.us/j/123456789";
    expect(generateMeetingUrl(customZoom)).toBe(customZoom);

    const generated = generateMeetingUrl(null);
    expect(generated).toContain("https://meet.google.com/anl-");
  });
});
