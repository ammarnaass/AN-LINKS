"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Video, Phone, MapPin, Calendar, Copy, Check, ExternalLink, RefreshCw, Settings2 } from "lucide-react";

interface BookingConfirmationStepProps {
  booking: {
    id: string;
    clientName: string;
    startTime: string | Date;
    meetingType?: string | null;
    meetingLocation?: string | null;
    meetingUrl?: string | null;
    amountPaid?: number;
    currency?: string;
  };
  calendarUrls: {
    google?: string;
    outlook?: string;
    ics?: string;
  };
  manageUrl?: string;
  creatorTimezone?: string;
  onReset: () => void;
  accentColor: string;
}

export function BookingConfirmationStep({
  booking,
  calendarUrls,
  manageUrl,
  creatorTimezone = "Asia/Riyadh",
  onReset,
  accentColor,
}: BookingConfirmationStepProps) {
  const [copied, setCopied] = useState(false);
  const start = new Date(booking.startTime);
  const mType = booking.meetingType || "ONLINE";

  const handleCopyLink = () => {
    if (booking.meetingUrl) {
      navigator.clipboard.writeText(booking.meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="text-center space-y-4 py-2">
      <div
        className="w-12 h-12 rounded-full mx-auto flex items-center justify-center shadow-md"
        style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
      >
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div>
        <h4 className="text-sm sm:text-base font-black text-on-surface">
          تم تأكيد موعدك بنجاح!
        </h4>
        <p className="text-xs text-on-surface-variant mt-1">
          أهلاً {booking.clientName}، موعدك مجدول بتاريخ:
        </p>
        <p className="text-xs font-bold text-amber-500 mt-0.5 font-mono">
          {start.toLocaleDateString("ar-SA", { timeZone: creatorTimezone, weekday: "long", day: "numeric", month: "long" })} الساعة{" "}
          {start.toLocaleTimeString("ar-SA", { timeZone: creatorTimezone, hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {mType === "ONLINE" && booking.meetingUrl && (
        <div className="p-3 rounded-2xl bg-surface-container-low/75 border border-outline-variant/30 space-y-2">
          <span className="text-[11px] font-bold text-on-surface block">رابط الاجتماع الافتراضي</span>
          <div className="flex gap-2">
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" /> دخول الاجتماع
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {mType === "PHONE" && (
        <div className="p-3 rounded-2xl bg-surface-container-low/75 border border-outline-variant/30 text-xs text-on-surface flex items-center justify-center gap-2">
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span>سيتواصل معك المبدع هاتفياً على رقمك المسجل في الموعد المحدد</span>
        </div>
      )}

      {mType === "IN_PERSON" && (
        <div className="p-3 rounded-2xl bg-surface-container-low/75 border border-outline-variant/30 text-xs text-on-surface space-y-1">
          <div className="font-bold flex items-center justify-center gap-1.5 text-primary">
            <MapPin className="w-4 h-4" /> موقع اللقاء الحضوري
          </div>
          <p className="text-on-surface-variant">{booking.meetingLocation || "سيتم إرسال الموقع عبر البريد الإلكتروني"}</p>
        </div>
      )}

      <div className="pt-1">
        <span className="text-[11px] font-semibold text-on-surface-variant block mb-2">إضافة الموعد إلى تقويمك:</span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {calendarUrls.google && (
            <a
              href={calendarUrls.google}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container text-[11px] font-semibold border border-outline-variant/25"
            >
              Google Calendar <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {calendarUrls.outlook && (
            <a
              href={calendarUrls.outlook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container text-[11px] font-semibold border border-outline-variant/25"
            >
              Outlook <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {calendarUrls.ics && (
            <a
              href={calendarUrls.ics}
              download
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container text-[11px] font-semibold border border-outline-variant/25"
            >
              <Calendar className="w-2.5 h-2.5" /> Apple (.ics)
            </a>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-outline-variant/25 flex items-center justify-between flex-wrap gap-2">
        {manageUrl ? (
          <Link
            href={manageUrl}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            <Settings2 className="w-3.5 h-3.5" /> إدارة / تأجيل / إلغاء الموعد
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> حجز موعد آخر
        </button>
      </div>
    </div>
  );
}
