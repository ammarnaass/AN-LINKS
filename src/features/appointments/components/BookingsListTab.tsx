"use client";

import React, { useState } from "react";
import { Search, Video, Calendar as CalendarIcon, XCircle, CheckCircle2, User, Phone, Mail } from "lucide-react";
import { AppBadge } from "@/shared/ui/AppBadge";

export interface BookingRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  meetingUrl?: string | null;
  service?: {
    title: string;
    price: number;
    currency: string;
    durationMinutes: number;
  } | null;
}

interface BookingsListTabProps {
  bookings: BookingRecord[];
  onStatusChange: (id: string, status: "CONFIRMED" | "CANCELLED") => Promise<void>;
}

export function BookingsListTab({ bookings, onStatusChange }: BookingsListTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(search.toLowerCase()) ||
      b.clientEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdate = async (id: string, status: "CONFIRMED" | "CANCELLED") => {
    try {
      setUpdatingId(id);
      await onStatusChange(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم العميل أو البريد الإلكتروني..."
            className="w-full pr-10 pl-4 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-surface-container-high/60 rounded-xl border border-outline-variant/20 text-xs self-start">
          {[
            { id: "ALL", label: "الكل" },
            { id: "CONFIRMED", label: "المؤكدة" },
            { id: "PENDING_PAYMENT", label: "قيد التأكيد" },
            { id: "CANCELLED", label: "الملغاة" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === f.id
                  ? "bg-primary text-on-primary shadow-sm font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container/20">
          <CalendarIcon className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-on-surface-variant">لا توجد مواعيد مطابقة</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((b) => {
            const start = new Date(b.startTime);
            const isPending = b.status === "PENDING_PAYMENT";
            const isConfirmed = b.status === "CONFIRMED";
            const isCancelled = b.status === "CANCELLED";

            return (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-outline-variant/20 bg-surface-container/30 hover:border-outline-variant/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> {b.clientName}
                    </span>
                    <AppBadge
                      variant={isConfirmed ? "success" : isPending ? "warning" : "error"}
                      className="text-[10px]"
                    >
                      {isConfirmed ? "مؤكد" : isPending ? "قيد الانتظار" : "ملغي"}
                    </AppBadge>
                    {b.service && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-medium">
                        {b.service.title} ({b.service.durationMinutes} دقيقة)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-outline" /> {b.clientEmail}
                    </span>
                    {b.clientPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-outline" /> {b.clientPhone}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-on-surface font-semibold">
                      <CalendarIcon className="w-3 h-3 text-amber-400" />
                      {start.toLocaleDateString("ar-SA", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} الساعة {start.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                  {b.meetingUrl && (
                    <a
                      href={b.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    >
                      <Video className="w-3.5 h-3.5" /> انضمام للاجتماع
                    </a>
                  )}
                  <a
                    href={`/api/appointments/${b.id}/calendar`}
                    download
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"
                    title="تحميل ملف التقويم .ics"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" /> التقويم
                  </a>
                  {isPending && (
                    <button
                      disabled={updatingId === b.id}
                      onClick={() => handleUpdate(b.id, "CONFIRMED")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> تأكيد
                    </button>
                  )}
                  {!isCancelled && (
                    <button
                      disabled={updatingId === b.id}
                      onClick={() => handleUpdate(b.id, "CANCELLED")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> إلغاء
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
