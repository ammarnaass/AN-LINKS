"use client";

import React from "react";
import { Users, UserCheck, UserX, Calendar } from "lucide-react";
import { NewsletterStats } from "../types/newsletter.types";

interface NewsletterStatsCardsProps {
  stats: NewsletterStats;
}

export function NewsletterStatsCards({ stats }: NewsletterStatsCardsProps) {
  const cards = [
    {
      title: "إجمالي المشتركين",
      value: stats.total,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "المشتركون النشطون",
      value: stats.active,
      icon: UserCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "إلغاء الاشتراك",
      value: stats.unsubscribed,
      icon: UserX,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "المسجلون هذا الشهر",
      value: stats.thisMonth,
      icon: Calendar,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-surface-container-low border ${card.border} transition hover:bg-surface-container`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-on-surface-variant truncate">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-black text-on-surface">
              {card.value.toLocaleString("ar-SA")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
