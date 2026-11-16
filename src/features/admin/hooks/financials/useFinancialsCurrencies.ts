"use client";

import { useState, useCallback, useRef } from "react";
import type { AdminCurrencyItem, UpdateCurrencyInput } from "../../types/admin.types";
import { updateAdminCurrency } from "../../services/admin-financials.client";
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

  return { currencies, setCurrencies, saveCurrency };
}
