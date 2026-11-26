"use client";

import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShieldCheck,
  Package,
  CreditCard,
  Settings,
  AlertTriangle,
  Link2,
  Sliders,
  Coins,
  Tag,
  Receipt,
  KeyRound,
  Bell,
} from "lucide-react";
import { AdminTabKey } from "../AdminNavTabs";

export interface AdminSidebarNavListProps {
  activeTab: AdminTabKey;
  onTabChange: (tab: AdminTabKey) => void;
  isCollapsedView: boolean;
  onCloseMobile?: () => void;
  usersCount?: number;
  sessionsCount?: number;
  pendingReportsCount?: number;
  linksCount?: number;
  plansCount?: number;
}

interface NavItemConfig {
  key: AdminTabKey;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  badgeColor?: string;
  matches?: AdminTabKey[];
}

export function AdminSidebarNavList({
  activeTab,
  onTabChange,
  isCollapsedView,
  onCloseMobile,
  usersCount = 0,
  sessionsCount = 0,
  pendingReportsCount = 0,
  linksCount = 0,
  plansCount = 0,
}: AdminSidebarNavListProps) {
  const systemItems: NavItemConfig[] = [
    { key: "analytics", label: "لوحة التحكم الرئيسية (الإحصائيات والنمو)", icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { key: "users", label: "المستخدمين", icon: <Users className="w-4 h-4 shrink-0" />, badge: usersCount > 0 ? usersCount : undefined },
    { key: "sessions", label: "الجلسات النشطة", icon: <ShieldCheck className="w-4 h-4 shrink-0" />, badge: sessionsCount > 0 ? sessionsCount : undefined },
    { key: "links", label: "إدارة الروابط والمنصات", icon: <Link2 className="w-4 h-4 shrink-0" />, badge: linksCount > 0 ? linksCount : undefined },
    { key: "settings", label: "إعدادات المنصة", icon: <Settings className="w-4 h-4 shrink-0" /> },
    { key: "auth_providers", label: "إعدادات الدخول (OAuth)", icon: <KeyRound className="w-4 h-4 shrink-0" /> },
    { key: "notifications", label: "نظام الإشعارات", icon: <Bell className="w-4 h-4 shrink-0" /> },
    { key: "reports", label: "البلاغات والاعتدال", icon: <AlertTriangle className="w-4 h-4 shrink-0" />, badge: pendingReportsCount > 0 ? pendingReportsCount : undefined, badgeColor: "bg-error text-white font-bold" },
  ];

  const financialItems: NavItemConfig[] = [
    { key: "gateways", label: "بوابات الدفع", icon: <CreditCard className="w-4 h-4 shrink-0" /> },
    { key: "subscriptions", label: "خطط وباقات الاشتراكات", icon: <Package className="w-4 h-4 shrink-0" />, badge: plansCount > 0 ? plansCount : undefined, matches: ["subscriptions", "plans"] },
    { key: "quotas", label: "الصلاحيات والمحددات", icon: <Sliders className="w-4 h-4 shrink-0" /> },
    { key: "currencies", label: "العملات وأسعار الصرف", icon: <Coins className="w-4 h-4 shrink-0" /> },
    { key: "coupons", label: "أكواد وقسائم الخصم", icon: <Tag className="w-4 h-4 shrink-0" /> },
    { key: "payments", label: "العمليات المالية والفواتير", icon: <Receipt className="w-4 h-4 shrink-0" />, matches: ["payments", "transactions"] },
  ];

  const renderSection = (title: string, items: NavItemConfig[]) => (
    <div className="space-y-1">
      {isCollapsedView ? (
        <div className="my-2 border-t border-outline-variant/15" aria-hidden="true" />
      ) : (
        <div className="px-3 py-1.5 text-[10px] font-bold text-outline uppercase tracking-wider">
          {title}
        </div>
      )}
      {items.map((item) => {
        const isActive = activeTab === item.key || (item.matches && item.matches.includes(activeTab));
        const btnClass = `flex items-center rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
          isCollapsedView ? "w-12 h-12 mx-auto justify-center px-0 relative" : "w-full justify-between px-3.5 py-2.5"
        } ${isActive ? "bg-primary-container text-on-primary-container shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"}`;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              onTabChange(item.key);
              if (onCloseMobile) onCloseMobile();
            }}
            title={item.label}
            aria-label={item.label}
            className={btnClass}
          >
            <div className={`flex items-center ${isCollapsedView ? "justify-center" : "gap-3"}`}>
              {item.icon}
              {!isCollapsedView && <span>{item.label}</span>}
            </div>
            {item.badge !== undefined &&
              (isCollapsedView ? (
                <span className={`absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${item.badgeColor || "bg-primary text-on-primary"}`}>
                  {item.badge}
                </span>
              ) : (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${item.badgeColor || (isActive ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")}`}>
                  {item.badge}
                </span>
              ))}
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className={`flex-1 ${isCollapsedView ? "p-2" : "p-3"} space-y-3 overflow-y-auto`}>
      {renderSection("إدارة النظام", systemItems)}
      {renderSection("المنظومة المالية والاشتراكات", financialItems)}
    </nav>
  );
}
