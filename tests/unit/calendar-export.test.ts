import { describe, it, expect } from "vitest";
import {
  formatToIcsUtc,
  escapeIcsText,
  generateIcsCalendarEvent,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  CalendarEventInput,
} from "@/features/appointments/services/calendar-export.service";

describe("Calendar Sync & RFC 5545 ICS Export Suite", () => {
  const dummyEvent: CalendarEventInput = {
    bookingId: "book_xyz_123",
    title: "استشارة تجارة رقمية متقدمة",
    description: "جلسة مراجعة متجر واستراتيجية مبيعات 2026, مع تحليل الروابط;",
    startTime: new Date("2026-12-01T10:00:00.000Z"),
    endTime: new Date("2026-12-01T11:00:00.000Z"),
    meetingUrl: "https://meet.google.com/anl-test-meet",
    creatorName: "عمار المهندس",
    clientName: "أحمد العميل",
  };

  it("formats date to RFC 5545 UTC timestamp correctly", () => {
    const formatted = formatToIcsUtc(new Date("2026-12-01T10:00:00.000Z"));
    expect(formatted).toBe("20261201T100000Z");
  });

  it("escapes special characters (commas, semicolons, newlines, backslashes) in ICS text", () => {
    const raw = "نص مع فاصلة, وفاصلة منقوطة; وسطر\nجديد وشرطة مائلة \\";
    const escaped = escapeIcsText(raw);
    expect(escaped).toBe("نص مع فاصلة\\, وفاصلة منقوطة\\; وسطر\\nجديد وشرطة مائلة \\\\");
  });

  it("generates valid RFC 5545 VCALENDAR payload with CRLF delimiters", () => {
    const ics = generateIcsCalendarEvent(dummyEvent);

    // Verify RFC 5545 structural tags
    expect(ics).toContain("BEGIN:VCALENDAR\r\n");
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("PRODID:-//AN LINKS//Creator Calendar Sync//AR\r\n");
    expect(ics).toContain("BEGIN:VEVENT\r\n");
    expect(ics).toContain("UID:anl-book_xyz_123@anlinks.dev\r\n");
    expect(ics).toContain("DTSTART:20261201T100000Z\r\n");
    expect(ics).toContain("DTEND:20261201T110000Z\r\n");
    expect(ics).toContain("SUMMARY:استشارة تجارة رقمية متقدمة\r\n");
    expect(ics).toContain("STATUS:CONFIRMED\r\n");
    expect(ics).toContain("END:VEVENT\r\n");
    expect(ics).toContain("END:VCALENDAR\r\n");

    // Verify meeting link and escaping in description
    expect(ics).toContain("https://meet.google.com/anl-test-meet");
    expect(ics).toContain("عمار المهندس");
    expect(ics).toContain("أحمد العميل");
  });

  it("generates 1-click Google Calendar URL with encoded parameters", () => {
    const googleUrl = generateGoogleCalendarUrl(dummyEvent);
    expect(googleUrl).toContain("https://calendar.google.com/calendar/render?action=TEMPLATE");
    expect(googleUrl).toContain("dates=20261201T100000Z/20261201T110000Z");
    expect(googleUrl).toContain(encodeURIComponent("استشارة تجارة رقمية متقدمة"));
    expect(googleUrl).toContain(encodeURIComponent("https://meet.google.com/anl-test-meet"));
  });

  it("generates 1-click Outlook Calendar URL with encoded parameters", () => {
    const outlookUrl = generateOutlookCalendarUrl(dummyEvent);
    expect(outlookUrl).toContain("https://outlook.live.com/calendar/0/deeplink/compose");
    expect(outlookUrl).toContain(encodeURIComponent("استشارة تجارة رقمية متقدمة"));
    expect(outlookUrl).toContain(encodeURIComponent(dummyEvent.startTime.toISOString()));
    expect(outlookUrl).toContain(encodeURIComponent(dummyEvent.endTime.toISOString()));
  });
});
