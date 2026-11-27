"use client";

import React, { useState } from "react";
import { CheckCircle2, Video, Calendar, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";

interface BookingConfirmationStepProps {
  booking: {
    id: string;
    clientName: string;
    startTime: string | Date;
    meetingUrl?: string | null;
  };
  calendarUrls: {
    google?: string;
    outlook?: string;
    ics?: string;
  };
  onReset: () => void;
  accentColor: string;
}

export function BookingConfirmationStep({
  booking,
  calendarUrls,
  onReset,
  accentColor,
}: BookingConfirmationStepProps) {
  const [copied, setCopied] = useState(false);
  const start = new Date(booking.startTime);

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
        className="w-12 h-12 rounded-full mx-auto flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-300"
        style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
      >
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div>
        <h4 className="text-sm sm:text-base font-black text-white">
          تم تأكيد موعدك بنجاح! 🎉
        </h4>
        <p className="text-xs text-white/70 mt-1">
          أهلاً {booking.clientName}، موعدك مجدول بتاريخ:
        </p>
        <p className="text-xs font-bold text-amber-400 mt-0.5 font-mono">
          {start.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })} الساعة {start.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {booking.meetingUrl && (
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <span className="text-[11px] font-bold text-white/80 block">رابط الاجتماع الافتراضي</span>
          <div className="flex gap-2">
            <a
              href={booking.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-primary text-black hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" /> دخول الاجتماع
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs flex items-center gap-1 transition-all"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="pt-1">
        <span className="text-[11px] font-semibold text-white/60 block mb-2">إضافة الموعد إلى تقويمك:</span>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {calendarUrls.google && (
            <a
              href={calendarUrls.google}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-[11px] font-medium transition-all"
            >
              Google Calendar <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {calendarUrls.outlook && (
            <a
              href={calendarUrls.outlook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-[11px] font-medium transition-all"
            >
              Outlook <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
          {calendarUrls.ics && (
            <a
              href={calendarUrls.ics}
              download
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-[11px] font-medium transition-all"
            >
              <Calendar className="w-2.5 h-2.5" /> Apple (.ics)
            </a>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-white/60 hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> حجز موعد آخر
        </button>
      </div>
    </div>
  );
}
