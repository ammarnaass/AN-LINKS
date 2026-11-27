"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CalendarClock, XCircle, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ClientCancelModal } from "./ClientCancelModal";
import { ClientRescheduleModal } from "./ClientRescheduleModal";
import {
  ClientBookingSummaryCard,
  PortalBookingData,
} from "./ClientBookingSummaryCard";

interface ClientBookingPortalProps {
  bookingId: string;
  initialToken: string;
}

export function ClientBookingPortal({ bookingId, initialToken }: ClientBookingPortalProps) {
  const [booking, setBooking] = useState<PortalBookingData | null>(null);
  const [calendarUrls, setCalendarUrls] = useState<{ google?: string; outlook?: string; ics?: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  const loadBooking = useCallback(async () => {
    if (!initialToken) {
      setError("رابط إدارة الموعد يفتقد رمز التحقق الأمني");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/bio/bookings/${encodeURIComponent(bookingId)}`, {
        headers: { "x-manage-token": initialToken },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "تعذر التحقق من بيانات الحجز");
        return;
      }
      setBooking(data.booking);
      setCalendarUrls(data.calendarUrls || {});
      setError(null);
    } catch {
      setError("حدث خطأ أثناء تحميل بيانات الموعد");
    } finally {
      setLoading(false);
    }
  }, [bookingId, initialToken]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const handleCancel = async (reason: string) => {
    setError(null);
    const res = await fetch(`/api/bio/bookings/${encodeURIComponent(bookingId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-manage-token": initialToken },
      body: JSON.stringify({ action: "cancel", cancelReason: reason }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setError(data.error || "تعذر إلغاء الموعد");
      setShowCancel(false);
      return;
    }
    setShowCancel(false);
    setFeedback("تم إلغاء الموعد وإخطار مقدم الخدمة بنجاح");
    await loadBooking();
  };

  const handleReschedule = async (newStartTime: Date) => {
    setError(null);
    const res = await fetch(`/api/bio/bookings/${encodeURIComponent(bookingId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-manage-token": initialToken },
      body: JSON.stringify({ action: "reschedule", newStartTime: newStartTime.toISOString() }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setError(data.error || "تعذر تغيير وقت الموعد");
      setShowReschedule(false);
      return;
    }
    setShowReschedule(false);
    setFeedback("تم تحديث موعد الجلسة وإرسال دعوة محدثة إلى بريدك");
    await loadBooking();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-surface text-on-surface font-cairo" dir="rtl">
        <div className="max-w-md w-full p-6 rounded-2xl bg-surface-container border border-error/30 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-error mx-auto" />
          <h1 className="text-base font-black">تعذر عرض تفاصيل الحجز</h1>
          <p className="text-xs text-on-surface-variant">{error || "تأكد من صلاحية رابط إدارة الحجز المرسل لبريدك"}</p>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="min-h-screen bg-surface text-on-surface py-10 px-4 font-cairo" dir="rtl">
      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-surface-container border border-outline-variant/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-outline-variant/25 pb-4">
          <div>
            <p className="text-[11px] text-on-surface-variant font-semibold">بوابة إدارة الموعد</p>
            <h1 className="text-base sm:text-lg font-black">{booking.service.title}</h1>
            <Link href={`/${booking.creator.username}`} className="text-xs text-primary font-bold hover:underline">
              مع {booking.creator.displayName} (@{booking.creator.username})
            </Link>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isConfirmed
                ? "bg-primary/15 text-primary"
                : booking.status === "COMPLETED"
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-error/15 text-error"
            }`}
          >
            {isConfirmed ? "مؤكد" : booking.status === "COMPLETED" ? "مكتمل" : "ملغي"}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <ClientBookingSummaryCard booking={booking} calendarUrls={calendarUrls} />

        {isConfirmed && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/25">
            <button
              type="button"
              onClick={() => setShowReschedule(true)}
              className="py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CalendarClock className="w-4 h-4 text-primary" /> تغيير الموعد
            </button>
            <button
              type="button"
              onClick={() => setShowCancel(true)}
              className="py-2.5 px-3 rounded-xl bg-error/10 hover:bg-error/20 text-error text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> إلغاء الموعد
            </button>
          </div>
        )}
      </div>

      {showCancel && <ClientCancelModal onClose={() => setShowCancel(false)} onConfirm={handleCancel} />}
      {showReschedule && (
        <ClientRescheduleModal
          username={booking.creator.username}
          service={booking.service}
          creatorTimezone={booking.creator.timezone}
          onClose={() => setShowReschedule(false)}
          onConfirm={handleReschedule}
        />
      )}
    </div>
  );
}
