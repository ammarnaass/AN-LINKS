"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModalProps } from "../types/landing.types";

function AuthModalHeader({ mode, onClose }: { mode: string; onClose: () => void }) {
  const getTitle = () => {
    if (mode === "login") return "تسجيل الدخول إلى حسابك";
    if (mode === "signup") return "إنشاء حساب جديد مجاناً";
    return "الدخول السريع للوحة التحكم";
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface">{getTitle()}</h3>
          <p className="text-xs text-on-surface-variant">منصة روابط لإدارة روابطك الاحترافية</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  );
}

function AuthModalButtons({
  onAction,
}: {
  onAction: (target: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => onAction("/dashboard")}
        className="w-full py-3.5 px-4 bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">dashboard</span>
        <span>المتابعة إلى لوحة التحكم فوراً</span>
      </button>
      <button
        onClick={() => onAction("/login")}
        className="w-full py-3.5 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface font-medium text-sm rounded-xl border border-surface-container-highest transition-colors flex items-center justify-center gap-2 cursor-pointer"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px] text-tertiary">account_circle</span>
        <span>تسجيل الدخول بحساب Google</span>
      </button>
    </div>
  );
}

export function AuthModal({ isOpen, onClose, mode, claimHandle }: AuthModalProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleAction = (target: string) => {
    setToastMsg("مرحباً بك! جارٍ الانتقال إلى لوحة التحكم والروابط...");
    setTimeout(() => {
      setToastMsg(null);
      onClose();
      router.push(target);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-surface-container-high rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-surface-container-highest flex flex-col gap-6">
        <AuthModalHeader mode={mode} onClose={onClose} />

        {claimHandle && (
          <div className="p-3.5 rounded-xl bg-primary-container/15 border border-primary-container/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <span className="text-xs text-primary font-bold">
              تم حجز الرابط rawabet.me/{claimHandle} لك بنجاح!
            </span>
          </div>
        )}

        <AuthModalButtons onAction={handleAction} />

        <div className="flex items-center justify-center gap-2 text-center text-outline text-xs">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span>اتصال مشفر وآمن 100% وفق معايير الخصوصية</span>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-surface-container-high/95 text-on-surface shadow-[0_16px_32px_rgba(0,0,0,0.6)] border border-primary-container/40 backdrop-blur-xl">
          <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

