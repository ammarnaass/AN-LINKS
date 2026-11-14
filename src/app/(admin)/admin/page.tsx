"use client";

import React from "react";
import Link from "next/link";
import { Shield, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";
import { UserNavDropdown } from "@/features/auth";
import {
  AdminNavTabs,
  AdminAnalyticsTab,
  AdminUsersTab,
  AdminPaymentsTab,
  AdminSettingsTab,
  AdminReportsTab,
  DEFAULT_PLATFORM_SETTINGS,
} from "@/features/admin";
import { useAdminConsole } from "@/features/admin/hooks/useAdminConsole";
import { AdminSessionsTab } from "@/features/admin/components/AdminSessionsTab";

export default function AdminConsolePage() {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    analytics,
    users,
    sessions,
    settings,
    reports,
    handleToggleRole,
    handleToggleSuspend,
    handleSaveSettings,
    handleRevokeSession,
    handleUpdateReport,
    reload,
  } = useAdminConsole();

  const currentSettings = settings || DEFAULT_PLATFORM_SETTINGS;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-cairo" dir="rtl">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base leading-tight text-on-surface">
              لوحة المشغّل والمدير | Console
            </h1>
            <p className="text-[11px] text-on-surface-variant font-mono">
              إدارة المنصة، بوابات الدفع، الجلسات والرقابة
            </p>
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
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-xs font-bold px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition border border-outline-variant/30"
          >
            لوحة صانع المحتوى
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <AdminNavTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          usersCount={users.length}
          sessionsCount={sessions.length}
          pendingReportsCount={reports.filter((r) => r.status === "PENDING").length}
        />

        {activeTab === "analytics" && analytics && (
          <AdminAnalyticsTab data={analytics} />
        )}

        {activeTab === "users" && (
          <AdminUsersTab
            users={users}
            onToggleSuspend={handleToggleSuspend}
            onToggleRole={handleToggleRole}
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
  );
}
