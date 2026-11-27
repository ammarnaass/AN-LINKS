"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Calendar, Clock, Loader2, Globe } from "lucide-react";
import {
  ConsultationServiceItem,
  ConsultationSlot,
} from "@/features/appointments/types/appointments.types";

interface BookingDateSlotStepProps {
  username: string;
  service: ConsultationServiceItem;
  onBack: () => void;
  onSelectSlot: (slot: ConsultationSlot) => void;
  accentColor: string;
}

export function BookingDateSlotStep({
  username,
  service,
  onBack,
  onSelectSlot,
  accentColor,
}: BookingDateSlotStepProps) {
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState("Asia/Riyadh");

  useEffect(() => {
    let isMounted = true;
    async function loadSlots() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/bio/${encodeURIComponent(username)}/appointments/slots?serviceId=${encodeURIComponent(
            service.id
          )}&date=${encodeURIComponent(selectedDate)}`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success) {
            setSlots(data.slots || []);
            if (data.timezone) setTimezone(data.timezone);
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
  }, [username, service.id, selectedDate]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" /> تغيير الباقة
        </button>
        <span className="text-[11px] font-bold text-white/90">
          {service.title} ({service.durationMinutes} د)
        </span>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/80 mb-1.5 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-primary" /> اختر تاريخ الموعد
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dates.map((dStr) => {
            const d = new Date(`${dStr}T00:00:00.000Z`);
            const isSelected = selectedDate === dStr;
            const dayName = d.toLocaleDateString("ar-SA", { weekday: "short" });
            const dayNum = d.toLocaleDateString("ar-SA", { day: "numeric" });

            return (
              <button
                key={dStr}
                type="button"
                onClick={() => setSelectedDate(dStr)}
                className={`flex flex-col items-center justify-center min-w-[54px] py-2 px-1.5 rounded-xl border text-xs transition-all shrink-0 ${
                  isSelected
                    ? "bg-primary text-black font-bold border-primary shadow-sm"
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                }`}
              >
                <span className="text-[10px] opacity-80">{dayName}</span>
                <span className="text-sm font-black">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-semibold text-white/80 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> الفترات المتاحة
          </label>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Globe className="w-3 h-3" /> بتوقيت {timezone === "Asia/Riyadh" ? "مكة المكرمة" : timezone}
          </span>
        </div>

        {loading ? (
          <div className="py-6 flex justify-center items-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-center py-4 text-xs text-white/50 bg-white/5 rounded-xl border border-white/5">
            لا توجد فترات متاحة في هذا اليوم، يرجى اختيار تاريخ آخر.
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-0.5">
            {slots.map((s, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!s.isAvailable}
                onClick={() => onSelectSlot(s)}
                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center ${
                  s.isAvailable
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    : "bg-white/5 text-white/25 border-transparent cursor-not-allowed line-through"
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
