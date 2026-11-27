"use client";

import React from "react";
import { LayoutDashboard, BarChart3, Users, CreditCard, Settings, AlertTriangle, ShieldCheck, Link2, Package, KeyRound, Bell, Mail, Calendar } from "lucide-react";
import { AdminTabKey } from "../types/admin.types";

export type { AdminTabKey };

export interface AdminNavTabsProps {
  activeTab: AdminTabKey;
  onTabChange: (tab: AdminTabKey) => void;
  usersCount?: number;
  sessionsCount?: number;
  pendingReportsCount?: number;
  linksCount?: number;
  plansCount?: number;
}

export function AdminNavTabs({
  activeTab,
  onTabChange,
  usersCount = 0,
  sessionsCount = 0,
  pendingReportsCount = 0,
  linksCount = 0,
  plansCount = 0,
}: AdminNavTabsProps) {
  const tabs: Array<{
    key: AdminTabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      key: "analytics",
      label: "لوحة التحكم الرئيسية (الإحصائيات والنمو)",
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      key: "users",
      label: "المستخدمين",
      icon: <Users className="w-4 h-4 shrink-0" />,
      badge: usersCount > 0 ? usersCount : undefined,
    },
    {
      key: "sessions",
      label: "الجلسات النشطة",
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
      badge: sessionsCount > 0 ? sessionsCount : undefined,
    },
    {
      key: "subscriptions",
      label: "خطط وباقات الاشتراكات",
      icon: <Package className="w-4 h-4 shrink-0" />,
      badge: plansCount > 0 ? plansCount : undefined,
    },
    {
      key: "payments",
      label: "العمليات المالية والفواتير",
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
    },
    {
      key: "bookings",
      label: "الحجوزات والمواعيد",
      icon: <Calendar className="w-4 h-4 shrink-0" />,
    },
    {
      key: "links",
      label: "إدارة الروابط والمنصات",
      icon: <Link2 className="w-4 h-4 shrink-0" />,
      badge: linksCount > 0 ? linksCount : undefined,
    },
    {
      key: "settings",
      label: "إعدادات المنصة",
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
    {
      key: "auth_providers",
      label: "إعدادات الدخول (OAuth)",
      icon: <KeyRound className="w-4 h-4 shrink-0" />,
    },
    {
      key: "notifications",
      label: "نظام الإشعارات",
      icon: <Bell className="w-4 h-4 shrink-0" />,
    },
    {
      key: "newsletter",
      label: "النشرة البريدية",
      icon: <Mail className="w-4 h-4 shrink-0" />,
    },
    {
      key: "reports",
      label: "البلاغات والاعتدال",
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
      badgeColor: "bg-error text-white",
    },
  ];

  const isTabActive = (key: AdminTabKey) => {
    if (activeTab === key) return true;
    if (key === "subscriptions" && (activeTab === "plans" || activeTab === "quotas" || activeTab === "coupons")) return true;
    if (key === "payments" && (activeTab === "gateways" || activeTab === "currencies" || activeTab === "transactions")) return true;
    return false;
  };

  return (
    <div className="w-full flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto no-scrollbar font-cairo" dir="rtl">
      {tabs.map((t) => {
        const isActive = isTabActive(t.key);
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onTabChange(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-primary-container text-on-primary-container shadow-md"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  t.badgeColor || (isActive ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
