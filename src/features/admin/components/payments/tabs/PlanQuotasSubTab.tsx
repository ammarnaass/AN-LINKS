"use client";

import React, { useState, useEffect } from "react";
import {
  AdminSubscriptionPlanItem,
  AdminPlanQuotaConfig,
} from "../../../types/admin.types";
import { AppCard, AppButton, AppInput, AppBadge } from "@/shared/ui";
import {
  Sliders,
  Check,
  Save,
  Link as LinkIcon,
  Globe,
  EyeOff,
  Palette,
  BarChart2,
  Headphones,
  Code,
  Percent,
  AlertCircle,
} from "lucide-react";

export interface PlanQuotasSubTabProps {
  plans: AdminSubscriptionPlanItem[];
  onSaveQuotas: (
    planId: string,
    quotas: Partial<AdminPlanQuotaConfig>
  ) => Promise<boolean>;
  isSaving?: boolean;
}

const DEFAULT_QUOTAS: AdminPlanQuotaConfig = {
  maxLinks: 10,
  allowCustomDomain: false,
  allowRemoveBranding: false,
  allowAdvancedThemes: false,
  allowDetailedAnalytics: false,
  allowPrioritySupport: false,
  customCssAllowed: false,
  storeCommissionRate: 10,
};

export function PlanQuotasSubTab({
  plans,
  onSaveQuotas,
  isSaving = false,
}: PlanQuotasSubTabProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    plans[0]?.id || ""
  );

  const currentPlan =
    plans.find((p) => p.id === selectedPlanId) || plans[0] || null;

  const [quotas, setQuotas] = useState<AdminPlanQuotaConfig>(
    currentPlan?.quotas || DEFAULT_QUOTAS
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentPlan) {
      setQuotas(currentPlan.quotas || DEFAULT_QUOTAS);
      setSavedSuccess(false);
      setErrorMessage(null);
    }
  }, [currentPlan?.id]);

  useEffect(() => {
    if (!selectedPlanId && plans.length > 0) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  const handleToggle = (key: keyof AdminPlanQuotaConfig) => {
    setQuotas((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!currentPlan) return;
    setErrorMessage(null);
    setSavedSuccess(false);

    const success = await onSaveQuotas(currentPlan.id, quotas);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setErrorMessage("فشل حفظ التخصيص والمحددات، يرجى المحاولة لاحقاً");
    }
  };

  if (plans.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 text-on-surface-variant font-cairo">
        لا توجد باقات اشتراك مضافة بعد لتخصيص محدداتها.
      </div>
    );
  }

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">
            حدود ومحددات مميزات الباقات (Quotas & Limits)
          </h3>
          <p className="text-xs text-on-surface-variant">
            ضبط السقوف الرقمية والمميزات المقفلة والمفتوحة لكل باقة اشتراك بدقة متناهية
          </p>
        </div>

        <AppButton
          variant="primary"
          size="sm"
          isLoading={isSaving}
          onClick={handleSave}
          leftIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? "تم حفظ المحددات!" : "حفظ التخصيص والمحددات"}
        </AppButton>
      </div>

      {/* Plan Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {plans.map((p) => {
          const isSelected = p.id === currentPlan?.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlanId(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:bg-surface-container"
              }`}
            >
              <span>{p.nameAr}</span>
              <span className="font-mono text-[10px] opacity-80">({p.slug})</span>
              {p.badgeAr && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 text-white">
                  {p.badgeAr}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl text-xs bg-error/15 text-error border border-error/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quotas Form Card */}
      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div>
            <h4 className="font-bold text-sm text-on-surface">
              إعدادات باقة: {currentPlan?.nameAr} ({currentPlan?.nameEn})
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              تحديد الحد الأقصى للموارد ونسب العمولات والميزات المصرح بها
            </p>
          </div>
          <AppBadge variant={currentPlan?.isActive ? "success" : "neutral"} size="sm">
            {currentPlan?.isActive ? "باقة مفعلة" : "باقة معطلة"}
          </AppBadge>
        </div>

        {/* Numeric Limits Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
            <label className="text-xs font-bold text-on-surface flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              <span>أقصى عدد للروابط النشطة (Max Links)</span>
            </label>
            <input
              type="number"
              value={quotas.maxLinks}
              onChange={(e) =>
                setQuotas({ ...quotas, maxLinks: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="block text-[11px] text-on-surface-variant">
              أدخل 9999 أو 0 لإتاحة عدد غير محدود من الروابط
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2">
            <label className="text-xs font-bold text-on-surface flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-400" />
              <span>نسبة عمولة المنصة على المبيعات (%)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={quotas.storeCommissionRate}
              onChange={(e) =>
                setQuotas({
                  ...quotas,
                  storeCommissionRate: Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="block text-[11px] text-on-surface-variant">
              النسبة المقتطعة تلقائياً عند بيع المنتجات الرقمية عبر صفحة المستخدم
            </span>
          </div>
        </div>

        {/* Feature Switches Section */}
        <div className="space-y-3">
          <h5 className="font-bold text-xs text-on-surface">الميزات والصلاحيات المتقدمة:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Custom Domain */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    ربط نطاق خاص (Custom Domain)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    إمكانية توجيه دومين مخصص مثل yourname.com
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("allowCustomDomain")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quotas.allowCustomDomain
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {quotas.allowCustomDomain ? "مفعل" : "معطل"}
              </button>
            </div>

            {/* Remove Branding */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    إزالة شعار المنصة (Remove Branding)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    إخفاء علامة "Made with AN LINKS" من أسفل الصفحة
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("allowRemoveBranding")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quotas.allowRemoveBranding
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {quotas.allowRemoveBranding ? "مفعل" : "معطل"}
              </button>
            </div>

            {/* Advanced Themes */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    قوالب وثيمات حصرية (Advanced Themes)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    إتاحة ثيمات الزجاج والنيون والقوالب الحركية ثلاثية الأبعاد
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("allowAdvancedThemes")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quotas.allowAdvancedThemes
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {quotas.allowAdvancedThemes ? "مفعل" : "معطل"}
              </button>
            </div>

            {/* Detailed Analytics */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    تحليلات تفصيلية جغرافية (Detailed Analytics)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    خريطة الزوار، مصادر الزيارات ونوع الأجهزة والمتصفحات
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("allowDetailedAnalytics")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quotas.allowDetailedAnalytics
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {quotas.allowDetailedAnalytics ? "مفعل" : "معطل"}
              </button>
            </div>

            {/* Priority Support */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    أولوية الدعم الفني (VIP Priority Support)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    رد سريع خلال ساعة ومسار تذاكر مباشر
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("allowPrioritySupport")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quotas.allowPrioritySupport
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {quotas.allowPrioritySupport ? "مفعل" : "معطل"}
              </button>
            </div>

            {/* Custom CSS */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">
                    تخصيص كامل بأكواد CSS (Custom CSS)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    إمكانية حقن أكواد CSS مخصصة لتنسيق الصفحة
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("customCssAllowed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  quotas.customCssAllowed
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {quotas.customCssAllowed ? "مفعل" : "معطل"}
              </button>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  );
}
