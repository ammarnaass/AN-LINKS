"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { FinancialOverviewStats } from "../types/admin.types";
import {
  fetchFinancialOverview,
  fetchAdminGateways,
  fetchAdminPlans,
  fetchAdminCurrencies,
  fetchAdminCoupons,
  fetchAdminTransactions,
} from "../services/admin-financials.client";
import {
  useFinancialsGateways,
  useFinancialsPlans,
  useFinancialsCurrencies,
  useFinancialsCoupons,
  useFinancialsTransactions,
} from "./financials";
import type { FinancialFeedback, FinancialActionCallbacks } from "./financials";

export type FinancialSubTab =
  | "gateways"
  | "plans"
  | "quotas"
  | "currencies"
  | "coupons"
  | "transactions";

export type { FinancialFeedback, FinancialActionCallbacks };

export function useAdminFinancials(initialSubTab: FinancialSubTab = "gateways") {
  const [activeSubTab, setActiveSubTab] = useState<FinancialSubTab>(initialSubTab);
  const [overview, setOverview] = useState<FinancialOverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FinancialFeedback | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const clearFeedback = useCallback(() => setFeedback(null), []);
  const callbacks = useMemo<FinancialActionCallbacks>(
    () => ({ setIsSaving, setError, setFeedback }),
    []
  );

  const { gateways, setGateways, toggleGateway, updateGatewayConfig } = useFinancialsGateways(callbacks);
  const { plans, setPlans, savePlan, deletePlan, saveQuotas } = useFinancialsPlans(callbacks);
  const { currencies, setCurrencies, saveCurrency } = useFinancialsCurrencies(callbacks);
  const { coupons, setCoupons, createCoupon, toggleCoupon, deleteCoupon } = useFinancialsCoupons(callbacks);
  const { transactions, setTransactions, filterTransactions } = useFinancialsTransactions(callbacks);

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
        const msg = firstError instanceof Error ? firstError.message : "حدث خطأ أثناء تحميل بعض البيانات المالية";
        setError(msg);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg = err instanceof Error ? err.message : "فشل تحميل البيانات المالية";
      setError(msg);
      setFeedback({ type: "error", message: msg });
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [setGateways, setPlans, setCurrencies, setCoupons, setTransactions]);

  useEffect(() => {
    isMountedRef.current = true;
    refreshData();
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshData]);

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
