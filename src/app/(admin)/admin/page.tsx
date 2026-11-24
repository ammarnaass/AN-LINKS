"use client";

import React from "react";
import { RefreshCw, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";
import { UserNavDropdown } from "@/features/auth";
import {
  AdminTabKey,
  AdminSidebar,
  AdminAnalyticsTab,
  AdminUsersTab,
  AdminPaymentsTab,
  AdminSettingsTab,
  AdminReportsTab,
  AdminLinksContainer,
  DEFAULT_PLATFORM_SETTINGS,
} from "@/features/admin";
import { useAdminConsole } from "@/features/admin/hooks/useAdminConsole";
import { AdminSessionsTab } from "@/features/admin/components/AdminSessionsTab";
import { useAdminSidebar } from "@/features/admin/hooks/useAdminSidebar";
import { AdminSidebarPullHandle } from "@/features/admin/components/AdminSidebarPullHandle";

const TAB_TITLES: Record<AdminTabKey, string> = {
  analytics: "الإحصائيات والنمو والتحليلات",
  users: "إدارة المستخدمين والمشتركين",
  sessions: "الجلسات النشطة والأجهزة",
  payments: "طرق الدفع وبوابات الاشتراكات",
  links: "إدارة الروابط والمنصات وحوكمة المحتوى",
  settings: "إعدادات المنصة والسياسات",
  reports: "مركز البلاغات والاعتدال",
};

export default function AdminConsolePage() {
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    openMobile,
    closeMobile,
  } = useAdminSidebar();

  const {
    activeTab,
    setActiveTab,
    isLoading,
    analytics,
    users,
    sessions,
    settings,
    reports,
    linksCount,
    handleToggleRole,
    handleToggleSuspend,
    handleUpdateUserLocation,
    handleSaveSettings,
    handleRevokeSession,
    handleUpdateReport,
    reload,
  } = useAdminConsole();

  const currentSettings = settings || DEFAULT_PLATFORM_SETTINGS;
  const pendingReportsCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex font-cairo" dir="rtl">
      {/* Right Sidebar (Desktop & Mobile Drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        usersCount={users.length}
        sessionsCount={sessions.length}
        pendingReportsCount={pendingReportsCount}
        linksCount={linksCount}
        isOpenMobile={isMobileOpen}
        onCloseMobile={closeMobile}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Mobile Edge Pull Handle */}
      <AdminSidebarPullHandle
        isOpen={isMobileOpen}
        onOpen={openMobile}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-20 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              type="button"
              onClick={openMobile}
              className="lg:hidden p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition cursor-pointer"
              title="فتح القائمة الجانبية"
              aria-label="فتح القائمة الجانبية"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition cursor-pointer"
              title={isCollapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
              aria-label={isCollapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
            >
              {isCollapsed ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>

            <div>
              <span className="text-xs text-on-surface-variant font-medium">لوحة المشغّل والمدير &gt; </span>
              <h1 className="inline-block font-black text-sm sm:text-base text-on-surface">
                {TAB_TITLES[activeTab]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reload}
              disabled={isLoading}
              className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface-variant transition cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <ThemeToggle />
            <UserNavDropdown />
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
          {activeTab === "analytics" && analytics && (
            <AdminAnalyticsTab data={analytics} />
          )}

          {activeTab === "users" && (
            <AdminUsersTab
              users={users}
              onToggleSuspend={handleToggleSuspend}
              onToggleRole={handleToggleRole}
              onUpdateLocation={handleUpdateUserLocation}
            />
          )}

          {activeTab === "sessions" && (
            <AdminSessionsTab
              sessions={sessions}
              onRevokeSession={handleRevokeSession}
              isLoading={isLoading}
            />
          )}

          {activeTab === "payments" && (
            <AdminPaymentsTab
              settings={currentSettings}
              transactions={analytics?.recentTransactions || []}
              onUpdateSettings={handleSaveSettings}
            />
          )}

          {activeTab === "links" && <AdminLinksContainer />}

          {activeTab === "settings" && (
            <AdminSettingsTab
              settings={currentSettings}
              onUpdateSettings={handleSaveSettings}
            />
          )}

          {activeTab === "reports" && (
            <AdminReportsTab
              reports={reports}
              onUpdateStatus={handleUpdateReport}
            />
          )}
        </main>
      </div>
    </div>
  );
}
