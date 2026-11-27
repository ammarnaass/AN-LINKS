"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft, Clock, CheckCircle } from "lucide-react";

export function AppointmentsDashboardCard() {
  const [data, setData] = useState<{
    upcoming: number;
    total: number;
    nextClient?: string;
    nextTime?: string;
  }>({ upcoming: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/appointments/overview");
        if (res.ok && isMounted) {
          const json = await res.json();
          if (json.success && json.stats) {
            const nextBooking = (json.bookings || []).find(
              (b: { status: string; startTime: string }) =>
                b.status === "CONFIRMED" && new Date(b.startTime) > new Date()
            );

            setData({
              upcoming: json.stats.upcomingConfirmed || 0,
              total: json.stats.totalBookings || 0,
              nextClient: nextBooking?.clientName,
              nextTime: nextBooking?.startTime
                ? new Date(nextBooking.startTime).toLocaleTimeString("ar-SA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : undefined,
            });
          }
        }
      } catch {
        // Silent fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-outline-variant/30 bg-surface-container/30 backdrop-blur-md mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-on-surface">حجز المواعيد والاستشارات</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold">
              {loading ? "..." : `${data.upcoming} قادم`}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {data.nextClient
              ? `أقرب موعد قادم: مع ${data.nextClient} الساعة ${data.nextTime}`
              : "استقبل حجوزات استشاراتك ومكالماتك المدفوعة مباشرة عبر البايو"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm"
        >
          <span>استوديو المواعيد</span>
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
