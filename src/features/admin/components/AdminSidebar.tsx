"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  BarChart3,
  Users,
  ShieldCheck,
  CreditCard,
  Settings,
  AlertTriangle,
  LayoutDashboard,
  Globe,
  X,
} from "lucide-react";
import { AdminTabKey } from "./AdminNavTabs";

export interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onTabChange: (tab: AdminTabKey) => void;
  usersCount?: number;
  sessionsCount?: number;
  pendingReportsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  usersCount = 0,
  sessionsCount = 0,
  pendingReportsCount = 0,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const navItems: Array<{
    key: AdminTabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      key: "analytics",
      label: "الإحصائيات والنمو",
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
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
      key: "payments",
      label: "طرق الدفع والاشتراكات",
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
    },
    {
      key: "settings",
      label: "إعدادات المنصة",
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
    {
      key: "reports",
      label: "البلاغات والاعتدال",
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
      badge: pendingReportsCount > 0 ? pendingReportsCount : undefined,
      badgeColor: "bg-error text-white font-bold",
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-surface-container-lowest border-l border-outline-variant/20 font-cairo" dir="rtl">
      {/* Brand Header */}
      <div className="p-5 border-b border-outline-variant/15 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm text-on-surface tracking-tight">روابط | AN LINKS</span>
            <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-wider">
              Console المشغّل والمدير
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-outline uppercase tracking-wider">
          إدارة النظام
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onTabChange(item.key);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    item.badgeColor || (isActive ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant")
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation Switcher */}
      <div className="p-3 border-t border-outline-variant/15 space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">
          التنقل السريع
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0 text-primary" />
          <span>لوحة صانع المحتوى</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
        >
          <Globe className="w-4 h-4 shrink-0 text-secondary" />
          <span>الموقع الرئيسي</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden font-cairo" dir="rtl">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-surface-container-lowest shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
