"use client";

import { useState, useCallback, useRef } from "react";
import type {
  AdminCurrencyItem,
  UpdateCurrencyInput,
  CreateCurrencyInput,
} from "../../types/admin.types";
import {
  updateAdminCurrency,
  createAdminCurrency,
  syncLiveExchangeRates,
  fetchAdminCurrencies,
} from "../../services/admin-financials.client";
import type { FinancialActionCallbacks } from "./types";

export function useFinancialsCurrencies(
  callbacks?: FinancialActionCallbacks,
  initialCurrencies: AdminCurrencyItem[] = []
) {
  const [currencies, setCurrencies] = useState<AdminCurrencyItem[]>(initialCurrencies);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  const saveCurrency = useCallback(
    async (code: string, input: UpdateCurrencyInput): Promise<boolean> => {
      cbRef.current?.setIsSaving?.(true);
      cbRef.current?.setError?.(null);
      try {
        const updated = await updateAdminCurrency(code, input);
        setCurrencies((prev) => prev.map((c) => (c.code === code ? updated : c)));
        cbRef.current?.setFeedback?.({ type: "success", message: "تم تحديث إعدادات العملة بنجاح" });
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "فشل تحديث إعدادات العملة";
        cbRef.current?.setError?.(msg);
        cbRef.current?.setFeedback?.({ type: "error", message: msg });
        return false;
      } finally {
        cbRef.current?.setIsSaving?.(false);
      }
    },
    []
  );

  const addCurrency = useCallback(
    async (input: CreateCurrencyInput): Promise<boolean> => {
      cbRef.current?.setIsSaving?.(true);
      cbRef.current?.setError?.(null);
      try {
        const created = await createAdminCurrency(input);
        setCurrencies((prev) => [...prev, created]);
        cbRef.current?.setFeedback?.({ type: "success", message: "تمت إضافة العملة بنجاح" });
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "فشل إضافة العملة";
        cbRef.current?.setError?.(msg);
        cbRef.current?.setFeedback?.({ type: "error", message: msg });
        return false;
      } finally {
        cbRef.current?.setIsSaving?.(false);
      }
    },
    []
  );

  const syncRates = useCallback(async (): Promise<boolean> => {
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);
    try {
      const res = await syncLiveExchangeRates();
      const fresh = await fetchAdminCurrencies();
      setCurrencies(fresh);
      cbRef.current?.setFeedback?.({
        type: "success",
        message: `تم تحديث ${res.updatedCount} عملة بأسعار الصرف المباشرة بنجاح`,
      });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل تحديث أسعار الصرف الحية";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, []);

  return { currencies, setCurrencies, saveCurrency, addCurrency, syncRates };
}
