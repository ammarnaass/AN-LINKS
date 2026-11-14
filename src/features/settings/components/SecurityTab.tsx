"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Lock, Check, AlertTriangle, Laptop, Smartphone, Tablet, LogOut } from "lucide-react";
import { validatePasswordChange } from "../validators/settings.validator";
import { UserSessionDTO } from "@/features/auth/types/session.types";

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (!check.valid) {
      setPasswordMsg({ type: "error", text: check.error || "خطأ في البيانات" });
      return;
    }

    setPasswordMsg({ type: "success", text: "تم تحديث كلمة المرور بنجاح!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const [sessions, setSessions] = useState<UserSessionDTO[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    fetch("/api/auth/sessions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.sessions) setSessions(data.sessions);
      })
      .catch((err) => console.error("Fetch sessions error:", err))
      .finally(() => setIsLoadingSessions(false));
  }, []);

  const handleRevokeSession = async (s: UserSessionDTO) => {
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
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2FA Card */}
        <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">phonelink_lock</span>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-base">المصادقة الثنائية (2FA)</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  مفعلة بنجاح عبر TOTP
                </span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              حسابك محمي بتوليد رموز زمنية من خلال تطبيق المصادقة (Google Authenticator أو 1Password).
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-bright transition"
            >
              تجديد المفاتيح الاحتياطية
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <form
          onSubmit={handlePasswordSubmit}
          className="lg:col-span-6 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-on-surface text-base">تغيير كلمة المرور</h3>
          </div>

          {passwordMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.type === "success"
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-error-container/20 text-error border border-error/30"
              }`}
            >
              {passwordMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">كلمة المرور الحالية</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                dir="ltr"
                className="w-full bg-surface-container-lowest rounded-xl px-4 py-2 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                dir="ltr"
                placeholder="8 أحرف على الأقل"
                className="w-full bg-surface-container-lowest rounded-xl px-4 py-2 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">تأكيد كلمة المرور الجديدة</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                dir="ltr"
                className="w-full bg-surface-container-lowest rounded-xl px-4 py-2 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-fixed transition shadow-md"
          >
            تحديث كلمة المرور
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-on-surface text-base">الجلسات النشطة والأجهزة المتصلة</h3>
          <span className="text-xs text-on-surface-variant font-mono">
            {sessions.length} {sessions.length === 1 ? "جلسة نشطة" : "جلسات نشطة"}
          </span>
        </div>

        {isLoadingSessions ? (
          <div className="h-20 bg-surface-container rounded-xl animate-pulse" />
        ) : sessions.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4 text-center">لا توجد جلسات أخرى مسجلة حالياً.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sessions.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(s.deviceType)}
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">
                      {s.browser} على {s.os}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-mono">
                      {s.ipAddress ? `IP: ${s.ipAddress}` : "جلسة محلية"} • {new Date(s.lastActive).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {s.isCurrent ? (
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      الجلسة الحالية
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-error-container/30 hover:text-error text-[11px] font-semibold text-on-surface-variant transition flex items-center gap-1 cursor-pointer"
                      title="إنهاء الجلسة"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>إنهاء</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

