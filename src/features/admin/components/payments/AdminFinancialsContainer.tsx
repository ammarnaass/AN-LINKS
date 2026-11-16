"use client";

import React, { useState, useCallback } from "react";
import { FinancialSubTab, useAdminFinancials } from "../../hooks/useAdminFinancials";
import { AdminGatewayDetails, AdminSubscriptionPlanItem, AdminCurrencyItem } from "../../types/admin.types";
import { AppButton } from "@/shared/ui";
import { CreditCard, RotateCcw, CheckCircle2, AlertCircle, X } from "lucide-react";
import { GatewaysSubTab } from "./tabs/GatewaysSubTab";
import { PlansSubTab } from "./tabs/PlansSubTab";
import { PlanQuotasSubTab } from "./tabs/PlanQuotasSubTab";
import { CurrenciesSubTab } from "./tabs/CurrenciesSubTab";
import { CouponsSubTab } from "./tabs/CouponsSubTab";
import { InvoicesTransactionsSubTab } from "./tabs/InvoicesTransactionsSubTab";
import { FinancialsSubTabNav } from "./FinancialsSubTabNav";
import { FinancialsStatsOverview } from "./FinancialsStatsOverview";
import { FinancialsModalsManager } from "./FinancialsModalsManager";

export interface AdminFinancialsContainerProps {
  initialSubTab?: FinancialSubTab;
  initialModal?: "gateway" | "plan" | "coupon" | "currency" | null;
  initialModalData?: AdminGatewayDetails | AdminSubscriptionPlanItem | AdminCurrencyItem | null;
  customHook?: ReturnType<typeof useAdminFinancials>;
  className?: string;
}

