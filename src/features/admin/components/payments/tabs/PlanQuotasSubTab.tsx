"use client";

import React, { useState, useEffect } from "react";
import { AdminSubscriptionPlanItem, AdminPlanQuotaConfig } from "../../../types/admin.types";
import { AppCard, AppButton, AppBadge } from "@/shared/ui";
import { Check, Save, AlertCircle } from "lucide-react";
import { PlanQuotasNumericLimits } from "./quotas/PlanQuotasNumericLimits";
import { PlanQuotasFeatureSwitches } from "./quotas/PlanQuotasFeatureSwitches";

export interface PlanQuotasSubTabProps {
  plans: AdminSubscriptionPlanItem[];
  onSaveQuotas: (planId: string, quotas: Partial<AdminPlanQuotaConfig>) => Promise<boolean>;
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

export function PlanQuotasSubTab({ plans, onSaveQuotas, isSaving = false }: PlanQuotasSubTabProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || "");
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0] || null;
  const [quotas, setQuotas] = useState<AdminPlanQuotaConfig>(currentPlan?.quotas || DEFAULT_QUOTAS);
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
    if (!selectedPlanId && plans.length > 0) setSelectedPlanId(plans[0].id);
  }, [plans, selectedPlanId]);

  const handleToggle = (key: keyof AdminPlanQuotaConfig) => {
    setQuotas((prev) => ({ ...prev, [key]: !prev[key] }));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">حدود ومحددات مميزات الباقات (Quotas & Limits)</h3>
          <p className="text-xs text-on-surface-variant">ضبط السقوف الرقمية والمميزات المقفلة والمفتوحة لكل باقة اشتراك بدقة متناهية</p>
        </div>
        <AppButton variant="primary" size="sm" isLoading={isSaving} onClick={handleSave} leftIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}>
          {savedSuccess ? "تم حفظ المحددات!" : "حفظ التخصيص والمحددات"}
        </AppButton>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {plans.map((p) => {
          const isSelected = p.id === currentPlan?.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlanId(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isSelected ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:bg-surface-container"
              }`}
            >
              <span>{p.nameAr}</span>
              <span className="font-mono text-[10px] opacity-80">({p.slug})</span>
              {p.badgeAr && <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/20 text-white">{p.badgeAr}</span>}
            </button>
          );
        })}
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl text-xs bg-error/15 text-error border border-error/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <AppCard className="p-6 bg-surface-container-low border-outline-variant/30 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div>
            <h4 className="font-bold text-sm text-on-surface">إعدادات باقة: {currentPlan?.nameAr} ({currentPlan?.nameEn})</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">تحديد الحد الأقصى للموارد ونسب العمولات والميزات المصرح بها</p>
          </div>
          <AppBadge variant={currentPlan?.isActive ? "success" : "neutral"} size="sm">
            {currentPlan?.isActive ? "باقة مفعلة" : "باقة معطلة"}
          </AppBadge>
        </div>

        <PlanQuotasNumericLimits quotas={quotas} onChange={(upd) => setQuotas((prev) => ({ ...prev, ...upd }))} />
        <PlanQuotasFeatureSwitches quotas={quotas} onToggle={handleToggle} />
      </AppCard>
    </div>
  );
}

export { PlanQuotasNumericLimits, PlanQuotasFeatureSwitches };
