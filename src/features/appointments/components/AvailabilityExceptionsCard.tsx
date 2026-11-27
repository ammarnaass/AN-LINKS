"use client";

import React, { useState } from "react";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { AvailabilityExceptionItem } from "../types/appointments.types";

interface AvailabilityExceptionsCardProps {
  exceptions: AvailabilityExceptionItem[];
  onRefresh: () => Promise<void>;
}

export function AvailabilityExceptionsCard({
  exceptions,
  onRefresh,
}: AvailabilityExceptionsCardProps) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    try {
      setSaving(true);
      const res = await fetch("/api/appointments/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_exception", date, reason }),
      });
      if (res.ok) {
        setDate("");
        setReason("");
        await onRefresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/appointments/availability?exceptionId=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) await onRefresh();
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-outline-variant/25 bg-surface-container/35 space-y-4">
      <div className="flex items-center gap-2">
        <CalendarOff className="w-4 h-4 text-error shrink-0" />
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-on-surface">
            أيام الإجازات والعطل الاستثنائية (Blackout Dates)
          </h4>
          <p className="text-[11px] text-on-surface-variant">
            أغلق أي يوم محدد (سفر، إجازة، مناسبة) دون تعطيل جدولك الأسبوعي المتكرر.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="sm:col-span-4 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface font-mono"
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="السبب (اختياري، مثل: إجازة عيد الفطر)"
          className="sm:col-span-5 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-3 px-3 py-2 rounded-xl bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface font-bold transition flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> {saving ? "..." : "إغلاق اليوم"}
        </button>
      </form>

      {exceptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {exceptions.map((ex) => (
            <div
              key={ex.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-error/10 border border-error/25 text-xs"
            >
              <span className="font-mono font-bold text-error">{ex.date}</span>
              {ex.reason && <span className="text-on-surface-variant">• {ex.reason}</span>}
              <button
                type="button"
                onClick={() => handleDelete(ex.id)}
                className="text-error/70 hover:text-error p-0.5"
                title="إزالة الإجازة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
