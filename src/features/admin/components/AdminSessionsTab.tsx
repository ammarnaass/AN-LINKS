"use client";

import React, { useState } from "react";
import { AdminSessionDTO } from "@/features/auth/types/session.types";
import { AppBadge, AppButton, AppInput } from "@/shared/ui";
import { Laptop, Smartphone, Tablet, Search, Shield, ShieldAlert, LogOut, CheckCircle2 } from "lucide-react";

interface AdminSessionsTabProps {
  sessions: AdminSessionDTO[];
  onRevokeSession: (sessionId: string) => Promise<void>;
  isLoading?: boolean;
}

export function AdminSessionsTab({ sessions, onRevokeSession, isLoading }: AdminSessionsTabProps) {
  const [search, setSearch] = useState("");
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      s.userEmail.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      (s.ipAddress && s.ipAddress.includes(q)) ||
      s.browser.toLowerCase().includes(q) ||
      s.os.toLowerCase().includes(q)
    );
  });

  const handleRevoke = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في إنهاء هذه الجلسة قسراً؟")) return;
    setRevokingId(id);
    try {
      await onRevokeSession(id);
    } finally {
      setRevokingId(null);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === "mobile") return <Smartphone className="w-4 h-4 text-tertiary" />;
    if (deviceType === "tablet") return <Tablet className="w-4 h-4 text-secondary" />;
    return <Laptop className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div className="w-full sm:w-80">
          <AppInput
            placeholder="بحث بالبريد، اسم المستخدم أو IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={<Search className="w-4 h-4 text-on-surface-variant" />}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>إجمالي الجلسات النشطة: {filteredSessions.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/20 bg-surface-container-low shadow-xl">
        <table className="w-full text-right text-xs">
          <thead className="bg-surface-container-high/60 text-on-surface-variant font-bold border-b border-outline-variant/20">
            <tr>
              <th className="p-4">المستخدم</th>
              <th className="p-4">الرتبة</th>
              <th className="p-4">الجهاز والمتصفح</th>
              <th className="p-4">عنوان IP</th>
              <th className="p-4">آخر نشاط</th>
              <th className="p-4 text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-on-surface">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant animate-pulse">
                  جارٍ تحميل الجلسات النشطة...
                </td>
              </tr>
            ) : filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                  لا توجد جلسات نشطة مطابقة للبحث.
                </td>
              </tr>
            ) : (
              filteredSessions.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-on-surface">{s.userEmail}</div>
                    <div className="text-[11px] text-on-surface-variant font-mono">@{s.username}</div>
                  </td>
                  <td className="p-4">
                    <AppBadge variant={s.userRole === "ADMIN" ? "primary" : "neutral"} size="sm">
                      {s.userRole === "ADMIN" ? (
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" /> مدير
                        </span>
                      ) : (
                        "عميل"
                      )}
                    </AppBadge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(s.deviceType)}
                      <span>{s.browser} • {s.os}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-on-surface-variant">
                    {s.ipAddress || "127.0.0.1"}
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {new Date(s.lastActive).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-4 text-center">
                    <AppButton
                      variant="ghost"
                      size="sm"
                      isLoading={revokingId === s.id}
                      onClick={() => handleRevoke(s.id)}
                      className="text-error hover:bg-error-container/20"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-1" />
                      <span>إنهاء الجلسة</span>
                    </AppButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