export function AdminFinancialsContainer({
  initialSubTab = "gateways",
  initialModal = null,
  initialModalData = null,
  customHook,
  className = "",
}: AdminFinancialsContainerProps) {
  const defaultHook = useAdminFinancials(initialSubTab);
  const financials = customHook || defaultHook;
  const { activeSubTab, setActiveSubTab, overview, gateways, plans, currencies, coupons, transactions, isSaving, updateGatewayConfig, savePlan, createCoupon, saveCurrency } = financials;

  const [gatewayModalState, setGatewayModalState] = useState<{ isOpen: boolean; gateway: AdminGatewayDetails | null }>({
    isOpen: initialModal === "gateway",
    gateway: initialModal === "gateway" ? (initialModalData as AdminGatewayDetails) || null : null,
  });
  const [planModalState, setPlanModalState] = useState<{ isOpen: boolean; plan: AdminSubscriptionPlanItem | null }>({
    isOpen: initialModal === "plan",
    plan: initialModal === "plan" ? (initialModalData as AdminSubscriptionPlanItem) || null : null,
  });
  const [couponModalOpen, setCouponModalOpen] = useState(initialModal === "coupon");
  const [currencyModalState, setCurrencyModalState] = useState<{ isOpen: boolean; currency: AdminCurrencyItem | null }>({
    isOpen: initialModal === "currency",
    currency: initialModal === "currency" ? (initialModalData as AdminCurrencyItem) || null : null,
  });

  const totalGateways = overview?.totalGateways ?? gateways.length;
  const activeGateways = overview?.activeGateways ?? gateways.filter((g) => g.isEnabled).length;
  const totalPlans = overview?.totalPlans ?? plans.length;
  const activePlans = overview?.totalPlans ?? plans.filter((p) => p.isActive).length;
  const totalCurrencies = overview?.totalCurrencies ?? currencies.length;
  const totalCoupons = overview?.totalCoupons ?? coupons.length;
  const activeCoupons = overview?.totalCoupons ?? coupons.filter((c) => c.isActive).length;
  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalInvoices = transactions?.total ?? overview?.totalInvoices ?? 0;

  return (
    <div className={`space-y-6 font-cairo ${className}`} dir="rtl" data-testid="admin-financials-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">إدارة بوابات الدفع والاشتراكات والعمليات المالية</h2>
          </div>
          <p className="text-xs text-on-surface-variant">منظومة مالية شاملة لإدارة بوابات الدفع، خطط الاشتراكات، الصلاحيات، العملات وأكواد الخصم</p>
        </div>
        <AppButton variant="outline" size="sm" onClick={financials.refreshData} isLoading={financials.isLoading} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
          تحديث البيانات
        </AppButton>
      </div>

      {financials.feedback && (
        <div role="status" aria-live="polite" className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${financials.feedback.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-error/10 text-error border border-error/30"}`}>
          <div className="flex items-center gap-2">
            {financials.feedback.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-error" />}
            <span>{financials.feedback.message}</span>
          </div>
          <button type="button" onClick={financials.clearFeedback} className="p-1 rounded-lg hover:bg-surface-container/50 text-on-surface-variant hover:text-on-surface cursor-pointer" aria-label="إغلاق الإشعار"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {financials.error && !financials.feedback && (
        <div role="alert" className="p-4 rounded-xl flex items-center justify-between bg-error/10 text-error border border-error/30 text-xs font-semibold">
          <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0 text-error" /><span>{financials.error}</span></div>
          <button type="button" onClick={() => financials.setError(null)} className="p-1 rounded-lg hover:bg-surface-container/50 text-on-surface-variant hover:text-on-surface cursor-pointer" aria-label="إغلاق التنبيه"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      <FinancialsStatsOverview activeGateways={activeGateways} totalGateways={totalGateways} activePlans={activePlans} totalPlans={totalPlans} totalCurrencies={totalCurrencies} activeCoupons={activeCoupons} totalCoupons={totalCoupons} totalRevenue={totalRevenue} totalInvoices={totalInvoices} />
      <FinancialsSubTabNav activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} activeGateways={activeGateways} totalGateways={totalGateways} totalPlans={totalPlans} totalCurrencies={totalCurrencies} activeCoupons={activeCoupons} totalInvoices={totalInvoices} />

      <div className="w-full" data-testid={`subtab-${activeSubTab}`}>
        {activeSubTab === "gateways" && <GatewaysSubTab gateways={financials.gateways} onToggleGateway={financials.toggleGateway} onSaveConfig={financials.updateGatewayConfig} isSaving={financials.isSaving} onOpenConfig={(gw) => setGatewayModalState({ isOpen: true, gateway: gw })} />}
        {activeSubTab === "plans" && <PlansSubTab plans={financials.plans} onSavePlan={financials.savePlan} onDeletePlan={financials.deletePlan} isSaving={financials.isSaving} onOpenCreatePlan={() => setPlanModalState({ isOpen: true, plan: null })} onOpenEditPlan={(p) => setPlanModalState({ isOpen: true, plan: p })} />}
        {activeSubTab === "quotas" && <PlanQuotasSubTab plans={financials.plans} onSaveQuotas={financials.saveQuotas} isSaving={financials.isSaving} />}
        {activeSubTab === "currencies" && <CurrenciesSubTab currencies={financials.currencies} onSaveCurrency={financials.saveCurrency} isSaving={financials.isSaving} onOpenEditRate={(c) => setCurrencyModalState({ isOpen: true, currency: c })} />}
        {activeSubTab === "coupons" && <CouponsSubTab coupons={financials.coupons} availablePlanSlugs={financials.plans.map((p) => ({ slug: p.slug, nameAr: p.nameAr }))} onCreateCoupon={financials.createCoupon} onToggleCoupon={financials.toggleCoupon} onDeleteCoupon={financials.deleteCoupon} isSaving={financials.isSaving} onOpenCreateCoupon={() => setCouponModalOpen(true)} />}
        {activeSubTab === "transactions" && <InvoicesTransactionsSubTab transactions={financials.transactions} onFilterChange={financials.filterTransactions} isLoading={financials.isLoading} />}
      </div>

      <FinancialsModalsManager
        gatewayModalState={gatewayModalState} onCloseGatewayModal={() => setGatewayModalState({ isOpen: false, gateway: null })} onUpdateGatewayConfig={updateGatewayConfig}
        planModalState={planModalState} onClosePlanModal={() => setPlanModalState({ isOpen: false, plan: null })} onSavePlan={savePlan}
        couponModalOpen={couponModalOpen} onCloseCouponModal={() => setCouponModalOpen(false)} onCreateCoupon={createCoupon} availablePlanSlugs={plans.map((p) => ({ slug: p.slug, nameAr: p.nameAr }))}
        currencyModalState={currencyModalState} onCloseCurrencyModal={() => setCurrencyModalState({ isOpen: false, currency: null })} onSaveCurrency={saveCurrency}
        isSaving={isSaving}
      />
    </div>
  );
}
export { FinancialsSubTabNav, FinancialsStatsOverview, FinancialsModalsManager };
