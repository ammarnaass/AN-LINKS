"use client";

import React from "react";
import { AppButton, AppBadge } from "@/shared/ui";
import { Check, Save, Smartphone } from "lucide-react";

export interface AppearanceHeaderProps {
  username?: string;
  lastAutoSaved: string | null;
  isSaving: boolean;
  savedSuccess: boolean;
  onManualSave: () => void;
  onToggleMobilePreview: () => void;
}

export function AppearanceHeader({
  username,
  lastAutoSaved,
  isSaving,
  savedSuccess,
  onManualSave,
  onToggleMobilePreview,
}: AppearanceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <AppBadge variant="primary" dot size="sm">استوديو المظهر الحي</AppBadge>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant font-mono">@{username}</span>
          {lastAutoSaved && <span className="text-[11px] text-primary/80 mr-2">{lastAutoSaved}</span>}
        </div>
        <h1 className="text-2xl font-black text-on-surface tracking-tight">تخصيص المظهر والهوية</h1>
        <p className="text-xs text-on-surface-variant">
          تحكم بكافة التفاصيل البصرية لصفحتك الشخصية وشاهد انعكاسها الفوري في مجسم الهاتف الذكي.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobilePreview}
          className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-semibold shadow-sm hover:bg-surface-container"
        >
          <Smartphone className="w-4 h-4 text-primary" />
          <span>معاينة الهاتف</span>
        </button>

        <AppButton
          variant="primary"
          size="md"
          isLoading={isSaving}
          onClick={onManualSave}
          rightIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? "تم الحفظ بنجاح!" : isSaving ? "جاري الحفظ..." : "حفظ المظهر ونشره"}
        </AppButton>
      </div>
    </div>
  );
}
