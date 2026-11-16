"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { AdminTransactionsQuery, AdminTransactionsResult } from "../../types/admin.types";
import { fetchAdminTransactions } from "../../services/admin-financials.client";
import type { FinancialActionCallbacks } from "./types";

export function useFinancialsTransactions(
  callbacks?: FinancialActionCallbacks,
  initialTransactions: AdminTransactionsResult | null = null
) {
  const [transactions, setTransactions] =
    useState<AdminTransactionsResult | null>(initialTransactions);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const filterTransactions = useCallback(async (query: AdminTransactionsQuery): Promise<void> => {
    try {
      const res = await fetchAdminTransactions(query);
      if (isMountedRef.current) setTransactions(res);
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg = err instanceof Error ? err.message : "فشل تصفية المعاملات المالية";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
    }
  }, []);

  return { transactions, setTransactions, filterTransactions };
}
