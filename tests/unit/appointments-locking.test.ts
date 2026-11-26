import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculateAvailableSlots,
  isSlotOverlapping,
} from "@/features/appointments/server/appointments.scheduler";
import {
  reserveSlotAtomic,
  confirmBooking,
} from "@/features/appointments/server/appointments.service";
import { AvailabilityRuleInput } from "@/features/appointments/types/appointments.types";
import { prisma } from "@/shared/db";

// Mock Prisma
vi.mock("@/shared/db", () => {
  return {
    prisma: {
      $transaction: vi.fn(),
      appointmentBooking: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    },
  };
});

describe("Appointments Scheduler & Concurrency Locking", () => {
  describe("calculateAvailableSlots", () => {
    it("should generate available slots according to availability rules", () => {
      const rule: AvailabilityRuleInput = {
        dayOfWeek: 0, // Sunday
        startTime: "09:00",
        endTime: "12:00",
        slotMinutes: 60,
      };

      const dateStr = "2026-11-29"; // Sunday
      const existingBookings = [
        {
          startTime: new Date(`${dateStr}T10:00:00.000Z`),
          endTime: new Date(`${dateStr}T11:00:00.000Z`),
          status: "CONFIRMED",
          lockedUntil: null,
        },
      ];

      const slots = calculateAvailableSlots({
        date: new Date(dateStr),
        rule,
        existingBookings,
      });

      expect(slots).toHaveLength(3);
      expect(slots[0]).toMatchObject({
        startTime: "09:00",
        endTime: "10:00",
        isAvailable: true,
      });
      expect(slots[1]).toMatchObject({
        startTime: "10:00",
        endTime: "11:00",
        isAvailable: false,
      });
      expect(slots[2]).toMatchObject({
        startTime: "11:00",
        endTime: "12:00",
        isAvailable: true,
      });
    });

    it("should consider a slot unavailable if lockedUntil is in the future", () => {
      const rule: AvailabilityRuleInput = {
        dayOfWeek: 0,
        startTime: "09:00",
        endTime: "11:00",
        slotMinutes: 60,
      };

      const dateStr = "2026-11-29";
      const futureLock = new Date(Date.now() + 10 * 60 * 1000); // +10 mins

      const existingBookings = [
        {
          startTime: new Date(`${dateStr}T09:00:00.000Z`),
          endTime: new Date(`${dateStr}T10:00:00.000Z`),
          status: "PENDING_PAYMENT",
          lockedUntil: futureLock,
        },
      ];

      const slots = calculateAvailableSlots({
        date: new Date(dateStr),
        rule,
        existingBookings,
      });

      expect(slots[0].isAvailable).toBe(false);
      expect(slots[1].isAvailable).toBe(true);
    });

    it("should treat expired lockedUntil as available", () => {
      const rule: AvailabilityRuleInput = {
        dayOfWeek: 0,
        startTime: "09:00",
        endTime: "10:00",
        slotMinutes: 60,
      };

      const dateStr = "2026-11-29";
      const pastLock = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago

      const existingBookings = [
        {
          startTime: new Date(`${dateStr}T09:00:00.000Z`),
          endTime: new Date(`${dateStr}T10:00:00.000Z`),
          status: "PENDING_PAYMENT",
          lockedUntil: pastLock,
        },
      ];

      const slots = calculateAvailableSlots({
        date: new Date(dateStr),
        rule,
        existingBookings,
      });

      expect(slots[0].isAvailable).toBe(true);
    });
  });

  describe("isSlotOverlapping", () => {
    it("should correctly detect intersecting time ranges", () => {
      const aStart = new Date("2026-11-29T10:00:00.000Z");
      const aEnd = new Date("2026-11-29T11:00:00.000Z");

      const bStart = new Date("2026-11-29T10:30:00.000Z");
      const bEnd = new Date("2026-11-29T11:30:00.000Z");

      expect(isSlotOverlapping(aStart, aEnd, bStart, bEnd)).toBe(true);

      const cStart = new Date("2026-11-29T11:00:00.000Z");
      const cEnd = new Date("2026-11-29T12:00:00.000Z");

      // Adjacent times should NOT overlap
      expect(isSlotOverlapping(aStart, aEnd, cStart, cEnd)).toBe(false);
    });
  });

  describe("reserveSlotAtomic", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should successfully lock a free slot for 10 minutes", async () => {
      const mockTx = {
        appointmentBooking: {
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "booking_123", ...data })),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation((cb: any) => cb(mockTx));

      const startTime = new Date("2026-11-29T10:00:00.000Z");
      const endTime = new Date("2026-11-29T11:00:00.000Z");

      const result = await reserveSlotAtomic({
        serviceId: "srv_1",
        creatorId: "user_creator",
        clientName: "أحمد العتيبي",
        clientEmail: "ahmed@example.com",
        startTime,
        endTime,
      });

      expect(result.id).toBe("booking_123");
      expect(result.status).toBe("PENDING_PAYMENT");
      expect(result.lockedUntil).toBeInstanceOf(Date);
      expect(result.lockedUntil!.getTime()).toBeGreaterThan(Date.now());
    });

    it("should throw an error if slot is already reserved or locked", async () => {
      const mockTx = {
        appointmentBooking: {
          findFirst: vi.fn().mockResolvedValue({ id: "existing_conflict" }),
          create: vi.fn(),
        },
      };

      vi.mocked(prisma.$transaction).mockImplementation((cb: any) => cb(mockTx));

      const startTime = new Date("2026-11-29T10:00:00.000Z");
      const endTime = new Date("2026-11-29T11:00:00.000Z");

      await expect(
        reserveSlotAtomic({
          serviceId: "srv_1",
          creatorId: "user_creator",
          clientName: "سارة محمد",
          clientEmail: "sara@example.com",
          startTime,
          endTime,
        })
      ).rejects.toThrow("SLOT_ALREADY_RESERVED");

      expect(mockTx.appointmentBooking.create).not.toHaveBeenCalled();
    });
  });

  describe("confirmBooking", () => {
    it("should set status to CONFIRMED and generate meetingUrl", async () => {
      vi.mocked(prisma.appointmentBooking.update).mockResolvedValue({
        id: "booking_123",
        status: "CONFIRMED",
        paymentId: "pay_xyz",
        meetingUrl: "https://meet.google.com/anl-test12",
      } as any);

      const result = await confirmBooking("booking_123", "pay_xyz");

      expect(result.status).toBe("CONFIRMED");
      expect(result.paymentId).toBe("pay_xyz");
      expect(result.meetingUrl).toContain("https://meet.google.com/");
    });
  });
});
