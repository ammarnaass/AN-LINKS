"use client";

import { useState, useCallback, useRef } from "react";
import type { AdminSubscriptionPlanItem, UpsertPlanInput, AdminPlanQuotaConfig } from "../../types/admin.types";
import { upsertAdminPlan, deleteAdminPlan, updateAdminPlanQuotas } from "../../services/admin-financials.client";
import type { FinancialActionCallbacks } from "./types";

export function useFinancialsPlans(
  callbacks?: FinancialActionCallbacks,
  initialPlans: AdminSubscriptionPlanItem[] = []
) {
  const [plans, setPlans] = useState<AdminSubscriptionPlanItem[]>(initialPlans);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  const savePlan = useCallback(async (input: UpsertPlanInput): Promise<boolean> => {
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);
    try {
      const saved = await upsertAdminPlan(input);
      setPlans((prev) => {
        const index = prev.findIndex((p) => p.id === saved.id || p.slug === saved.slug);
        if (index >= 0) {
          const next = [...prev];
          next[index] = saved;
          return next;
        }
        return [...prev, saved];
      });
      cbRef.current?.setFeedback?.({ type: "success", message: "تم حفظ باقة الاشتراك بنجاح" });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل حفظ باقة الاشتراك";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, []);

  const deletePlan = useCallback(async (id: string): Promise<boolean> => {
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);
    try {
      const res = await deleteAdminPlan(id);
      setPlans((prev) => res.deactivated ? prev.map((p) => (p.id === id ? { ...p, isActive: false } : p)) : prev.filter((p) => p.id !== id));
      cbRef.current?.setFeedback?.({ type: "success", message: res.message || "تم حذف أو تعطيل باقة الاشتراك" });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل حذف باقة الاشتراك";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, []);

  const saveQuotas = useCallback(
    async (planId: string, quotas: Partial<AdminPlanQuotaConfig>): Promise<boolean> => {
      cbRef.current?.setIsSaving?.(true);
      cbRef.current?.setError?.(null);
      try {
        await updateAdminPlanQuotas(planId, quotas);
        setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, quotas: { ...p.quotas, ...quotas } } : p)));
        cbRef.current?.setFeedback?.({ type: "success", message: "تم تحديث حدود ومميزات الباقة بنجاح" });
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "فشل تحديث حدود ومميزات الباقة";
        cbRef.current?.setError?.(msg);
        cbRef.current?.setFeedback?.({ type: "error", message: msg });
        return false;
      } finally {
        cbRef.current?.setIsSaving?.(false);
      }
    },
    []
  );

  return { plans, setPlans, savePlan, deletePlan, saveQuotas };
}
