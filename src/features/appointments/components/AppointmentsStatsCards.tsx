"use client";

import React from "react";
import { Calendar, CheckCircle, Clock, DollarSign } from "lucide-react";
import { BookingOverviewStats } from "../types/appointments.types";

interface AppointmentsStatsCardsProps {
  stats: BookingOverviewStats;
}

export function AppointmentsStatsCards({ stats }: AppointmentsStatsCardsProps) {
  const cards = [
    {
      label: "إجمالي المواعيد",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "المواعيد القادمة المؤكدة",
      value: stats.upcomingConfirmed,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "الجلسات المكتملة",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "الإيرادات المحققة",
      value: `${stats.totalRevenue.toLocaleString()} ${stats.currency}`,
      icon: DollarSign,
      color: "text-sky-400",
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
              <span className="text-xs font-medium text-on-surface-variant">
                {c.label}
              </span>
              <Icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
