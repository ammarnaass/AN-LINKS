"use client";

import React from "react";
import { Calendar, CheckCircle, Clock, Wallet } from "lucide-react";
import { BookingOverviewStats } from "../types/appointments.types";

interface AppointmentsStatsCardsProps {
  stats: BookingOverviewStats;
}

export function AppointmentsStatsCards({ stats }: AppointmentsStatsCardsProps) {
  const netValue = stats.netRevenue !== undefined ? stats.netRevenue : stats.totalRevenue;

  const cards = [
    {
      label: "إجمالي المواعيد",
      value: stats.totalBookings,
      sub: null,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "المواعيد القادمة المؤكدة",
      value: stats.upcomingConfirmed,
      sub: null,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "الجلسات المكتملة",
      value: stats.completedBookings,
      sub: null,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "إجمالي العوائد",
      value: `${stats.totalRevenue.toLocaleString()} ${stats.currency}`,
      sub: `الصافي: ${netValue.toLocaleString()} ${stats.currency}`,
      icon: Wallet,
      color: "text-sky-500",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${c.bg} backdrop-blur-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-on-surface-variant">{c.label}</span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                {c.value}
              </div>
              {c.sub && (
                <div className="text-[11px] text-on-surface-variant font-medium mt-0.5">{c.sub}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
