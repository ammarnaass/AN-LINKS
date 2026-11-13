"use client";

import React, { useState } from "react";
import { Lock, Check, AlertTriangle, Laptop, Smartphone } from "lucide-react";
import { validatePasswordChange } from "../validators/settings.validator";

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
        <h3 className="font-bold text-on-surface text-base">الجلسات النشطة والأجهزة المتصلة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-bold text-xs text-on-surface">متصفح Chrome على Linux / Desktop</h4>
                <p className="text-[11px] text-on-surface-variant font-mono">الرياض، السعودية • نشط الآن</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
              الجلسة الحالية
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-tertiary" />
              <div>
                <h4 className="font-bold text-xs text-on-surface">متصفح Safari على iPhone 15 Pro</h4>
                <p className="text-[11px] text-on-surface-variant font-mono">الرياض، السعودية • قبل ساعتين</p>
              </div>
            </div>
            <span className="text-[11px] text-on-surface-variant font-semibold">متصل</span>
          </div>
        </div>
      </div>
    </section>
  );
}

