"use client";

import React from "react";
import Link from "next/link";
import { Link2, Palette, BarChart3, Settings, Shield, Globe, ExternalLink, Nfc, LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/dashboard", label: "الروابط", icon: Link2, exact: true },
  { href: "/dashboard/appearance", label: "المظهر", icon: Palette },
  { href: "/dashboard/nfc-card", label: "بطاقة NFC", icon: Nfc },
  { href: "/dashboard/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export function resolveDashboardPageTitle(pathname: string): string {
  const match =
    DASHBOARD_NAV_ITEMS.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    ) || DASHBOARD_NAV_ITEMS[0];
  return match.label;
}

export interface DashboardSidebarNavProps {
  currentPath: string;
  isCollapsedView: boolean;
  onCloseMobile?: () => void;
  isAdmin?: boolean;
  username?: string;
}

export function DashboardSidebarNav({
  currentPath,
  isCollapsedView,
  onCloseMobile,
  isAdmin = false,
  username,
}: DashboardSidebarNavProps) {
  const getLinkClass = (active: boolean) =>
    `flex items-center rounded-xl text-xs font-medium transition-all ${
      isCollapsedView ? "w-12 h-10 mx-auto justify-center px-0" : "gap-2.5 px-3 py-2.5"
    } ${
      active
        ? "bg-primary-container text-on-primary-container shadow-sm font-bold"
        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
    }`;

  return (
    <>
      <nav aria-label="قائمة لوحة التحكم الجانبية" className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {!isCollapsedView && (
          <div className="px-3 py-1.5 text-[10px] font-bold text-outline uppercase tracking-wider">
            إدارة صفحتي
          </div>
        )}
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? currentPath === item.href
            : currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={getLinkClass(isActive)}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsedView && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`${isCollapsedView ? "p-2" : "p-3"} border-t border-outline-variant/15 space-y-1`}>
        {!isCollapsedView && (
          <div className="px-3 py-1 text-[10px] font-bold text-outline uppercase tracking-wider">
            روابط سريعة
          </div>
        )}
        {username && (
          <Link
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCloseMobile}
            title="معاينة صفحتي العامة"
            aria-label="معاينة صفحتي العامة"
            className={getLinkClass(false)}
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-primary" />
            {!isCollapsedView && <span>معاينة صفحتي</span>}
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onCloseMobile}
            title="لوحة مدير النظام"
            aria-label="لوحة مدير النظام"
            className={getLinkClass(false)}
          >
            <Shield className="w-4 h-4 shrink-0 text-amber-400" />
            {!isCollapsedView && <span>لوحة مدير النظام</span>}
          </Link>
        )}
        <Link
          href="/"
          onClick={onCloseMobile}
          title="الموقع الرئيسي"
          aria-label="الموقع الرئيسي"
          className={getLinkClass(false)}
        >
          <Globe className="w-4 h-4 shrink-0 text-secondary" />
          {!isCollapsedView && <span>الموقع الرئيسي</span>}
        </Link>
      </div>
    </>
  );
}
