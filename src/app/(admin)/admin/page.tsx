"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, RefreshCw, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";
import { UserNavDropdown } from "@/features/auth";
import {
  AdminUserItem,
  AdminReportItem,
  AdminPlatformSettings,
  AdminAnalyticsData,
  AdminTabKey,
  AdminNavTabs,
  AdminAnalyticsTab,
  AdminUsersTab,
  AdminPaymentsTab,
  AdminSettingsTab,
  AdminReportsTab,
  DEFAULT_PLATFORM_SETTINGS,
} from "@/features/admin";

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<AdminTabKey>("analytics");
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [settings, setSettings] = useState<AdminPlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersRes, reportsRes, settingsRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/reports"),
        fetch("/api/admin/settings"),
        fetch("/api/admin/analytics"),
      ]);

      if ([usersRes, reportsRes, settingsRes, analyticsRes].some((r) => r.status === 401 || r.status === 403)) {
        setError("غير مصرح لك بالوصول إلى لوحة المشغّل. يرجى تسجيل الدخول بحساب مدير.");
        setIsLoading(false);
        return;
      }

      const [usersData, reportsData, settingsData, analyticsData] = await Promise.all([
        usersRes.json(),
        reportsRes.json(),
        settingsRes.json(),
        analyticsRes.json(),
      ]);

      if (usersData.success) setUsers(usersData.users || []);
      if (reportsData.success) setReports(reportsData.reports || []);
      if (settingsData.success) setSettings(settingsData.settings || DEFAULT_PLATFORM_SETTINGS);
      if (analyticsData.success) setAnalytics(analyticsData.analytics || null);
    } catch {
      setError("فشل في تحميل بيانات لوحة المشغل");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleToggleSuspend = async (userId: string, currentSuspended: boolean) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !currentSuspended }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isSuspended: !currentSuspended } : u))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setUpdatingId(userId);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateReport = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    setUpdatingId(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateSettings = async (partial: Partial<AdminPlatformSettings>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const pendingReportsCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-surface text-on-surface font-cairo flex flex-col" dir="rtl">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-error text-white flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base text-on-surface leading-tight">لوحة المشغّل المركزية</span>
              <span className="text-[10px] text-error font-mono font-bold">ADMIN ENTERPRISE SUITE</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAllData}
            disabled={isLoading}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
          </button>
          <Link href="/dashboard" className="text-xs text-primary hover:underline hidden sm:inline font-semibold">
            لوحة العميل
          </Link>
          <ThemeToggle />
          <UserNavDropdown />
        </div>
      </header>

      {/* Main Admin Console Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-error-container/20 border border-error/30 text-error flex items-center gap-3 text-xs font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 5 Admin Navigation Tabs */}
        <AdminNavTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          usersCount={users.length}
          pendingReportsCount={pendingReportsCount}
        />

        {/* Tab Content Display */}
        {isLoading && !analytics ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-on-surface-variant text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <span>جاري مزامنة بيانات لوحة المشغل...</span>
          </div>
        ) : (
          <div className="pt-2">
            {activeTab === "analytics" && analytics && (
              <AdminAnalyticsTab data={analytics} />
            )}
            {activeTab === "users" && (
              <AdminUsersTab
                users={users}
                onToggleSuspend={handleToggleSuspend}
                onToggleRole={handleToggleRole}
                isUpdatingId={updatingId}
              />
            )}
            {activeTab === "payments" && (
              <AdminPaymentsTab
                settings={settings}
                transactions={analytics?.recentTransactions || []}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
            {activeTab === "settings" && (
              <AdminSettingsTab
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
            {activeTab === "reports" && (
              <AdminReportsTab
                reports={reports}
                onUpdateStatus={handleUpdateReport}
                isUpdatingId={updatingId}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
