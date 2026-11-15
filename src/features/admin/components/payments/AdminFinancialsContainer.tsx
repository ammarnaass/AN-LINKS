"use client";

import React, { useState, useCallback } from "react";
import {
  FinancialSubTab,
  useAdminFinancials,
} from "../../hooks/useAdminFinancials";
import {
  AdminGatewayDetails,
  AdminSubscriptionPlanItem,
  AdminCurrencyItem,
} from "../../types/admin.types";
import { AppCard, AppButton } from "@/shared/ui";
import {
  CreditCard,
  Package,
  Sliders,
  Globe,
  Tag,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { GatewaysSubTab } from "./tabs/GatewaysSubTab";
import { PlansSubTab } from "./tabs/PlansSubTab";
import { PlanQuotasSubTab } from "./tabs/PlanQuotasSubTab";
import { CurrenciesSubTab } from "./tabs/CurrenciesSubTab";
import { CouponsSubTab } from "./tabs/CouponsSubTab";
import { InvoicesTransactionsSubTab } from "./tabs/InvoicesTransactionsSubTab";

import { GatewayConfigModal } from "./modals/GatewayConfigModal";
import { PlanEditorModal } from "./modals/PlanEditorModal";
import { CouponEditorModal } from "./modals/CouponEditorModal";
import { CurrencyRateModal } from "./modals/CurrencyRateModal";

export interface AdminFinancialsContainerProps {
  initialSubTab?: FinancialSubTab;
  initialModal?: "gateway" | "plan" | "coupon" | "currency" | null;
  initialModalData?:
    | AdminGatewayDetails
    | AdminSubscriptionPlanItem
    | AdminCurrencyItem
    | null;
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

  const {
    activeSubTab,
    setActiveSubTab,
    overview,
    gateways,
    plans,
    currencies,
    coupons,
    transactions,
    isSaving,
    updateGatewayConfig,
    savePlan,
    createCoupon,
    saveCurrency,
  } = financials;

  // 4 Modals State managed at container level
  const [gatewayModalState, setGatewayModalState] = useState<{
    isOpen: boolean;
    gateway: AdminGatewayDetails | null;
  }>({
    isOpen: initialModal === "gateway",
    gateway:
      initialModal === "gateway"
        ? (initialModalData as AdminGatewayDetails) || null
        : null,
  });

  const [planModalState, setPlanModalState] = useState<{
    isOpen: boolean;
    plan: AdminSubscriptionPlanItem | null;
  }>({
    isOpen: initialModal === "plan",
    plan:
      initialModal === "plan"
        ? (initialModalData as AdminSubscriptionPlanItem) || null
        : null,
  });

  const [couponModalOpen, setCouponModalOpen] = useState(
    initialModal === "coupon"
  );

  const [currencyModalState, setCurrencyModalState] = useState<{
    isOpen: boolean;
    currency: AdminCurrencyItem | null;
  }>({
    isOpen: initialModal === "currency",
    currency:
      initialModal === "currency"
        ? (initialModalData as AdminCurrencyItem) || null
        : null,
  });

  // Modal Handlers
  const handleOpenGatewayModal = useCallback((gw: AdminGatewayDetails) => {
    setGatewayModalState({ isOpen: true, gateway: gw });
  }, []);

  const handleCloseGatewayModal = useCallback(() => {
    setGatewayModalState({ isOpen: false, gateway: null });
  }, []);

  const handleOpenCreatePlan = useCallback(() => {
    setPlanModalState({ isOpen: true, plan: null });
  }, []);

  const handleOpenEditPlan = useCallback((plan: AdminSubscriptionPlanItem) => {
    setPlanModalState({ isOpen: true, plan });
  }, []);

  const handleClosePlanModal = useCallback(() => {
    setPlanModalState({ isOpen: false, plan: null });
  }, []);

  const handleOpenCreateCoupon = useCallback(() => {
    setCouponModalOpen(true);
  }, []);

  const handleCloseCouponModal = useCallback(() => {
    setCouponModalOpen(false);
  }, []);

  const handleOpenEditRate = useCallback((curr: AdminCurrencyItem) => {
    setCurrencyModalState({ isOpen: true, currency: curr });
  }, []);

  const handleCloseCurrencyModal = useCallback(() => {
    setCurrencyModalState({ isOpen: false, currency: null });
  }, []);

  // Overview Statistics Calculations
  const totalGateways = overview?.totalGateways ?? gateways.length;
  const activeGateways =
    overview?.activeGateways ?? gateways.filter((g) => g.isEnabled).length;
  const totalPlans = overview?.totalPlans ?? plans.length;
  const activePlans =
    overview?.totalPlans ?? plans.filter((p) => p.isActive).length;
  const totalCurrencies = overview?.totalCurrencies ?? currencies.length;
  const totalCoupons = overview?.totalCoupons ?? coupons.length;
  const activeCoupons =
    overview?.totalCoupons ?? coupons.filter((c) => c.isActive).length;
  const totalRevenue = overview?.totalRevenue ?? 0;
  const totalInvoices = transactions?.total ?? overview?.totalInvoices ?? 0;

  // Tabs Definition
  const tabs: Array<{
    key: FinancialSubTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
  }> = [
    {
      key: "gateways",
      label: "بوابات الدفع",
      icon: <CreditCard className="w-4 h-4 shrink-0" />,
      badge: `${activeGateways}/${totalGateways}`,
    },
    {
      key: "plans",
      label: "باقات الاشتراك",
      icon: <Package className="w-4 h-4 shrink-0" />,
      badge: totalPlans > 0 ? totalPlans : undefined,
    },
    {
      key: "quotas",
      label: "المحددات والمميزات",
      icon: <Sliders className="w-4 h-4 shrink-0" />,
    },
    {
      key: "currencies",
      label: "العملات وأسعار الصرف",
      icon: <Globe className="w-4 h-4 shrink-0" />,
      badge: totalCurrencies > 0 ? totalCurrencies : undefined,
    },
    {
      key: "coupons",
      label: "كوبونات الخصم",
      icon: <Tag className="w-4 h-4 shrink-0" />,
      badge: activeCoupons > 0 ? activeCoupons : undefined,
    },
    {
      key: "transactions",
      label: "المعاملات والفواتير",
      icon: <Receipt className="w-4 h-4 shrink-0" />,
      badge: totalInvoices > 0 ? totalInvoices : undefined,
    },
  ];

  return (
    <div
      className={`space-y-6 font-cairo ${className}`}
      dir="rtl"
      data-testid="admin-financials-container"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              إدارة بوابات الدفع والاشتراكات والعمليات المالية
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            منظومة مالية شاملة لإدارة بوابات الدفع، خطط الاشتراكات، الصلاحيات،
            العملات وأكواد الخصم
          </p>
        </div>

        <div className="flex items-center gap-2">
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
      </div>

      {/* Feedback Banner */}
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

      {/* Global Error Banner */}
      {financials.error && !financials.feedback && (
        <div
          role="alert"
          className="p-4 rounded-xl flex items-center justify-between bg-error/10 text-error border border-error/30 text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-error" />
            <span>{financials.error}</span>
          </div>
          <button
            type="button"
            onClick={() => financials.setError(null)}
            className="p-1 rounded-lg hover:bg-surface-container/50 text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Overview Statistics Bar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5"
        data-testid="financial-overview-stats"
      >
        {/* Card 1: Gateways */}
        <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant mb-1">
              بوابات الدفع
            </span>
            <span className="text-xl font-bold text-on-surface font-mono">
              {activeGateways} / {totalGateways}
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5">
              {activeGateways} بوابات نشطة
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-primary">
            <CreditCard className="w-4 h-4" />
          </div>
        </AppCard>

        {/* Card 2: Plans */}
        <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant mb-1">
              باقات الاشتراك
            </span>
            <span className="text-xl font-bold text-on-surface font-mono">
              {activePlans}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-0.5">
              {totalPlans} إجمالي الباقات
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-amber-400">
            <Package className="w-4 h-4" />
          </div>
        </AppCard>

        {/* Card 3: Currencies */}
        <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant mb-1">
              العملات المدعومة
            </span>
            <span className="text-xl font-bold text-on-surface font-mono">
              {totalCurrencies}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-0.5">
              SAR العملة الأساسية
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-sky-400">
            <Globe className="w-4 h-4" />
          </div>
        </AppCard>

        {/* Card 4: Coupons */}
        <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant mb-1">
              كوبونات الخصم
            </span>
            <span className="text-xl font-bold text-on-surface font-mono">
              {activeCoupons}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-0.5">
              {totalCoupons} إجمالي الكوبونات
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-purple-400">
            <Tag className="w-4 h-4" />
          </div>
        </AppCard>

        {/* Card 5: Revenue */}
        <AppCard className="p-4 bg-surface-container-low border-outline-variant/30 flex items-center justify-between col-span-2 sm:col-span-1">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-on-surface-variant mb-1">
              إجمالي التحصيل
            </span>
            <span className="text-xl font-bold text-on-surface font-mono">
              {totalRevenue.toLocaleString("ar-SA")} ر.س
            </span>
            <span className="text-[10px] text-on-surface-variant mt-0.5">
              {totalInvoices} عملية مسجلة
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-emerald-400">
            <Receipt className="w-4 h-4" />
          </div>
        </AppCard>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        role="tablist"
        aria-label="تبويبات الإدارة المالية"
        className="w-full flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => {
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActiveSubTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tab View */}
      <div className="w-full" data-testid={`subtab-${activeSubTab}`}>
        {activeSubTab === "gateways" && (
          <GatewaysSubTab
            gateways={financials.gateways}
            onToggleGateway={financials.toggleGateway}
            onSaveConfig={financials.updateGatewayConfig}
            isSaving={financials.isSaving}
            onOpenConfig={handleOpenGatewayModal}
          />
        )}

        {activeSubTab === "plans" && (
          <PlansSubTab
            plans={financials.plans}
            onSavePlan={financials.savePlan}
            onDeletePlan={financials.deletePlan}
            isSaving={financials.isSaving}
            onOpenCreatePlan={handleOpenCreatePlan}
            onOpenEditPlan={handleOpenEditPlan}
          />
        )}

        {activeSubTab === "quotas" && (
          <PlanQuotasSubTab
            plans={financials.plans}
            onSaveQuotas={financials.saveQuotas}
            isSaving={financials.isSaving}
          />
        )}

        {activeSubTab === "currencies" && (
          <CurrenciesSubTab
            currencies={financials.currencies}
            onSaveCurrency={financials.saveCurrency}
            isSaving={financials.isSaving}
            onOpenEditRate={handleOpenEditRate}
          />
        )}

        {activeSubTab === "coupons" && (
          <CouponsSubTab
            coupons={financials.coupons}
            availablePlanSlugs={financials.plans.map((p) => ({
              slug: p.slug,
              nameAr: p.nameAr,
            }))}
            onCreateCoupon={financials.createCoupon}
            onToggleCoupon={financials.toggleCoupon}
            onDeleteCoupon={financials.deleteCoupon}
            isSaving={financials.isSaving}
            onOpenCreateCoupon={handleOpenCreateCoupon}
          />
        )}

        {activeSubTab === "transactions" && (
          <InvoicesTransactionsSubTab
            transactions={financials.transactions}
            onFilterChange={financials.filterTransactions}
            isLoading={financials.isLoading}
          />
        )}
      </div>

      {/* 4 Admin Modals Managed Centrally */}
      <GatewayConfigModal
        isOpen={gatewayModalState.isOpen}
        gateway={gatewayModalState.gateway}
        onClose={handleCloseGatewayModal}
        onSave={updateGatewayConfig}
        isSaving={isSaving}
      />

      <PlanEditorModal
        isOpen={planModalState.isOpen}
        plan={planModalState.plan}
        onClose={handleClosePlanModal}
        onSave={savePlan}
        isSaving={isSaving}
      />

      <CouponEditorModal
        isOpen={couponModalOpen}
        onClose={handleCloseCouponModal}
        onSave={createCoupon}
        availablePlanSlugs={plans.map((p) => ({
          slug: p.slug,
          nameAr: p.nameAr,
        }))}
        isSaving={isSaving}
      />

      <CurrencyRateModal
        isOpen={currencyModalState.isOpen}
        currency={currencyModalState.currency}
        onClose={handleCloseCurrencyModal}
        onSave={saveCurrency}
        isSaving={isSaving}
      />
    </div>
  );
}
