export interface CalendarEventInput {
  bookingId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  meetingUrl?: string | null;
  meetingType?: string;
  location?: string | null;
  status?: "CONFIRMED" | "CANCELLED";
  sequence?: number;
  creatorName?: string;
  clientName?: string;
}

export function formatToIcsUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export function escapeIcsText(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function resolveCalendarLocation(event: CalendarEventInput): string {
  if (event.meetingUrl) return event.meetingUrl;
  if (event.location) return event.location;
  if (event.meetingType === "PHONE") return "مكالمة هاتفية مباشرة";
  if (event.meetingType === "IN_PERSON") return "لقاء حضوري";
  return "جلسة افتراضية | AN LINKS";
}

function buildCalendarDetails(event: CalendarEventInput): string {
  return [
    event.description || "",
    event.meetingUrl ? `رابط الاجتماع: ${event.meetingUrl}` : "",
    event.location && !event.meetingUrl ? `الموقع / التفاصيل: ${event.location}` : "",
    event.creatorName ? `مع مقدم الاستشارة: ${event.creatorName}` : "",
    event.clientName ? `اسم العميل: ${event.clientName}` : "",
    "تمت الإدارة عبر منصة AN LINKS",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function generateIcsCalendarEvent(event: CalendarEventInput): string {
  const dtStamp = formatToIcsUtc(new Date());
  const dtStart = formatToIcsUtc(event.startTime);
  const dtEnd = formatToIcsUtc(event.endTime);
  const uid = `anl-${event.bookingId}@anlinks.dev`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AN LINKS//Creator Calendar Sync//AR",
    "CALSCALE:GREGORIAN",
    event.status === "CANCELLED" ? "METHOD:CANCEL" : "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SEQUENCE:${event.sequence ?? 0}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(buildCalendarDetails(event))}`,
    `LOCATION:${escapeIcsText(resolveCalendarLocation(event))}`,
    `STATUS:${event.status === "CANCELLED" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n") + "\r\n";
}

export function generateGoogleCalendarUrl(event: CalendarEventInput): string {
  const startStr = formatToIcsUtc(event.startTime);
  const endStr = formatToIcsUtc(event.endTime);
  const details = encodeURIComponent(buildCalendarDetails(event));
  const text = encodeURIComponent(event.title);
  const location = encodeURIComponent(resolveCalendarLocation(event));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}

export function generateOutlookCalendarUrl(event: CalendarEventInput): string {
  const startStr = encodeURIComponent(event.startTime.toISOString());
  const endStr = encodeURIComponent(event.endTime.toISOString());
  const subject = encodeURIComponent(event.title);
  const body = encodeURIComponent(buildCalendarDetails(event));
  const location = encodeURIComponent(resolveCalendarLocation(event));
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${startStr}&enddt=${endStr}&body=${body}&location=${location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
}
