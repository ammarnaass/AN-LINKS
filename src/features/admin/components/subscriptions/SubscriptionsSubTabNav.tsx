"use client";

import React from "react";
import { Package, Sliders, Tag } from "lucide-react";

export type SubscriptionSubTab = "plans" | "quotas" | "coupons";

export interface SubscriptionsSubTabNavProps {
  activeSubTab: SubscriptionSubTab;
  setActiveSubTab: (tab: SubscriptionSubTab) => void;
  totalPlans?: number;
  activeCoupons?: number;
}

export function SubscriptionsSubTabNav({
  activeSubTab,
  setActiveSubTab,
  totalPlans = 0,
  activeCoupons = 0,
}: SubscriptionsSubTabNavProps) {
  const tabs = [
    {
      key: "plans" as const,
      label: "باقات الاشتراك والأسعار",
      icon: <Package className="w-4 h-4 shrink-0" />,
      badge: totalPlans > 0 ? totalPlans : undefined,
    },
    {
      key: "quotas" as const,
      label: "المحددات والصلاحيات (Quotas)",
      icon: <Sliders className="w-4 h-4 shrink-0" />,
    },
    {
      key: "coupons" as const,
      label: "كوبونات وقسائم الخصم",
      icon: <Tag className="w-4 h-4 shrink-0" />,
      badge: activeCoupons > 0 ? activeCoupons : undefined,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="تبويبات نظام الاشتراكات"
      className="w-full flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto no-scrollbar font-cairo"
      dir="rtl"
    >
      {tabs.map((tab) => {
        const isActive = activeSubTab === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isActive
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
