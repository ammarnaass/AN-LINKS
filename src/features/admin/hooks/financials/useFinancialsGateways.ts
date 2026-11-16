"use client";

import { useState, useCallback, useRef } from "react";
import type { AdminGatewayDetails, UpdateGatewayInput } from "../../types/admin.types";
import { updateAdminGateway } from "../../services/admin-financials.client";
import type { FinancialActionCallbacks } from "./types";

export function useFinancialsGateways(
  callbacks?: FinancialActionCallbacks,
  initialGateways: AdminGatewayDetails[] = []
) {
  const [gateways, setGateways] = useState<AdminGatewayDetails[]>(initialGateways);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  const toggleGateway = useCallback(async (id: string): Promise<boolean> => {
    const current = gateways.find((g) => g.id === id);
    if (!current) return false;

    const nextStatus = !current.isEnabled;
    setGateways((prev) => prev.map((g) => (g.id === id ? { ...g, isEnabled: nextStatus } : g)));
    cbRef.current?.setError?.(null);

    try {
      const updated = await updateAdminGateway({ id, isEnabled: nextStatus });
      setGateways((prev) => prev.map((g) => (g.id === id ? updated : g)));
      cbRef.current?.setFeedback?.({
        type: "success",
        message: nextStatus ? "تم تفعيل بوابة الدفع بنجاح" : "تم تعطيل بوابة الدفع بنجاح",
      });
      return true;
    } catch (err) {
      setGateways((prev) => prev.map((g) => (g.id === id ? current : g)));
      const msg = err instanceof Error ? err.message : "فشل تعديل حالة بوابة الدفع";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    }
  }, [gateways]);

  const updateGatewayConfig = useCallback(async (input: UpdateGatewayInput): Promise<boolean> => {
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);
    try {
      const updated = await updateAdminGateway(input);
      setGateways((prev) => prev.map((g) => (g.id === input.id ? updated : g)));
      cbRef.current?.setFeedback?.({ type: "success", message: "تم حفظ إعدادات بوابة الدفع بنجاح" });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل تحديث إعدادات بوابة الدفع";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, []);

  return { gateways, setGateways, toggleGateway, updateGatewayConfig };
}
