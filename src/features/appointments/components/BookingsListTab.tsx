"use client";

import React, { useState } from "react";
import {
  Search,
  Video,
  Calendar as CalendarIcon,
  XCircle,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { AppBadge } from "@/shared/ui/AppBadge";
import { CancelBookingModal } from "./CancelBookingModal";

export interface BookingRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  clientNotes?: string | null;
  startTime: string | Date;
  endTime: string | Date;
  status: string;
  amountPaid?: number;
  creatorNetAmount?: number;
  gatewayCode?: string | null;
  meetingUrl?: string | null;
  service?: {
    title: string;
    price: number;
    currency: string;
    durationMinutes: number;
    meetingType?: string;
    meetingLocation?: string | null;
  } | null;
}

interface BookingsListTabProps {
  bookings: BookingRecord[];
  creatorTimezone: string;
  onStatusChange: (
    id: string,
    status: "COMPLETED" | "CANCELLED",
    cancelReason?: string
  ) => Promise<void>;
}

const FILTER_OPTIONS = [
  { id: "ALL", label: "الكل" },
  { id: "CONFIRMED", label: "المؤكدة" },
  { id: "COMPLETED", label: "المكتملة" },
  { id: "CANCELLED", label: "الملغاة" },
];

export function BookingsListTab({
  bookings,
  creatorTimezone,
  onStatusChange,
}: BookingsListTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [cancellingTarget, setCancellingTarget] = useState<BookingRecord | null>(null);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      b.clientName.toLowerCase().includes(q) ||
      b.clientEmail.toLowerCase().includes(q) ||
      (b.clientPhone || "").includes(q);
    return matchesSearch && (statusFilter === "ALL" || b.status === statusFilter);
  });

  const handleComplete = async (id: string) => {
    try {
      setUpdatingId(id);
      await onStatusChange(id, "COMPLETED");
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
            placeholder="البحث باسم العميل أو البريد أو الجوال..."
            className="w-full pr-10 pl-4 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-surface-container-high/60 rounded-xl border border-outline-variant/20 text-xs overflow-x-auto">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
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
            const isConfirmed = b.status === "CONFIRMED";
            const isCompleted = b.status === "COMPLETED";
            const isCancelled = b.status === "CANCELLED";
            const variant = isConfirmed ? "primary" : isCompleted ? "success" : isCancelled ? "error" : "warning";
            const statusText = isConfirmed ? "مؤكد" : isCompleted ? "مكتمل" : isCancelled ? "ملغي" : "قيد الانتظار";

            return (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-outline-variant/25 bg-surface-container/35 hover:border-outline-variant/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> {b.clientName}
                    </span>
                    <AppBadge variant={variant} className="text-[10px]">
                      {statusText}
                    </AppBadge>
                    {b.service && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-medium">
                        {b.service.title} ({b.service.durationMinutes} د)
                      </span>
                    )}
                    {(b.amountPaid ?? 0) > 0 && (
                      <span className="text-[11px] font-bold text-on-surface">
                        • {b.amountPaid} {b.service?.currency || "SAR"} ({b.gatewayCode || "مدفوع"})
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
                      <CalendarIcon className="w-3 h-3 text-amber-500" />
                      {start.toLocaleString("ar-SA", {
                        timeZone: creatorTimezone,
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {b.clientNotes && (
                    <p className="text-[11px] text-on-surface-variant bg-surface-container-high/50 px-2.5 py-1.5 rounded-lg flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{b.clientNotes}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
                  {b.meetingUrl && !isCancelled && (
                    <a
                      href={b.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/15 text-primary hover:bg-primary/25 transition-all"
                    >
                      <Video className="w-3.5 h-3.5" /> دخول الجلسة
                    </a>
                  )}
                  <a
                    href={`/api/appointments/${b.id}/calendar`}
                    download
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" /> .ics
                  </a>
                  {isConfirmed && (
                    <>
                      <button
                        disabled={updatingId === b.id}
                        onClick={() => handleComplete(b.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> إتمام
                      </button>
                      <button
                        disabled={updatingId === b.id}
                        onClick={() => setCancellingTarget(b)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-error/10 text-error hover:bg-error/20 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> إلغاء
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancellingTarget && (
        <CancelBookingModal
          clientName={cancellingTarget.clientName}
          onCancel={() => setCancellingTarget(null)}
          onConfirm={async (reason) => {
            await onStatusChange(cancellingTarget.id, "CANCELLED", reason);
            setCancellingTarget(null);
          }}
        />
      )}
    </div>
  );
}
