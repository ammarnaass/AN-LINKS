"use client";

import React from "react";
import { Bell, CheckCircle2, Eye, MousePointerClick } from "lucide-react";
import { SystemNotificationItem } from "@/features/notifications";

interface NotificationStatsCardsProps {
  notifications: SystemNotificationItem[];
}

export function NotificationStatsCards({ notifications }: NotificationStatsCardsProps) {
  const totalCount = notifications.length;
  const activeCount = notifications.filter((n) => n.isActive).length;
  const totalViews = notifications.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const totalClicks = notifications.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  const cards = [
    {
      title: "إجمالي الإشعارات",
      value: totalCount,
      icon: Bell,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      title: "الإشعارات المفعلة",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "إجمالي المشاهدات",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "إجمالي النقرات (CTR)",
      value: `${totalClicks} (${ctr}%)`,
      icon: MousePointerClick,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-on-surface-variant font-medium mb-1">
                {card.title}
              </p>
              <h3 className="text-xl font-black text-on-surface">
                {card.value}
              </h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.bg}`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
