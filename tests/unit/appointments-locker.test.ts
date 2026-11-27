import { describe, it, expect } from "vitest";
import {
  isSlotOverlapping,
  calculateAvailableSlots,
  generateMeetingUrl,
} from "@/features/appointments";

describe("Appointments Engine & Meeting Link Unit Tests", () => {
  it("accurately detects time slot overlap", () => {
    const slot1Start = new Date("2026-11-30T09:00:00Z");
    const slot1End = new Date("2026-11-30T10:00:00Z");
    const overlapStart = new Date("2026-11-30T09:30:00Z");
    const overlapEnd = new Date("2026-11-30T10:30:00Z");
    const nonOverlapEnd = new Date("2026-11-30T11:00:00Z");

    expect(isSlotOverlapping(slot1Start, slot1End, overlapStart, overlapEnd)).toBe(true);
    expect(isSlotOverlapping(slot1Start, slot1End, slot1End, nonOverlapEnd)).toBe(false);
  });

  it("calculates slots respecting service duration and existing bookings", () => {
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
      now: new Date("2028-06-14T12:00:00Z"),
    });

    expect(slots.length).toBe(4);
    expect(slots[0]).toMatchObject({ startTime: "09:00", isAvailable: true });
    expect(slots[1]).toMatchObject({ startTime: "09:30", isAvailable: false });
    expect(slots[2]).toMatchObject({ startTime: "10:00", isAvailable: true });
  });

  it("generates safe meeting URLs for ONLINE, rejects javascript:, and returns null for PHONE/IN_PERSON", () => {
    expect(generateMeetingUrl("https://zoom.us/j/123456789", "ONLINE")).toBe("https://zoom.us/j/123456789");
    expect(generateMeetingUrl("javascript:alert(1)", "ONLINE")).toContain("https://meet.jit.si/ANLinks-");
    expect(generateMeetingUrl(null, "ONLINE")).toContain("https://meet.jit.si/ANLinks-");
    expect(generateMeetingUrl(null, "PHONE")).toBeNull();
    expect(generateMeetingUrl("https://maps.google.com/place", "IN_PERSON")).toBeNull();
  });
});
