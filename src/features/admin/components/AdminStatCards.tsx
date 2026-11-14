import React from "react";
import { Users, UserCheck, UserX, AlertTriangle } from "lucide-react";
import { AppCard } from "@/shared/ui";

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingReports: number;
}

export function AdminStatCards({ stats }: { stats: AdminStats }) {
  const cards = [
    {
      title: "إجمالي الحسابات",
      value: stats.totalUsers,
      icon: <Users className="w-5 h-5 text-primary" />,
      color: "border-primary/30",
    },
    {
      title: "الحسابات النشطة",
      value: stats.activeUsers,
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/30",
    },
    {
      title: "الحسابات الموقوفة",
      value: stats.suspendedUsers,
      icon: <UserX className="w-5 h-5 text-error" />,
      color: "border-error/30",
    },
    {
      title: "بلاغات معلقة (ADM-3)",
      value: stats.pendingReports,
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
      {cards.map((c, i) => (
        <AppCard key={i} className={`p-4 sm:p-5 flex items-center justify-between ${c.color}`}>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-on-surface-variant font-cairo mb-1">
              {c.title}
            </span>
            <span className="text-2xl font-bold text-on-surface font-cairo">
              {c.value}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
            {c.icon}
          </div>
        </AppCard>
      ))}
    </div>
  );
}

