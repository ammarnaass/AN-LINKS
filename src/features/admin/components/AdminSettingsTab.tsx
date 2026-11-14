"use client";

import React, { useState } from "react";
import { AdminPlatformSettings } from "../types/admin.types";
import { AppCard, AppButton, AppInput, AppBadge } from "@/shared/ui";
import { Shield, Globe, Power, Check, Save, Lock, AlertTriangle } from "lucide-react";

export interface AdminSettingsTabProps {
  settings: AdminPlatformSettings;
  onUpdateSettings: (updated: Partial<AdminPlatformSettings>) => Promise<boolean>;
}

export function AdminSettingsTab({ settings, onUpdateSettings }: AdminSettingsTabProps) {
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await onUpdateSettings(formData);
    setIsSaving(false);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-cairo" dir="rtl">
      {/* Top Action Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">إعدادات المنصة وسياسات التشغيل</h3>
          <p className="text-xs text-on-surface-variant">تحكم بهوية النظام، وضع الصيانة، سياسة تسجيل الحسابات، وحدود الأمان</p>
        </div>
        <AppButton
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSaving}
          leftIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? "تم حفظ الإعدادات بنجاح!" : "حفظ الإعدادات"}
        </AppButton>
      </div>

      {/* Identity & Domains */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="font-bold text-sm text-on-surface">الهوية العامة والنطاقات</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AppInput
            label="اسم المنصة"
            value={formData.siteName}
            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
          />
          <AppInput
            label="البريد الرسمي للدعم الفني"
            type="email"
            value={formData.supportEmail}
            onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
            dir="ltr"
          />
          <AppInput
            label="النطاق المعتمد للمنصة"
            value={formData.canonicalDomain}
            onChange={(e) => setFormData({ ...formData, canonicalDomain: e.target.value })}
            dir="ltr"
          />
        </div>
      </AppCard>

      {/* Maintenance Mode & Operations */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-5">
        <div className="flex items-center gap-2">
          <Power className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-sm text-on-surface">وضع الصيانة وسياسة التسجيل</h4>
        </div>

        <div className="space-y-4 divide-y divide-outline-variant/20">
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-bold text-on-surface">وضع الصيانة (Maintenance Mode)</p>
              <p className="text-xs text-on-surface-variant">إيقاف استقبال الزوار مؤقتاً لغير المشرفين لعرض رسالة صيانة مجدولة</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.maintenanceMode
                  ? "bg-error text-white shadow-md shadow-error/20"
                  : "bg-surface-container text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {formData.maintenanceMode ? "وضع الصيانة مفعل (مغلق)" : "المنصة تعمل طبيعياً"}
            </button>
          </div>

          {formData.maintenanceMode && (
            <div className="pt-3">
              <AppInput
                label="رسالة الصيانة المعروضة للزوار"
                value={formData.maintenanceMessage}
                onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-bold text-on-surface">قبول تسجيل مستخدمين جدد</p>
              <p className="text-xs text-on-surface-variant">السماح بإنشاء حسابات جديدة عبر صفحة التسجيل أو إغلاقها مؤقتاً</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, allowRegistration: !formData.allowRegistration })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.allowRegistration
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-outline"
              }`}
            >
              {formData.allowRegistration ? "التسجيل مفتوح" : "التسجيل مغلق"}
            </button>
          </div>
        </div>
      </AppCard>

      {/* Security Policies */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-secondary" />
          <h4 className="font-bold text-sm text-on-surface">سياسات الأمان والحماية</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput
            label="الحد الأقصى لمحاولات تسجيل الدخول الفاشلة (Rate Limit)"
            type="number"
            value={formData.rateLimitMaxAttempts}
            onChange={(e) => setFormData({ ...formData, rateLimitMaxAttempts: Number(e.target.value) })}
          />

          <div className="flex flex-col justify-end">
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface">حارس الروابط الذكي (Link Sentinel)</p>
                <p className="text-[11px] text-on-surface-variant">فحص الروابط تلقائياً ضد مواقع الاحتيال</p>
              </div>
              <AppBadge variant="success" size="sm">مفعل 24/7</AppBadge>
            </div>
          </div>
        </div>
      </AppCard>
    </form>
  );
}
