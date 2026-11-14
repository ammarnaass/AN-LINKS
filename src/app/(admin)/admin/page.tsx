"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Link2, Shield, Search, RefreshCw, AlertCircle } from "lucide-react";
import { ThemeToggle, AppCard, AppInput, AppButton } from "@/shared/ui";
import { UserNavDropdown } from "@/features/auth";
import {
  AdminUserItem,
  AdminReportItem,
  AdminStatCards,
  AdminUsersTable,
  AdminReportsTable,
} from "@/features/admin";

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<"users" | "reports">("users");
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersRes, reportsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/reports"),
      ]);

      if (usersRes.status === 401 || usersRes.status === 403) {
        setError("غير مصرح لك بالوصول إلى لوحة المشغّل. يرجى تسجيل الدخول بحساب مدير.");
        setIsLoading(false);
        return;
      }

      const usersData = await usersRes.json();
      const reportsData = await reportsRes.json();

      if (usersData.success) setUsers(usersData.users || []);
      if (reportsData.success) setReports(reportsData.reports || []);
    } catch {
      setError("فشل في تحميل بيانات لوحة المشغل");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => !u.isSuspended).length,
    suspendedUsers: users.filter((u) => u.isSuspended).length,
    pendingReports: reports.filter((r) => r.status === "PENDING").length,
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-cairo flex flex-col" dir="rtl">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-on-surface">لوحة المشغّل | روابط</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs text-primary hover:underline hidden sm:inline">
            العودة للوحة العميل
          </Link>
          <ThemeToggle />
          <UserNavDropdown />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-on-surface">إدارة المنصة والمشغل</h1>
            <p className="text-xs text-on-surface-variant">
              استعراض الحسابات المسجلة، إيقاف المخالفين، ومتابعة بلاغات الانتهاك (ADM-1, ADM-3)
            </p>
          </div>
          <AppButton variant="outline" size="sm" onClick={fetchData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            تحديث
          </AppButton>
        </div>

        {error ? (
          <div className="p-6 rounded-2xl bg-error-container/20 border border-error/30 text-error flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <>
            <AdminStatCards stats={stats} />

            {/* Tab Navigation & Search Bar */}
            <AppCard className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "users" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    الحسابات ({users.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "reports" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    البلاغات ({reports.filter((r) => r.status === "PENDING").length} معلق)
                  </button>
                </div>

                {activeTab === "users" && (
                  <div className="w-full sm:w-72">
                    <AppInput
                      placeholder="بحث بالاسم أو البريد..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      startAdornment={<Search className="w-4 h-4" />}
                    />
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-sm text-outline">جاري تحميل البيانات...</div>
              ) : activeTab === "users" ? (
                <AdminUsersTable
                  users={filteredUsers}
                  onToggleSuspend={handleToggleSuspend}
                  isUpdatingId={updatingId}
                />
              ) : (
                <AdminReportsTable
                  reports={reports}
                  onUpdateStatus={handleUpdateReport}
                  isUpdatingId={updatingId}
                />
              )}
            </AppCard>
          </>
        )}
      </main>
    </div>
  );
}

