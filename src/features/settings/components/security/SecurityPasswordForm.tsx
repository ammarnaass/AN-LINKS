"use client";

import React from "react";
import { Lock } from "lucide-react";

interface SecurityPasswordFormProps {
  passwordState: {
    currentPassword: "";
    newPassword: "";
    confirmPassword: "";
  };
  setPasswordState: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
}

export function SecurityPasswordForm({
  passwordState,
  setPasswordState,
  onSubmit,
  isSubmitting,
  statusMessage,
}: SecurityPasswordFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30 flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-base">تغيير كلمة المرور</h3>
            <p className="text-xs text-on-surface-variant">قم بتحديث كلمة المرور بانتظام لحماية حسابك</p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-2.5 rounded-xl text-xs font-semibold ${
              statusMessage.type === "success"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-error/10 text-error border border-error/20"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <div className="space-y-2">
          <input
            type="password"
            placeholder="كلمة المرور الحالية"
            value={passwordState.currentPassword}
            onChange={(e) => setPasswordState((p) => ({ ...p, currentPassword: e.target.value }))}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور الجديدة (8 أحرف كحد أدنى)"
            value={passwordState.newPassword}
            onChange={(e) => setPasswordState((p) => ({ ...p, newPassword: e.target.value }))}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <input
            type="password"
            placeholder="تأكيد كلمة المرور الجديدة"
            value={passwordState.confirmPassword}
            onChange={(e) => setPasswordState((p) => ({ ...p, confirmPassword: e.target.value }))}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {isSubmitting ? "جاري التحديث..." : "حفظ كلمة المرور"}
        </button>
      </div>
    </form>
  );
}
