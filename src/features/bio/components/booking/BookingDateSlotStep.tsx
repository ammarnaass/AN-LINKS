"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Calendar, Clock, Loader2, Globe, CalendarOff } from "lucide-react";
import {
  ConsultationServiceItem,
  ConsultationSlot,
  PublicGatewayOption,
} from "@/features/appointments/types/appointments.types";
import { addDaysToDateStr } from "@/features/appointments/utils/timezone";

export interface SlotsLoadedMeta {
  creatorTimezone: string;
  gateways: PublicGatewayOption[];
}

interface BookingDateSlotStepProps {
  username: string;
  service: ConsultationServiceItem;
  creatorTimezone?: string;
  onBack?: () => void;
  onSelectSlot: (slot: ConsultationSlot, meta: SlotsLoadedMeta) => void;
  accentColor: string;
  isPreview?: boolean;
  hideHeader?: boolean;
}

export function BookingDateSlotStep({
  username,
  service,
  creatorTimezone: initialTimezone = "Asia/Riyadh",
  onBack,
  onSelectSlot,
  accentColor,
  isPreview = false,
  hideHeader = false,
}: BookingDateSlotStepProps) {
  const [timezone, setTimezone] = useState(initialTimezone);
  const dates = useMemo(() => {
    const todayInZone = new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(new Date());
    return Array.from({ length: 14 }, (_, i) => addDaysToDateStr(todayInZone, i));
  }, [timezone]);

  const [selectedDate, setSelectedDate] = useState(() => dates[0]);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableDaysMask, setAvailableDaysMask] = useState<number[] | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [gateways, setGateways] = useState<PublicGatewayOption[]>([]);

  useEffect(() => {
    if (isPreview) {
      const start = new Date(`${selectedDate}T10:00:00.000Z`);
      const end = new Date(start.getTime() + service.durationMinutes * 60_000);
      setSlots([
        { slotDate: selectedDate, startTime: "10:00", endTime: "10:45", startDateTime: start, endDateTime: end, isAvailable: true },
        { slotDate: selectedDate, startTime: "13:00", endTime: "13:45", startDateTime: new Date(start.getTime() + 3 * 3600_000), endDateTime: new Date(end.getTime() + 3 * 3600_000), isAvailable: true },
      ]);
      setGateways([{ code: "mada", nameAr: "مدى (معاينة)", nameEn: "Mada", category: "LOCAL", isTestMode: true, supportedCurrencies: [service.currency] }]);
      return;
    }

    let isMounted = true;
    async function loadSlots() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/bio/${encodeURIComponent(username)}/appointments/slots?serviceId=${encodeURIComponent(service.id)}&date=${encodeURIComponent(selectedDate)}`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success) {
            const normalized = (data.slots || []).map((s: ConsultationSlot) => ({
              ...s,
              startDateTime: new Date(s.startDateTime),
              endDateTime: new Date(s.endDateTime),
            }));
            setSlots(normalized);
            if (data.creatorTimezone || data.timezone) setTimezone(data.creatorTimezone || data.timezone);
            if (Array.isArray(data.availableDaysMask)) setAvailableDaysMask(data.availableDaysMask);
            if (Array.isArray(data.blockedDates)) setBlockedDates(data.blockedDates);
            setBlockReason(data.isBlockedDate ? data.blockReason || "عطلة مجدولة" : null);
            setGateways(Array.isArray(data.gateways) ? data.gateways : []);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [username, service.id, service.durationMinutes, service.currency, selectedDate, isPreview]);

  return (
    <div className="space-y-3">
      {!hideHeader && onBack && (
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/25">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" /> تغيير الباقة
          </button>
          <span className="text-[11px] font-bold text-on-surface">
            {service.title} ({service.durationMinutes} د)
          </span>
        </div>
      )}

      <div>
        <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" style={{ color: accentColor }} /> اختر تاريخ الموعد
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dates.map((dStr) => {
            const safeMidday = new Date(`${dStr}T12:00:00.000Z`);
            const dayOfWeek = safeMidday.getUTCDay();
            const isSelected = selectedDate === dStr;
            const isHoliday = blockedDates.includes(dStr);
            const isDayClosed = availableDaysMask !== null && !availableDaysMask.includes(dayOfWeek);
            const dayName = safeMidday.toLocaleDateString("ar-SA", { timeZone: "UTC", weekday: "short" });
            const dayNum = safeMidday.toLocaleDateString("ar-SA", { timeZone: "UTC", day: "numeric" });

            return (
              <button
                key={dStr}
                type="button"
                onClick={() => setSelectedDate(dStr)}
                className={`flex flex-col items-center justify-center min-w-[56px] py-2 px-1.5 rounded-xl border text-xs transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-on-primary font-bold border-primary shadow-sm"
                    : isHoliday || isDayClosed
                    ? "bg-surface-container-low/40 border-outline-variant/20 text-on-surface-variant/45 opacity-70"
                    : "bg-surface-container-low/75 border-outline-variant/30 text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="text-[10px] opacity-85">{dayName}</span>
                <span className="text-sm font-black">{dayNum}</span>
                {isHoliday && <span className="text-[9px] text-error font-bold">إجازة</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <label className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> الفترات المتاحة
          </label>
          <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
            <Globe className="w-3 h-3" /> بتوقيت {timezone === "Asia/Riyadh" ? "الرياض (GMT+3)" : timezone}
          </span>
        </div>

        {loading ? (
          <div className="py-6 flex justify-center items-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : blockReason ? (
          <div className="text-center py-4 px-3 text-xs text-error bg-error/10 rounded-xl border border-error/25 flex items-center justify-center gap-2">
            <CalendarOff className="w-4 h-4 shrink-0" />
            <span>{blockReason} — يرجى اختيار يوم آخر</span>
          </div>
        ) : slots.length === 0 ? (
          <p className="text-center py-4 px-3 text-xs text-on-surface-variant bg-surface-container-low/60 rounded-xl border border-outline-variant/20">
            لا توجد فترات متاحة في هذا اليوم، يرجى اختيار تاريخ آخر.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-0.5">
            {slots.map((s, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!s.isAvailable}
                onClick={() => onSelectSlot(s, { creatorTimezone: timezone, gateways })}
                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center ${
                  s.isAvailable
                    ? "bg-surface-container-high/80 hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/35 cursor-pointer"
                    : "bg-surface-container-low/40 text-on-surface-variant/30 border border-outline-variant/10 cursor-not-allowed line-through"
                }`}
              >
                {s.startTime}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
