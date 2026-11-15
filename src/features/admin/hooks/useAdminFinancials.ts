"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FinancialOverviewStats,
  AdminGatewayDetails,
  UpdateGatewayInput,
  AdminSubscriptionPlanItem,
  UpsertPlanInput,
  AdminPlanQuotaConfig,
  AdminCurrencyItem,
  UpdateCurrencyInput,
  AdminCouponItem,
  CreateCouponInput,
  AdminTransactionsQuery,
  AdminTransactionsResult,
} from "../types/admin.types";
import {
  fetchFinancialOverview,
  fetchAdminGateways,
  updateAdminGateway,
  fetchAdminPlans,
  upsertAdminPlan,
  deleteAdminPlan,
  updateAdminPlanQuotas,
  fetchAdminCurrencies,
  updateAdminCurrency,
  fetchAdminCoupons,
  createAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
  fetchAdminTransactions,
} from "../services/admin-financials.client";

export type FinancialSubTab =
  | "gateways"
  | "plans"
  | "quotas"
  | "currencies"
  | "coupons"
  | "transactions";

export interface FinancialFeedback {
  type: "success" | "error";
  message: string;
}

export function useAdminFinancials(initialSubTab: FinancialSubTab = "gateways") {
  const [activeSubTab, setActiveSubTab] = useState<FinancialSubTab>(initialSubTab);

  // Data states
  const [overview, setOverview] = useState<FinancialOverviewStats | null>(null);
  const [gateways, setGateways] = useState<AdminGatewayDetails[]>([]);
  const [plans, setPlans] = useState<AdminSubscriptionPlanItem[]>([]);
  const [currencies, setCurrencies] = useState<AdminCurrencyItem[]>([]);
  const [coupons, setCoupons] = useState<AdminCouponItem[]>([]);
  const [transactions, setTransactions] = useState<AdminTransactionsResult | null>(null);

  // Status & message states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FinancialFeedback | null>(null);

  const isMountedRef = useRef<boolean>(true);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  /**
   * Refreshes all financial data across all tabs simultaneously.
   */
  const refreshData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const [ovRes, gwRes, plRes, crRes, cpRes, txRes] = await Promise.allSettled([
        fetchFinancialOverview(),
        fetchAdminGateways(),
        fetchAdminPlans(),
        fetchAdminCurrencies(),
        fetchAdminCoupons(),
        fetchAdminTransactions(),
      ]);

      if (!isMountedRef.current) return;

      if (ovRes.status === "fulfilled") setOverview(ovRes.value);
      if (gwRes.status === "fulfilled") setGateways(gwRes.value);
      if (plRes.status === "fulfilled") setPlans(plRes.value);
      if (crRes.status === "fulfilled") setCurrencies(crRes.value);
      if (cpRes.status === "fulfilled") setCoupons(cpRes.value);
      if (txRes.status === "fulfilled") setTransactions(txRes.value);

      const rejected = [ovRes, gwRes, plRes, crRes, cpRes, txRes].filter(
        (r) => r.status === "rejected"
      ) as PromiseRejectedResult[];

      if (rejected.length > 0) {
        const firstError = rejected[0].reason;
        const msg =
          firstError instanceof Error
            ? firstError.message
            : "حدث خطأ أثناء تحميل بعض البيانات المالية";
        setError(msg);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg =
        err instanceof Error ? err.message : "فشل تحميل البيانات المالية";
      setError(msg);
      setFeedback({ type: "error", message: msg });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Auto-fetch all data on mount with cleanup
  useEffect(() => {
    isMountedRef.current = true;
    refreshData();
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshData]);

  /**
   * Optimistically toggles a payment gateway enabled state with rollback.
   */
  const toggleGateway = useCallback(
    async (id: string): Promise<boolean> => {
      const current = gateways.find((g) => g.id === id);
      if (!current) return false;

      const nextStatus = !current.isEnabled;
      // Optimistic update
      setGateways((prev) =>
        prev.map((g) => (g.id === id ? { ...g, isEnabled: nextStatus } : g))
      );
      setError(null);

      try {
        const updated = await updateAdminGateway({ id, isEnabled: nextStatus });
        setGateways((prev) =>
          prev.map((g) => (g.id === id ? updated : g))
        );
        setFeedback({
          type: "success",
          message: nextStatus
            ? "تم تفعيل بوابة الدفع بنجاح"
            : "تم تعطيل بوابة الدفع بنجاح",
        });
        return true;
      } catch (err) {
        // Rollback
        setGateways((prev) =>
          prev.map((g) => (g.id === id ? current : g))
        );
        const msg =
          err instanceof Error ? err.message : "فشل تعديل حالة بوابة الدفع";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      }
    },
    [gateways]
  );

  /**
   * Updates credentials, fees, and configurations of a payment gateway.
   */
  const updateGatewayConfig = useCallback(
    async (input: UpdateGatewayInput): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        const updated = await updateAdminGateway(input);
        setGateways((prev) =>
          prev.map((g) => (g.id === input.id ? updated : g))
        );
        setFeedback({
          type: "success",
          message: "تم حفظ إعدادات بوابة الدفع بنجاح",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "فشل تحديث إعدادات بوابة الدفع";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Saves or creates a subscription plan with prices and quotas.
   */
  const savePlan = useCallback(
    async (input: UpsertPlanInput): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        const saved = await upsertAdminPlan(input);
        setPlans((prev) => {
          const index = prev.findIndex(
            (p) => p.id === saved.id || p.slug === saved.slug
          );
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [...prev, saved];
        });
        setFeedback({
          type: "success",
          message: "تم حفظ باقة الاشتراك بنجاح",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "فشل حفظ باقة الاشتراك";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Deactivates or permanently deletes a subscription plan.
   */
  const deletePlan = useCallback(
    async (id: string): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        const res = await deleteAdminPlan(id);
        if (res.deactivated) {
          setPlans((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
          );
        } else {
          setPlans((prev) => prev.filter((p) => p.id !== id));
        }
        setFeedback({
          type: "success",
          message: res.message || "تم حذف أو تعطيل باقة الاشتراك",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "فشل حذف باقة الاشتراك";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Updates quotas and feature allowances for a plan.
   */
  const saveQuotas = useCallback(
    async (
      planId: string,
      quotas: Partial<AdminPlanQuotaConfig>
    ): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        await updateAdminPlanQuotas(planId, quotas);
        setPlans((prev) =>
          prev.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  quotas: {
                    ...p.quotas,
                    ...quotas,
                  },
                }
              : p
          )
        );
        setFeedback({
          type: "success",
          message: "تم تحديث حدود ومميزات الباقة بنجاح",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "فشل تحديث حدود ومميزات الباقة";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Updates currency rates, active status, or country mappings.
   */
  const saveCurrency = useCallback(
    async (code: string, input: UpdateCurrencyInput): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        const updated = await updateAdminCurrency(code, input);
        setCurrencies((prev) =>
          prev.map((c) => (c.code === code ? updated : c))
        );
        setFeedback({
          type: "success",
          message: "تم تحديث إعدادات العملة بنجاح",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "فشل تحديث إعدادات العملة";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Creates a new promotional or discount coupon.
   */
  const createCoupon = useCallback(
    async (input: CreateCouponInput): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        const created = await createAdminCoupon(input);
        setCoupons((prev) => [created, ...prev]);
        setFeedback({
          type: "success",
          message: "تم إنشاء كوبون الخصم بنجاح",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "فشل إنشاء كوبون الخصم";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Toggles the active state of a coupon with rollback.
   */
  const toggleCoupon = useCallback(
    async (id: string): Promise<boolean> => {
      const current = coupons.find((c) => c.id === id);
      if (!current) return false;

      const nextStatus = !current.isActive;
      // Optimistic update
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: nextStatus } : c))
      );
      setIsSaving(true);
      setError(null);

      try {
        const updated = await toggleAdminCoupon(id, nextStatus);
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? updated : c))
        );
        setFeedback({
          type: "success",
          message: nextStatus
            ? "تم تفعيل كوبون الخصم بنجاح"
            : "تم تعطيل كوبون الخصم بنجاح",
        });
        return true;
      } catch (err) {
        // Rollback
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? current : c))
        );
        const msg =
          err instanceof Error ? err.message : "فشل تعديل حالة الكوبون";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [coupons]
  );

  /**
   * Deletes a discount coupon.
   */
  const deleteCoupon = useCallback(
    async (id: string): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      try {
        await deleteAdminCoupon(id);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        setFeedback({
          type: "success",
          message: "تم حذف كوبون الخصم بنجاح",
        });
        return true;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "فشل حذف كوبون الخصم";
        setError(msg);
        setFeedback({ type: "error", message: msg });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Filters transactions and invoices with pagination and search.
   */
  const filterTransactions = useCallback(
    async (query: AdminTransactionsQuery): Promise<void> => {
      try {
        const res = await fetchAdminTransactions(query);
        if (isMountedRef.current) {
          setTransactions(res);
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        const msg =
          err instanceof Error ? err.message : "فشل تصفية المعاملات المالية";
        setError(msg);
        setFeedback({ type: "error", message: msg });
      }
    },
    []
  );

  return {
    activeSubTab,
    setActiveSubTab,
    overview,
    gateways,
    plans,
    currencies,
    coupons,
    transactions,
    isLoading,
    isSaving,
    error,
    feedback,
    clearFeedback,
    setFeedback,
    setError,
    toggleGateway,
    updateGatewayConfig,
    savePlan,
    deletePlan,
    saveQuotas,
    saveCurrency,
    createCoupon,
    toggleCoupon,
    deleteCoupon,
    refreshData,
    filterTransactions,
  };
}
