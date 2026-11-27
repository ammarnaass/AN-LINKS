import { describe, it, expect } from "vitest";
import {
  zonedWallClockToUtc,
  getUtcBoundsForCreatorDate,
  isValidCalendarDateStr,
  getZonedDateParts,
} from "@/features/appointments/utils/timezone";
import { calculateAvailableSlots } from "@/features/appointments/server/appointments.scheduler";
import {
  createManageTokenPair,
  verifyManageToken,
} from "@/features/appointments/server/slot-locker.service";

describe("Appointments Timezone, DST, Buffer & Security Unit Tests", () => {
  it("converts Asia/Riyadh wall-clock 09:00 accurately to 06:00Z without 3-hour drift", () => {
    const utc = zonedWallClockToUtc("2028-06-15", "09:00", "Asia/Riyadh");
    expect(utc?.toISOString()).toBe("2028-06-15T06:00:00.000Z");

    const bounds = getUtcBoundsForCreatorDate("2028-06-15", "Asia/Riyadh");
    expect(bounds.dayStartUtc.toISOString()).toBe("2028-06-14T21:00:00.000Z");
    expect(bounds.dayEndUtc.toISOString()).toBe("2028-06-15T21:00:00.000Z");

    const lateBookingInUtc = zonedWallClockToUtc("2028-06-15", "01:00", "Asia/Riyadh");
    expect(lateBookingInUtc?.toISOString()).toBe("2028-06-14T22:00:00.000Z");
    expect(lateBookingInUtc!.getTime()).toBeGreaterThanOrEqual(bounds.dayStartUtc.getTime());
    expect(lateBookingInUtc!.getTime()).toBeLessThan(bounds.dayEndUtc.getTime());
  });

  it("rejects calendar rollover dates like February 30", () => {
    expect(isValidCalendarDateStr("2026-02-30")).toBe(false);
    expect(zonedWallClockToUtc("2026-02-30", "10:00", "Asia/Riyadh")).toBeNull();
  });

  it("skips DST Spring-Forward non-existent slots in Europe/London cleanly", () => {
    // 2026-03-29 in Europe/London jumps from 01:00 GMT to 02:00 BST
    expect(zonedWallClockToUtc("2026-03-29", "01:30", "Europe/London")).toBeNull();

    const slots = calculateAvailableSlots({
      date: new Date("2026-03-29T00:00:00Z"),
      dateStr: "2026-03-29",
      creatorTimezone: "Europe/London",
      rule: { dayOfWeek: 0, startTime: "00:00", endTime: "04:00", slotMinutes: 30, isActive: true },
      existingBookings: [],
      durationMinutes: 30,
      now: new Date("2026-03-28T00:00:00Z"),
    });

    const times = slots.map((s) => s.startTime);
    expect(times).toContain("00:30");
    expect(times).not.toContain("01:00");
    expect(times).not.toContain("01:30");
    expect(times).toContain("02:00");
  });

  it("correctly computes zoned day parts across UTC midnight boundary", () => {
    const parts = getZonedDateParts(new Date("2028-06-14T21:30:00.000Z"), "Asia/Riyadh");
    expect(parts.dateStr).toBe("2028-06-15");
    expect(parts.timeStr).toBe("00:30");
    expect(parts.dayOfWeek).toBe(4);
  });

  it("verifies manageToken SHA-256 hash using timing-safe comparison", () => {
    const { rawToken, tokenHash } = createManageTokenPair();
    expect(rawToken).not.toBe(tokenHash);
    expect(verifyManageToken(rawToken, tokenHash)).toBe(true);
    expect(verifyManageToken("invalid-token", tokenHash)).toBe(false);
    expect(verifyManageToken(tokenHash, tokenHash)).toBe(false);
  });
});
