"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Laptop, Smartphone, Tablet, LogOut } from "lucide-react";
import { UserSessionDTO } from "@/features/auth/types/session.types";

export function SecuritySessionsList() {
  const [sessions, setSessions] = useState<UserSessionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/sessions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.sessions) setSessions(data.sessions);
      })
      .catch((err) => console.error("Fetch sessions error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleRevoke = async (s: UserSessionDTO) => {
    if (s.isCurrent) {
      if (confirm("هل تريد تسجيل الخروج من جلستك الحالية؟")) {
        signOut({ callbackUrl: "/login" });
      }
      return;
    }
    try {
      const res = await fetch(`/api/auth/sessions/${s.id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((item) => item.id !== s.id));
      }
    } catch (err) {
      console.error("Revoke session error:", err);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === "mobile") return <Smartphone className="w-5 h-5 text-tertiary" />;
    if (deviceType === "tablet") return <Tablet className="w-5 h-5 text-secondary" />;
    return <Laptop className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <h3 className="font-bold text-on-surface text-base">الجلسات والأجهزة النشطة</h3>
          <p className="text-xs text-on-surface-variant">إدارة الأجهزة المسجل دخولها حالياً لحسابك</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-on-surface-variant">جاري تحميل الجلسات...</div>
      ) : sessions.length === 0 ? (
        <div className="py-6 text-center text-xs text-on-surface-variant">لا توجد جلسات أخرى مسجلة</div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-surface-container-high">{getDeviceIcon(s.deviceType)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">
                      {s.browser} • {s.os}
                    </span>
                    {s.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                        الجلسة الحالية
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {s.ipAddress || "127.0.0.1"} • آخر نشاط: {new Date(s.lastActive).toLocaleString("ar-SA")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRevoke(s)}
                className="p-2 rounded-lg text-error hover:bg-error/10 transition"
                title={s.isCurrent ? "تسجيل الخروج" : "إنهاء الجلسة"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
