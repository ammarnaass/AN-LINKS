"use client";

import React, { useState } from "react";
import { useAdminFinancials } from "../../hooks/useAdminFinancials";
import { AdminSubscriptionPlanItem } from "../../types/admin.types";
import { AppButton } from "@/shared/ui";
import { Package, RotateCcw, CheckCircle2, AlertCircle, X, Sparkles, Sliders, Tag } from "lucide-react";
import { PlansSubTab } from "../payments/tabs/PlansSubTab";
import { PlanQuotasSubTab } from "../payments/tabs/PlanQuotasSubTab";
import { CouponsSubTab } from "../payments/tabs/CouponsSubTab";
import { PlanEditorModal } from "../payments/modals/PlanEditorModal";
import { CouponEditorModal } from "../payments/modals/CouponEditorModal";
import { SubscriptionsSubTabNav, SubscriptionSubTab } from "./SubscriptionsSubTabNav";

export interface AdminSubscriptionsContainerProps {
  initialSubTab?: SubscriptionSubTab;
  customHook?: ReturnType<typeof useAdminFinancials>;
  className?: string;
  hideSubNav?: boolean;
  hideOverviewStats?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function AdminSubscriptionsContainer({
  initialSubTab = "plans",
  customHook,
  className = "",
  hideSubNav = false,
  hideOverviewStats = false,
  title,
  subtitle,
  icon,
}: AdminSubscriptionsContainerProps) {
  const defaultHook = useAdminFinancials("plans");
  const financials = customHook || defaultHook;
  const { overview, plans, coupons, isSaving, savePlan, deletePlan, saveQuotas, createCoupon, toggleCoupon, deleteCoupon } = financials;

  const [activeSubTab, setActiveSubTab] = useState<SubscriptionSubTab>(initialSubTab);
  const [planModalState, setPlanModalState] = useState<{ isOpen: boolean; plan: AdminSubscriptionPlanItem | null }>({
    isOpen: false,
    plan: null,
  });
  const [couponModalOpen, setCouponModalOpen] = useState(false);

  const totalPlans = overview?.totalPlans ?? plans.length;
  const activePlans = plans.filter((p) => p.isActive).length;
  const totalCoupons = overview?.totalCoupons ?? coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;

  return (
    <div className={`space-y-6 font-cairo ${className}`} dir="rtl" data-testid="admin-subscriptions-container">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {icon || <Package className="w-4 h-4" />}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              {title || "إدارة باقات واشتراكات المنصة"}
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            {subtitle || "تحكم كامل في خطط الاشتراك (Free, Pro, Business)، المحددات والصلاحيات (Quotas)، وكوبونات الخصم الترويجية"}
          </p>
        </div>
        <AppButton
          variant="outline"
          size="sm"
          onClick={financials.refreshData}
          isLoading={financials.isLoading}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          تحديث البيانات
        </AppButton>
      </div>

      {/* Feedback Messages */}
      {financials.feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
            financials.feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-error/10 text-error border border-error/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {financials.feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-error" />
            )}
            <span>{financials.feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={financials.clearFeedback}
            className="p-1 rounded-lg hover:bg-surface-container/50 text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="إغلاق الإشعار"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stats Summary Cards */}
      {!hideOverviewStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-medium">إجمالي الباقات</span>
              <p className="text-xl font-bold font-mono text-on-surface mt-1">{totalPlans}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-medium">الباقات النشطة</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">{activePlans}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-on-surface-variant font-medium">الكوبونات الفعالة</span>
              <p className="text-xl font-bold font-mono text-secondary mt-1">{activeCoupons}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      {!hideSubNav && (
        <SubscriptionsSubTabNav
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          totalPlans={totalPlans}
          activeCoupons={activeCoupons}
        />
      )}

      {/* Tab Panels */}
      <div className="w-full" data-testid={`subscription-subtab-${activeSubTab}`}>
        {activeSubTab === "plans" && (
          <PlansSubTab
            plans={plans}
            onSavePlan={savePlan}
            onDeletePlan={deletePlan}
            isSaving={isSaving}
            onOpenCreatePlan={() => setPlanModalState({ isOpen: true, plan: null })}
            onOpenEditPlan={(p) => setPlanModalState({ isOpen: true, plan: p })}
          />
        )}
        {activeSubTab === "quotas" && (
          <PlanQuotasSubTab
            plans={plans}
            onSaveQuotas={saveQuotas}
            isSaving={isSaving}
          />
        )}
        {activeSubTab === "coupons" && (
          <CouponsSubTab
            coupons={coupons}
            onCreateCoupon={createCoupon}
            onToggleCoupon={toggleCoupon}
            onDeleteCoupon={deleteCoupon}
            isSaving={isSaving}
            onOpenCreateCoupon={() => setCouponModalOpen(true)}
          />
        )}
      </div>

      {/* Modals */}
      <PlanEditorModal
        isOpen={planModalState.isOpen}
        plan={planModalState.plan}
        onClose={() => setPlanModalState({ isOpen: false, plan: null })}
        onSave={async (data) => {
          const res = await savePlan(data);
          if (res) setPlanModalState({ isOpen: false, plan: null });
          return Boolean(res);
        }}
        isSaving={isSaving}
      />
      <CouponEditorModal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        onSave={async (data) => {
          const res = await createCoupon(data);
          if (res) setCouponModalOpen(false);
          return Boolean(res);
        }}
        isSaving={isSaving}
      />
    </div>
  );
}
