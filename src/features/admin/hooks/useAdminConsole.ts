"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminTabKey } from "../components/AdminNavTabs";
import {
  AdminAnalyticsData,
  AdminPlatformSettings,
  AdminReportItem,
  AdminUserItem,
} from "../types/admin.types";
import { AdminSessionDTO } from "@/features/auth/types/session.types";

export function useAdminConsole() {
  const [activeTab, setActiveTab] = useState<AdminTabKey>("analytics");
  const [isLoading, setIsLoading] = useState(true);

  const [analytics, setAnalytics] = useState<AdminAnalyticsData | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [sessions, setSessions] = useState<AdminSessionDTO[]>([]);
  const [settings, setSettings] = useState<AdminPlatformSettings | null>(null);
  const [reports, setReports] = useState<AdminReportItem[]>([]);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [anRes, uRes, sRes, setRes, rRes] = await Promise.all([
        fetch("/api/admin/analytics").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/admin/users").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/admin/sessions").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/admin/settings").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/admin/reports").then((r) => (r.ok ? r.json() : null)),
      ]);

      if (anRes?.analytics) setAnalytics(anRes.analytics);
      if (uRes?.users) setUsers(uRes.users);
      if (sRes?.sessions) setSessions(sRes.sessions);
      if (setRes?.settings) setSettings(setRes.settings);
      if (rRes?.reports) setReports(rRes.reports);
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole: "ADMIN" | "USER" = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل تعديل الرتبة");
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  };

  const handleToggleSuspend = async (userId: string, currentSuspended: boolean) => {
    const newSuspended = !currentSuspended;
    const res = await fetch(`/api/admin/users/${userId}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isSuspended: newSuspended }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل تعديل حالة الحساب");
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isSuspended: newSuspended } : u)));
  };

  const handleSaveSettings = async (partial: Partial<AdminPlatformSettings>): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data?.settings) setSettings(data.settings);
      return true;
    } catch {
      return false;
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    const res = await fetch(`/api/admin/sessions/${sessionId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("فشل إنهاء الجلسة");
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleUpdateReport = async (reportId: string, status: "RESOLVED" | "DISMISSED") => {
    const res = await fetch(`/api/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("فشل معالجة البلاغ");
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
  };

  return {
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
    reload: loadAllData,
  };
}
