"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Palette, BarChart3, ShieldCheck } from "lucide-react";
import { useCurrentUser } from "@/features/auth";
import { DashboardPlanBadge } from "@/features/dashboard";

export interface BioOwnerBarProps {
  username: string;
}

export function BioOwnerBar({ username }: BioOwnerBarProps) {
  const { isAuthenticated, isOwner } = useCurrentUser();

  // Only render if current session belongs to this profile owner
  if (!isAuthenticated || !isOwner(username)) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="شريط تحكم مالك الصفحة"
      className="sticky top-0 z-50 w-full bg-surface-container-lowest/90 backdrop-blur-xl border-b border-primary/25 px-3 sm:px-6 py-2 shadow-sm font-cairo transition-all"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 text-primary font-bold">
          <ShieldCheck className="w-4 h-4 shrink-0 text-primary animate-pulse" />
          <span className="hidden sm:inline">أنت تتصفح صفحتك الشخصية كصانع محتوى</span>
          <span className="sm:hidden font-bold">صفحتك الشخصية</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <DashboardPlanBadge />

          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary text-on-primary font-bold hover:brightness-110 transition-all text-[11px] shadow-xs"
            title="الانتقال إلى لوحة التحكم الرئيسية"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/dashboard/appearance"
            className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold transition-all text-[11px]"
            title="تعديل ألوان وثيمات الصفحة"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>المظهر</span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold transition-all text-[11px]"
            title="عرض إحصائيات الزيارات والنقرات"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>التحليلات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
