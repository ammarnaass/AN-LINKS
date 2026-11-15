"use client";

import React, { useState } from "react";
import {
  AdminSubscriptionPlanItem,
  UpsertPlanInput,
} from "../../../types/admin.types";
import { AppCard, AppBadge, AppButton } from "@/shared/ui";
import { PlanEditorModal } from "../modals/PlanEditorModal";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X as XIcon,
  Sparkles,
  Link as LinkIcon,
  Globe,
  Percent,
} from "lucide-react";

export interface PlansSubTabProps {
  plans: AdminSubscriptionPlanItem[];
  onSavePlan: (input: UpsertPlanInput) => Promise<boolean>;
  onDeletePlan: (id: string) => Promise<boolean>;
  isSaving?: boolean;
  onOpenCreatePlan?: () => void;
  onOpenEditPlan?: (plan: AdminSubscriptionPlanItem) => void;
}

export function PlansSubTab({
  plans,
  onSavePlan,
  onDeletePlan,
  isSaving = false,
  onOpenCreatePlan,
  onOpenEditPlan,
}: PlansSubTabProps) {
  const [cycle, setCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [selectedPlan, setSelectedPlan] = useState<AdminSubscriptionPlanItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateNew = () => {
    if (onOpenCreatePlan) {
      onOpenCreatePlan();
    } else {
      setSelectedPlan(null);
      setIsModalOpen(true);
    }
  };

  const handleEdit = (plan: AdminSubscriptionPlanItem) => {
    if (onOpenEditPlan) {
      onOpenEditPlan(plan);
    } else {
      setSelectedPlan(plan);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف أو أرشفة باقة "${name}"؟`)) {
      setDeletingId(id);
      try {
        await onDeletePlan(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Top Header & Cycle Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <h3 className="text-base font-bold text-on-surface">باقات الاشتراك والتسعير</h3>
          <p className="text-xs text-on-surface-variant">
            إدارة مستويات الاشتراك، الأسعار الشهرية والسنوية، والامتيازات الممنوحة للمستخدمين
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cycle Toggle Selector */}
          <div className="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/30 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCycle("MONTHLY")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                cycle === "MONTHLY"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              دفع شهري
            </button>
            <button
              type="button"
              onClick={() => setCycle("YEARLY")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                cycle === "YEARLY"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              دفع سنوي (توفير)
            </button>
          </div>

          {/* Add Plan Button */}
          <AppButton
            variant="primary"
            size="sm"
            onClick={handleCreateNew}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            إضافة باقة جديدة
          </AppButton>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const sarPrice =
            plan.prices?.find(
              (p) => p.currency === "SAR" && p.billingCycle === cycle
            )?.amount ?? 0;
          const usdPrice =
            plan.prices?.find(
              (p) => p.currency === "USD" && p.billingCycle === cycle
            )?.amount ?? 0;

          const isDeleting = deletingId === plan.id;
          const quotas = plan.quotas || {
            maxLinks: 5,
            allowCustomDomain: false,
            allowRemoveBranding: false,
            allowAdvancedThemes: false,
            allowDetailedAnalytics: false,
            allowPrioritySupport: false,
            customCssAllowed: false,
            storeCommissionRate: 10,
          };

          return (
            <AppCard
              key={plan.id}
              className={`p-5 bg-surface-container-low border flex flex-col justify-between hover:shadow-md transition-all ${
                plan.badgeAr
                  ? "border-primary/40 shadow-xs"
                  : "border-outline-variant/30"
              }`}
            >
              <div className="space-y-4">
                {/* Header with Title and Badges */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-base text-on-surface">{plan.nameAr}</h4>
                    <div className="flex flex-col items-end gap-1">
                      {plan.badgeAr && (
                        <AppBadge variant="primary" size="sm">
                          <Sparkles className="w-3 h-3 ml-1 inline" />
                          {plan.badgeAr}
                        </AppBadge>
                      )}
                      <AppBadge
                        variant={plan.isActive ? "success" : "neutral"}
                        size="sm"
                      >
                        {plan.isActive ? "نشطة" : "معطلة"}
                      </AppBadge>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant">
                    {plan.nameEn} ({plan.slug})
                  </span>
                  {plan.descriptionAr && (
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {plan.descriptionAr}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1">
                  <div className="flex items-baseline gap-1 text-on-surface">
                    <span className="text-2xl font-extrabold font-mono">{sarPrice}</span>
                    <span className="text-xs font-bold">ر.س</span>
                    <span className="text-[11px] text-on-surface-variant">
                      / {cycle === "MONTHLY" ? "شهرياً" : "سنوياً"}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant">
                    يعادل تقريباً ${usdPrice} USD
                  </div>
                </div>

                {/* Quota Highlights List */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-on-surface">
                    <LinkIcon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>
                      {quotas.maxLinks <= 0 || quotas.maxLinks >= 9999
                        ? "روابط غير محدودة"
                        : `حتى ${quotas.maxLinks} روابط نشطة`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {quotas.allowCustomDomain ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XIcon className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                    )}
                    <span
                      className={
                        quotas.allowCustomDomain
                          ? "text-on-surface font-medium"
                          : "text-on-surface-variant line-through opacity-70"
                      }
                    >
                      ربط نطاق خاص (Domain)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {quotas.allowRemoveBranding ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <XIcon className="w-3.5 h-3.5 text-outline flex-shrink-0" />
                    )}
                    <span
                      className={
                        quotas.allowRemoveBranding
                          ? "text-on-surface font-medium"
                          : "text-on-surface-variant line-through opacity-70"
                      }
                    >
                      إزالة شعار AN LINKS
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-on-surface">
                    <Percent className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>عمولة متجر: {quotas.storeCommissionRate}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(plan)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>تعديل الباقة</span>
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(plan.id, plan.nameAr)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="أرشفة أو حذف الباقة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? "..." : "أرشفة/حذف"}</span>
                </button>
              </div>
            </AppCard>
          );
        })}
      </div>

      {/* Plan Editor Modal (Fallback if not managed by container) */}
      {!onOpenCreatePlan && !onOpenEditPlan && (
        <PlanEditorModal
          isOpen={isModalOpen}
          plan={selectedPlan}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlan(null);
          }}
          onSave={onSavePlan}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
