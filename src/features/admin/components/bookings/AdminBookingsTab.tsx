"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Coins, CheckCircle2, Layers, Search, XCircle, Loader2, RefreshCw } from "lucide-react";
import { AppBadge } from "@/shared/ui/AppBadge";

interface AdminBookingItem {
  id: string;
  clientName: string;
  clientEmail: string;
  startTime: string;
  status: string;
  amountPaid: number;
  platformCommission: number;
  creatorNetAmount: number;
  gatewayCode?: string | null;
  service?: { title: string; price: number; currency: string; durationMinutes: number } | null;
  creator?: { username: string; profile?: { displayName: string } | null } | null;
}

interface AdminBookingsStats {
  totalBookings: number;
  confirmedOrCompleted: number;
  completedCount: number;
  totalServices: number;
  totalGmvSar: number;
  totalCommissionSar: number;
}

const STATUS_FILTERS = [
  { id: "ALL", label: "الكل" },
  { id: "CONFIRMED", label: "المؤكدة" },
  { id: "COMPLETED", label: "المكتملة" },
  { id: "CANCELLED", label: "الملغاة" },
];

export function AdminBookingsTab() {
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [stats, setStats] = useState<AdminBookingsStats | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams({ status: statusFilter, search });
      const res = await fetch(`/api/admin/bookings?${q.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setBookings(json.bookings || []);
          setStats(json.stats || null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdminCancel = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action: "cancel" }),
      });
      if (res.ok) await loadData();
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/40">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
              <span>إجمالي GMV المواعيد</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl font-black text-on-surface">{stats.totalGmvSar.toLocaleString()} SAR</div>
          </div>
          <div className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/40">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
              <span>عمولات المنصة المحصلة</span>
              <Coins className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xl font-black text-primary">{stats.totalCommissionSar.toLocaleString()} SAR</div>
          </div>
          <div className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/40">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
              <span>الجلسات النشطة والمكتملة</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black text-on-surface">{stats.confirmedOrCompleted} ({stats.completedCount} مكتمل)</div>
          </div>
          <div className="p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/40">
            <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
              <span>باقات الاستشارات النشطة</span>
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-black text-on-surface">{stats.totalServices}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم العميل، البريد، أو @username المبدع..."
            className="w-full pr-10 pl-4 py-2 rounded-xl text-xs bg-surface-container-high border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-surface-container-high/60 rounded-xl border border-outline-variant/20 text-xs">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                  statusFilter === f.id ? "bg-primary text-on-primary font-bold" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer"
            title="تحديث"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : bookings.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-outline-variant/30 text-xs text-on-surface-variant">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
          لا توجد حجوزات مطابقة على المنصة
        </div>
      ) : (
        <div className="grid gap-3">
          {bookings.map((b) => {
            const isConfirmed = b.status === "CONFIRMED";
            const variant = isConfirmed ? "primary" : b.status === "COMPLETED" ? "success" : "error";
            return (
              <div key={b.id} className="p-4 rounded-2xl border border-outline-variant/25 bg-surface-container/35 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{b.clientName}</span>
                    <AppBadge variant={variant} className="text-[10px]">{b.status}</AppBadge>
                    <span className="text-xs text-primary font-semibold">@{b.creator?.username}</span>
                    {b.service && <span className="text-xs text-on-surface-variant">• {b.service.title}</span>}
                  </div>
                  <div className="text-[11px] text-on-surface-variant flex flex-wrap gap-3">
                    <span>{b.clientEmail}</span>
                    <span>• {new Date(b.startTime).toLocaleString("ar-SA")}</span>
                    <span>• المدفوع: <strong>{b.amountPaid} {b.service?.currency || "SAR"}</strong></span>
                    <span>• عمولة المنصة: <strong className="text-primary">{b.platformCommission}</strong></span>
                  </div>
                </div>
                {isConfirmed && (
                  <button
                    type="button"
                    disabled={cancellingId === b.id}
                    onClick={() => handleAdminCancel(b.id)}
                    className="px-3 py-1.5 rounded-xl bg-error/10 text-error hover:bg-error/20 text-xs font-bold inline-flex items-center gap-1 self-end md:self-center cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> إلغاء إداري
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
