import { prisma } from "@/shared/db";
import {
  AvailabilityRuleInput,
  AvailabilityExceptionItem,
} from "../types/appointments.types";
import {
  validateAvailabilityRule,
  validateExceptionDate,
} from "../validators/appointments.validator";
import { normalizeTimezone, isValidTimezone } from "../utils/timezone";

const DEFAULT_WEEKLY_RULES: AvailabilityRuleInput[] = [
  { dayOfWeek: 0, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true },
  { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true },
  { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true },
  { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true },
  { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", slotMinutes: 30, isActive: true },
  { dayOfWeek: 5, startTime: "14:00", endTime: "18:00", slotMinutes: 30, isActive: false },
  { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", slotMinutes: 30, isActive: false },
];

export async function getCreatorAvailabilityConfig(creatorId: string) {
  const [rules, profile, exceptions] = await Promise.all([
    prisma.availabilityRule.findMany({
      where: { creatorId },
      orderBy: { dayOfWeek: "asc" },
    }),
    prisma.profile.findUnique({
      where: { userId: creatorId },
      select: { timezone: true },
    }),
    prisma.availabilityException.findMany({
      where: { creatorId },
      orderBy: { date: "asc" },
    }),
  ]);

  const mappedRules: AvailabilityRuleInput[] =
    rules.length === 0
      ? DEFAULT_WEEKLY_RULES
      : rules.map((r) => ({
          dayOfWeek: r.dayOfWeek,
          startTime: r.startTime,
          endTime: r.endTime,
          slotMinutes: r.slotMinutes,
          isActive: r.isActive,
        }));

  const mappedExceptions: AvailabilityExceptionItem[] = exceptions.map((ex) => ({
    id: ex.id,
    date: ex.date,
    reason: ex.reason,
  }));

  return {
    availability: mappedRules,
    timezone: normalizeTimezone(profile?.timezone),
    exceptions: mappedExceptions,
  };
}

export async function saveCreatorAvailability(
  creatorId: string,
  rules: AvailabilityRuleInput[],
  timezone?: string
) {
  for (const r of rules) {
    const check = validateAvailabilityRule(r);
    if (!check.isValid) throw new Error(check.error);
  }

  const nextZone = timezone && isValidTimezone(timezone) ? timezone : undefined;

  return await prisma.$transaction(async (tx) => {
    await tx.availabilityRule.deleteMany({ where: { creatorId } });

    await tx.availabilityRule.createMany({
      data: rules.map((r) => ({
        creatorId,
        dayOfWeek: Number(r.dayOfWeek),
        startTime: r.startTime || "09:00",
        endTime: r.endTime || "17:00",
        slotMinutes: Number(r.slotMinutes) || 30,
        isActive: r.isActive !== false,
      })),
    });

    if (nextZone) {
      await tx.profile.updateMany({
        where: { userId: creatorId },
        data: { timezone: nextZone },
      });
    }

    return await tx.availabilityRule.findMany({
      where: { creatorId },
      orderBy: { dayOfWeek: "asc" },
    });
  });
}

export async function addCreatorAvailabilityException(
  creatorId: string,
  date: string,
  reason?: string
) {
  if (!validateExceptionDate(date)) {
    throw new Error("صيغة التاريخ غير صالحة (YYYY-MM-DD)");
  }

  return await prisma.availabilityException.upsert({
    where: { creatorId_date: { creatorId, date } },
    update: { reason: reason?.trim() || null },
    create: { creatorId, date, reason: reason?.trim() || null },
  });
}

export async function deleteCreatorAvailabilityException(
  creatorId: string,
  exceptionId: string
) {
  return await prisma.availabilityException.deleteMany({
    where: { id: exceptionId, creatorId },
  });
}
