"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield } from "lucide-react";
import { ThemeToggle, BrandLogo } from "@/shared/ui";
import { UserNavDropdown, useCurrentUser } from "@/features/auth";
import { PreviewProvider } from "../context/PreviewContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { resolveDashboardPageTitle } from "./DashboardSidebarNav";
import { DashboardPlanBadge } from "./DashboardPlanBadge";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/dashboard";
  const { isAdmin, user } = useCurrentUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const pageTitle = resolveDashboardPageTitle(pathname);

  return (
    <div className="min-h-screen bg-surface text-on-surface flex font-cairo" dir="rtl">
      <DashboardSidebar
        currentPath={pathname}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isAdmin={isAdmin}
        username={user?.username}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="فتح القائمة الجانبية"
              className="lg:hidden p-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="lg:hidden">
              <BrandLogo href="/dashboard" variant="minimal" size="sm" />
            </div>

            <div className="hidden lg:flex items-center gap-2 min-w-0">
              <h1 className="font-black text-base text-on-surface truncate">{pageTitle}</h1>
              <span className="text-xs text-on-surface-variant">• لوحة صانع المحتوى</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full sm:rounded-2xl bg-error-container/25 hover:bg-error-container/40 border border-error/30 text-error text-xs font-bold transition-all shadow-xs"
                title="الانتقال إلى لوحة تحكم مدير النظام"
              >
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">لوحة الإدارة</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-error/20 font-mono">ADMIN</span>
              </Link>
            )}
            <DashboardPlanBadge />
            <ThemeToggle />
            <UserNavDropdown />
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
          <PreviewProvider>{children}</PreviewProvider>
        </main>
      </div>
    </div>
  );
}
