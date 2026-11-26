"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
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
