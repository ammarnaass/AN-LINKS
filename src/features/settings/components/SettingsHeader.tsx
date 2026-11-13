"use client";

import React from "react";
import { Check } from "lucide-react";

interface SettingsHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  savedSuccess: boolean;
}

export function SettingsHeader({ onSave, isSaving, savedSuccess }: SettingsHeaderProps) {
  return (
    <section className="relative bg-surface-container-low rounded-2xl p-6 lg:p-8 overflow-hidden shadow-xl border border-outline-variant/30">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
              لوحة الإدارة المتقدمة
            </span>
            <span className="text-on-surface-variant text-xs font-mono">• تشفير عالي الكفاءة بمستوى بنكي</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            إعدادات الحساب والأمان والاشتراك
          </h1>
          <p className="text-xs lg:text-sm text-on-surface-variant">
            إدارة بياناتك الشخصية، بوابات الدفع لتحصيل الأرباح، خطة الاشتراك، وإجراءات أمان الدخول والمصادقة المتقدمة.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-[0_0_24px_rgba(78,222,163,0.35)] hover:bg-primary-fixed transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم حفظ التغييرات</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{isSaving ? "جاري الحفظ..." : "حفظ كافة التغييرات"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
