"use client";

import React from "react";
import { Calendar, Clock, Video, Phone, MapPin, ExternalLink, Globe } from "lucide-react";
import { ConsultationServiceItem } from "../types/appointments.types";

export interface PortalBookingData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientNotes?: string | null;
  startTime: string;
  endTime: string;
  status: string;
  amountPaid: number;
  currency: string;
  meetingUrl?: string | null;
  rescheduleCount: number;
  cancelReason?: string | null;
  service: ConsultationServiceItem;
  creator: {
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    timezone: string;
  };
}

interface ClientBookingSummaryCardProps {
  booking: PortalBookingData;
  calendarUrls: { google?: string; outlook?: string; ics?: string };
}

export function ClientBookingSummaryCard({
  booking,
  calendarUrls,
}: ClientBookingSummaryCardProps) {
  const start = new Date(booking.startTime);
  const isConfirmed = booking.status === "CONFIRMED";
  const mType = booking.service.meetingType || "ONLINE";

  return (
    <>
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/25 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-on-surface">
          <Calendar className="w-4 h-4 text-primary" />
          <span>
            {start.toLocaleDateString("ar-SA", {
              timeZone: booking.creator.timezone,
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono font-bold text-amber-500">
          <Clock className="w-4 h-4" />
          <span>
            {start.toLocaleTimeString("ar-SA", {
              timeZone: booking.creator.timezone,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-on-surface-variant font-cairo text-[11px] flex items-center gap-1">
            (<Globe className="w-3 h-3" /> {booking.creator.timezone})
          </span>
        </div>
        <div className="text-on-surface-variant pt-1">
          العميل: <strong className="text-on-surface">{booking.clientName}</strong> •{" "}
          {booking.amountPaid > 0 ? `${booking.amountPaid} ${booking.currency}` : "استشارة مجانية"}
        </div>
        {booking.cancelReason && (
          <p className="text-error text-[11px] pt-1">سبب الإلغاء: {booking.cancelReason}</p>
        )}
      </div>

      {isConfirmed && mType === "ONLINE" && booking.meetingUrl && (
        <a
          href={booking.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-md"
        >
          <Video className="w-4 h-4" /> الدخول إلى غرفة الاجتماع
        </a>
      )}

      {isConfirmed && mType === "PHONE" && (
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/25 text-xs flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span>سيتم الاتصال بك على رقم هاتفك المسجل في الموعد المحدد</span>
        </div>
      )}

      {isConfirmed && mType === "IN_PERSON" && (
        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/25 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-primary">
            <MapPin className="w-4 h-4" /> موقع الحضور
          </div>
          <p className="text-on-surface-variant">
            {booking.service.meetingLocation || "سيتم تنسيق العنوان مع مقدم الخدمة"}
          </p>
        </div>
      )}

      {isConfirmed && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {calendarUrls.google && (
            <a
              href={calendarUrls.google}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-semibold flex items-center gap-1"
            >
              Google Calendar <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {calendarUrls.outlook && (
            <a
              href={calendarUrls.outlook}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-semibold flex items-center gap-1"
            >
              Outlook <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {calendarUrls.ics && (
            <a
              href={calendarUrls.ics}
              download
              className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs font-semibold flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" /> تنزيل (.ics)
            </a>
          )}
        </div>
      )}
    </>
  );
}
