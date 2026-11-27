import { prisma } from "@/shared/db";
import { AvailabilityRuleInput } from "../types/appointments.types";

const DEFAULT_WEEKLY_RULES: AvailabilityRuleInput[] = [
  { dayOfWeek: 0, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true }, // Sun
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true }, // Mon
  { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true }, // Tue
  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true }, // Wed
  { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true }, // Thu
  { dayOfWeek: 5, startTime: "14:00", endTime: "18:00", slotMinutes: 30, isActive: false }, // Fri
  { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", slotMinutes: 30, isActive: false }, // Sat
];

export async function getCreatorAvailability(creatorId: string): Promise<AvailabilityRuleInput[]> {
  const rules = await prisma.availabilityRule.findMany({
    where: { creatorId },
    orderBy: { dayOfWeek: "asc" },
  });

  if (!rules || rules.length === 0) {
    return DEFAULT_WEEKLY_RULES;
  }

  return rules.map((r) => ({
    dayOfWeek: r.dayOfWeek,
    startTime: r.startTime,
    endTime: r.endTime,
    slotMinutes: r.slotMinutes,
    isActive: r.isActive,
  }));
}

export async function saveCreatorAvailability(
  creatorId: string,
  rules: AvailabilityRuleInput[]
) {
  return await prisma.$transaction(async (tx) => {
    // Delete existing and bulk create new rules
    await tx.availabilityRule.deleteMany({
      where: { creatorId },
    });

    const createPayload = rules.map((r) => ({
      creatorId,
      dayOfWeek: Number(r.dayOfWeek),
      startTime: r.startTime || "09:00",
      endTime: r.endTime || "17:00",
      slotMinutes: Number(r.slotMinutes) || 30,
      isActive: r.isActive !== false,
    }));

    await tx.availabilityRule.createMany({
      data: createPayload,
    });

    return await tx.availabilityRule.findMany({
      where: { creatorId },
      orderBy: { dayOfWeek: "asc" },
    });
  });
}
