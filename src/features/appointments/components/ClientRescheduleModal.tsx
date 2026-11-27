"use client";

import React, { useState } from "react";
import { CalendarClock, X, Loader2 } from "lucide-react";
import { BookingDateSlotStep } from "@/features/bio/components/booking/BookingDateSlotStep";
import { ConsultationServiceItem, ConsultationSlot } from "../types/appointments.types";

interface ClientRescheduleModalProps {
  username: string;
  service: ConsultationServiceItem;
  creatorTimezone: string;
  onClose: () => void;
  onConfirm: (newStartTime: Date) => Promise<void>;
}

export function ClientRescheduleModal({
  username,
  service,
  creatorTimezone,
  onClose,
  onConfirm,
}: ClientRescheduleModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    try {
      setSubmitting(true);
      await onConfirm(new Date(selectedSlot.startDateTime));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl bg-surface-container border border-outline-variant/40 p-5 space-y-4 shadow-2xl text-right"
        dir="rtl"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/25 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <CalendarClock className="w-5 h-5" />
            <h3 className="text-sm font-black text-on-surface">إعادة جدولة الموعد</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <BookingDateSlotStep
          username={username}
          service={service}
          creatorTimezone={creatorTimezone}
          hideHeader
          accentColor="#4edea3"
          onSelectSlot={(slot) => setSelectedSlot(slot)}
        />

        {selectedSlot && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-xs flex items-center justify-between gap-2">
            <span className="font-bold text-on-surface">
              الموعد المختار: {selectedSlot.slotDate} الساعة{" "}
              <span className="font-mono text-primary">{selectedSlot.startTime}</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-high text-on-surface cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={!selectedSlot || submitting}
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>تأكيد الموعد الجديد</span>
          </button>
        </div>
      </div>
    </div>
  );
}
