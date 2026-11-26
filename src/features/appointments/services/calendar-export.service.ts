export interface CalendarEventInput {
  bookingId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  meetingUrl?: string;
  creatorName?: string;
  clientName?: string;
}

export function formatToIcsUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function escapeIcsText(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function generateIcsCalendarEvent(event: CalendarEventInput): string {
  const now = new Date();
  const dtStamp = formatToIcsUtc(now);
  const dtStart = formatToIcsUtc(event.startTime);
  const dtEnd = formatToIcsUtc(event.endTime);
  const uid = `anl-${event.bookingId}@anlinks.dev`;

  const description = [
    event.description || "",
    event.meetingUrl ? `رابط الاجتماع: ${event.meetingUrl}` : "",
    event.creatorName ? `مع مقدم الاستشارة: ${event.creatorName}` : "",
    event.clientName ? `اسم العميل: ${event.clientName}` : "",
    "تم الحجز عبر منصة AN LINKS",
  ]
    .filter(Boolean)
    .join("\n\n");

  const escapedSummary = escapeIcsText(event.title);
  const escapedDescription = escapeIcsText(description);
  const escapedLocation = escapeIcsText(event.meetingUrl || "Google Meet Online");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AN LINKS//Creator Calendar Sync//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapedSummary}`,
    `DESCRIPTION:${escapedDescription}`,
    `LOCATION:${escapedLocation}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n") + "\r\n";
}

export function generateGoogleCalendarUrl(event: CalendarEventInput): string {
  const startStr = formatToIcsUtc(event.startTime);
  const endStr = formatToIcsUtc(event.endTime);
  const details = encodeURIComponent(
    `${event.description || ""}\n\nرابط الاجتماع: ${event.meetingUrl || ""}\n\nتم الحجز عبر منصة AN LINKS`
  );
  const text = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.meetingUrl || "Google Meet Online");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
}

export function generateOutlookCalendarUrl(event: CalendarEventInput): string {
  const startStr = encodeURIComponent(event.startTime.toISOString());
  const endStr = encodeURIComponent(event.endTime.toISOString());
  const subject = encodeURIComponent(event.title);
  const body = encodeURIComponent(
    `${event.description || ""}\n\nرابط الاجتماع: ${event.meetingUrl || ""}\n\nتم الحجز عبر منصة AN LINKS`
  );
  const location = encodeURIComponent(event.meetingUrl || "Google Meet Online");
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${startStr}&enddt=${endStr}&body=${body}&location=${location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
}
