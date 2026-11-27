export interface TimezoneOption {
  value: string;
  labelAr: string;
}

export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  { value: "Asia/Riyadh", labelAr: "الرياض / مكة المكرمة (GMT+3)" },
  { value: "Asia/Dubai", labelAr: "دبي / أبوظبي (GMT+4)" },
  { value: "Asia/Kuwait", labelAr: "الكويت (GMT+3)" },
  { value: "Asia/Qatar", labelAr: "الدوحة (GMT+3)" },
  { value: "Asia/Bahrain", labelAr: "المنامة (GMT+3)" },
  { value: "Asia/Muscat", labelAr: "مسقط (GMT+4)" },
  { value: "Asia/Amman", labelAr: "عمّان (GMT+3)" },
  { value: "Africa/Cairo", labelAr: "القاهرة" },
  { value: "Africa/Casablanca", labelAr: "الدار البيضاء" },
  { value: "Africa/Algiers", labelAr: "الجزائر (GMT+1)" },
  { value: "Europe/London", labelAr: "لندن (GMT/BST)" },
  { value: "America/New_York", labelAr: "نيويورك (EST/EDT)" },
  { value: "UTC", labelAr: "التوقيت العالمي (UTC)" },
];

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTimezone(tz: string): boolean {
  if (!tz || typeof tz !== "string") return false;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function normalizeTimezone(tz?: string | null): string {
  if (tz && isValidTimezone(tz)) return tz;
  return "Asia/Riyadh";
}

export function isValidCalendarDateStr(dateStr: string): boolean {
  const m = DATE_RE.exec(dateStr);
  if (!m) return false;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const dt = new Date(Date.UTC(year, month - 1, day));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() + 1 === month &&
    dt.getUTCDate() === day
  );
}

function getZoneNumericParts(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/**
 * Converts a local wall-clock YYYY-MM-DD + HH:MM in `timeZone` to exact UTC Date.
 * Returns null if the wall-clock time does not exist due to a DST Spring-Forward gap.
 */
export function zonedWallClockToUtc(
  dateStr: string,
  timeStr: string,
  timeZone: string
): Date | null {
  if (!isValidCalendarDateStr(dateStr) || !TIME_RE.test(timeStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const safeZone = normalizeTimezone(timeZone);

  if (safeZone === "UTC") {
    return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
  }

  const targetAsUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let guessMs = targetAsUtcMs;

  for (let i = 0; i < 3; i++) {
    const zp = getZoneNumericParts(new Date(guessMs), safeZone);
    const zonedAsUtcMs = Date.UTC(zp.year, zp.month - 1, zp.day, zp.hour, zp.minute, zp.second, 0);
    const diff = targetAsUtcMs - zonedAsUtcMs;
    if (diff === 0) break;
    guessMs += diff;
  }

  const resolved = new Date(guessMs);
  const check = getZoneNumericParts(resolved, safeZone);
  if (
    check.year !== year ||
    check.month !== month ||
    check.day !== day ||
    check.hour !== hour ||
    check.minute !== minute
  ) {
    return null;
  }
  return resolved;
}

export function getZonedDateParts(date: Date, timeZone: string) {
  const safeZone = normalizeTimezone(timeZone);
  const p = getZoneNumericParts(date, safeZone);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${p.year}-${pad(p.month)}-${pad(p.day)}`;
  const timeStr = `${pad(p.hour)}:${pad(p.minute)}`;
  const dayOfWeek = new Date(Date.UTC(p.year, p.month - 1, p.day, 12, 0, 0)).getUTCDay();
  return { dateStr, timeStr, dayOfWeek, totalMinutes: p.hour * 60 + p.minute };
}

export function addDaysToDateStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return dt.toISOString().slice(0, 10);
}

export function getUtcBoundsForCreatorDate(dateStr: string, timeZone: string) {
  const safeZone = normalizeTimezone(timeZone);
  const startGuess =
    zonedWallClockToUtc(dateStr, "00:00", safeZone) ||
    new Date(`${dateStr}T00:00:00.000Z`);
  const nextDateStr = addDaysToDateStr(dateStr, 1);
  const endGuess =
    zonedWallClockToUtc(nextDateStr, "00:00", safeZone) ||
    new Date(startGuess.getTime() + 86_400_000);
  const [y, m, d] = dateStr.split("-").map(Number);
  const dayOfWeek = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
  return { dayStartUtc: startGuess, dayEndUtc: endGuess, dayOfWeek };
}
