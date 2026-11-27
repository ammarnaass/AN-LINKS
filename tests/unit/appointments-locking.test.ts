import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculateAvailableSlots,
  isSlotOverlapping,
  hasBufferedBookingConflict,
  isWithinCreatorSchedule,
} from "@/features/appointments/server/appointments.scheduler";
import { reserveSlotAtomic } from "@/features/appointments/server/slot-locker.service";
import { confirmBookingAtomic } from "@/features/appointments/server/booking-lifecycle.service";
import { AvailabilityRuleInput } from "@/features/appointments/types/appointments.types";
import { prisma } from "@/shared/db";

vi.mock("@/shared/db", () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

describe("Appointments Scheduler & V2 Atomic Locking", () => {
  const futureDateStr = "2028-06-15";
  const nowFixed = new Date("2028-06-14T12:00:00.000Z");

  describe("calculateAvailableSlots", () => {
    it("generates available slots while blocking existing confirmed slots", () => {
      const rule: AvailabilityRuleInput = { dayOfWeek: 4, startTime: "09:00", endTime: "12:00", slotMinutes: 60 };
      const existingBookings = [
        {
          startTime: new Date(`${futureDateStr}T10:00:00.000Z`),
          endTime: new Date(`${futureDateStr}T11:00:00.000Z`),
          status: "CONFIRMED",
          lockedUntil: null,
        },
      ];

      const slots = calculateAvailableSlots({
        date: new Date(futureDateStr),
        dateStr: futureDateStr,
        creatorTimezone: "UTC",
        rule,
        existingBookings,
        now: nowFixed,
      });

      expect(slots).toHaveLength(3);
      expect(slots[0]).toMatchObject({ startTime: "09:00", endTime: "10:00", isAvailable: true });
      expect(slots[1]).toMatchObject({ startTime: "10:00", endTime: "11:00", isAvailable: false });
      expect(slots[2]).toMatchObject({ startTime: "11:00", endTime: "12:00", isAvailable: true });
    });

    it("blocks active locks and releases expired PENDING_PAYMENT locks", () => {
      const rule: AvailabilityRuleInput = { dayOfWeek: 4, startTime: "09:00", endTime: "11:00", slotMinutes: 60 };
      const existingBookings = [
        {
          startTime: new Date(`${futureDateStr}T09:00:00.000Z`),
          endTime: new Date(`${futureDateStr}T10:00:00.000Z`),
          status: "PENDING_PAYMENT",
          lockedUntil: new Date(nowFixed.getTime() + 600_000),
        },
        {
          startTime: new Date(`${futureDateStr}T10:00:00.000Z`),
          endTime: new Date(`${futureDateStr}T11:00:00.000Z`),
          status: "PENDING_PAYMENT",
          lockedUntil: new Date(nowFixed.getTime() - 60_000),
        },
      ];

      const slots = calculateAvailableSlots({
        date: new Date(futureDateStr),
        dateStr: futureDateStr,
        creatorTimezone: "UTC",
        rule,
        existingBookings,
        now: nowFixed,
      });

      expect(slots[0].isAvailable).toBe(false);
      expect(slots[1].isAvailable).toBe(true);
    });
  });

  describe("isSlotOverlapping & hasBufferedBookingConflict", () => {
    it("detects intersections and asymmetric buffer conflicts", () => {
      const aStart = new Date("2028-06-15T10:00:00.000Z");
      const aEnd = new Date("2028-06-15T11:00:00.000Z");
      expect(isSlotOverlapping(aStart, aEnd, new Date("2028-06-15T10:30:00.000Z"), new Date("2028-06-15T11:30:00.000Z"))).toBe(true);
      expect(isSlotOverlapping(aStart, aEnd, aEnd, new Date("2028-06-15T12:00:00.000Z"))).toBe(false);

      const conflict = hasBufferedBookingConflict(
        new Date("2028-06-15T10:30:00.000Z"),
        new Date("2028-06-15T11:00:00.000Z"),
        0,
        [
          {
            id: "b1",
            startTime: new Date("2028-06-15T10:00:00.000Z"),
            endTime: new Date("2028-06-15T10:30:00.000Z"),
            status: "CONFIRMED",
            bufferMinutes: 15,
          },
        ],
        nowFixed
      );
      expect(conflict).toBe(true);
    });

    it("rejects dates on blocked holidays or inactive weekdays", () => {
      const check = isWithinCreatorSchedule({
        startTime: new Date("2028-06-15T10:00:00.000Z"),
        durationMinutes: 30,
        creatorTimezone: "UTC",
        rule: { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true },
        isBlockedDate: true,
        now: nowFixed,
      });
      expect(check.ok).toBe(false);
    });
  });

  describe("reserveSlotAtomic", () => {
    beforeEach(() => vi.clearAllMocks());

    it("creates CONFIRMED booking atomically with manageTokenHash & commission snapshot", async () => {
      const mockTx = {
        $executeRawUnsafe: vi.fn().mockResolvedValue(1),
        consultationService: {
          findFirst: vi.fn().mockResolvedValue({
            id: "srv_1",
            durationMinutes: 30,
            bufferMinutes: 10,
            price: 200,
            currency: "SAR",
            meetingType: "ONLINE",
            meetingLocation: null,
          }),
        },
        profile: { findUnique: vi.fn().mockResolvedValue({ timezone: "UTC" }) },
        availabilityRule: {
          findFirst: vi.fn().mockResolvedValue({
            dayOfWeek: 4,
            startTime: "09:00",
            endTime: "17:00",
            slotMinutes: 30,
            isActive: true,
          }),
        },
        availabilityException: { findFirst: vi.fn().mockResolvedValue(null) },
        appointmentBooking: {
          findMany: vi.fn().mockResolvedValue([]),
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "booking_123", ...data })),
        },
        userSubscription: { findFirst: vi.fn().mockResolvedValue({ plan: { quotas: { storeCommissionRate: 5 } } }) },
        creatorWebhookEndpoint: { findMany: vi.fn().mockResolvedValue([]) },
        webhookOutbox: { create: vi.fn() },
      };

      vi.mocked(prisma.$transaction).mockImplementation((cb: any) => cb(mockTx));

      const result = await reserveSlotAtomic({
        serviceId: "srv_1",
        creatorId: "user_creator",
        clientName: "أحمد العتيبي",
        clientEmail: "ahmed@example.com",
        startTime: new Date("2028-06-15T10:00:00.000Z"),
        skipScheduleCheck: true,
      });

      expect(result.booking.id).toBe("booking_123");
      expect(result.booking.status).toBe("CONFIRMED");
      expect(result.booking.amountPaid).toBe(200);
      expect(result.booking.platformCommission).toBe(10);
      expect(result.booking.creatorNetAmount).toBe(190);
      expect(result.booking.manageTokenHash).not.toBe(result.manageToken);
      expect(result.booking.meetingUrl).toContain("https://meet.jit.si/ANLinks-");
    });

    it("throws SLOT_ALREADY_RESERVED when buffered overlap exists", async () => {
      const start = new Date("2028-06-15T10:00:00.000Z");
      const mockTx = {
        $executeRawUnsafe: vi.fn().mockResolvedValue(1),
        consultationService: {
          findFirst: vi.fn().mockResolvedValue({
            id: "srv_1",
            durationMinutes: 30,
            bufferMinutes: 0,
            price: 100,
            currency: "SAR",
            meetingType: "ONLINE",
          }),
        },
        profile: { findUnique: vi.fn().mockResolvedValue({ timezone: "UTC" }) },
        appointmentBooking: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: "existing_1",
              startTime: new Date("2028-06-15T09:30:00.000Z"),
              endTime: new Date("2028-06-15T10:00:00.000Z"),
              status: "CONFIRMED",
              bufferMinutes: 15,
            },
          ]),
          create: vi.fn(),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation((cb: any) => cb(mockTx));

      await expect(
        reserveSlotAtomic({
          serviceId: "srv_1",
          creatorId: "user_creator",
          clientName: "سارة محمد",
          clientEmail: "sara@example.com",
          startTime: start,
          skipScheduleCheck: true,
        })
      ).rejects.toThrow("SLOT_ALREADY_RESERVED");

      expect(mockTx.appointmentBooking.create).not.toHaveBeenCalled();
    });
  });

  describe("confirmBookingAtomic", () => {
    beforeEach(() => vi.clearAllMocks());

    it("transitions valid PENDING_PAYMENT booking to CONFIRMED", async () => {
      const mockTx = {
        $executeRawUnsafe: vi.fn().mockResolvedValue(1),
        appointmentBooking: {
          findUnique: vi
            .fn()
            .mockResolvedValueOnce({ id: "b1", creatorId: "c1", status: "PENDING_PAYMENT" })
            .mockResolvedValueOnce({ id: "b1", status: "CONFIRMED", paymentId: "pay_xyz" }),
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation((cb: any) => cb(mockTx));

      const result = await confirmBookingAtomic("b1", "pay_xyz");
      expect(result.transitioned).toBe(true);
      expect(result.booking.status).toBe("CONFIRMED");
    });
  });
});
