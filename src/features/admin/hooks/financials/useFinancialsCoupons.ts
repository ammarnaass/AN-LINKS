"use client";

import { useState, useCallback, useRef } from "react";
import type { AdminCouponItem, CreateCouponInput } from "../../types/admin.types";
import {
  createAdminCoupon,
  toggleAdminCoupon,
  deleteAdminCoupon,
} from "../../services/admin-financials.client";
import type { FinancialActionCallbacks } from "./types";

export function useFinancialsCoupons(
  callbacks?: FinancialActionCallbacks,
  initialCoupons: AdminCouponItem[] = []
) {
  const [coupons, setCoupons] = useState<AdminCouponItem[]>(initialCoupons);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  const createCoupon = useCallback(async (input: CreateCouponInput): Promise<boolean> => {
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);
    try {
      const created = await createAdminCoupon(input);
      setCoupons((prev) => [created, ...prev]);
      cbRef.current?.setFeedback?.({ type: "success", message: "تم إنشاء كوبون الخصم بنجاح" });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل إنشاء كوبون الخصم";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, []);

  const toggleCoupon = useCallback(async (id: string): Promise<boolean> => {
    const current = coupons.find((c) => c.id === id);
    if (!current) return false;

    const nextStatus = !current.isActive;
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: nextStatus } : c)));
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);

    try {
      const updated = await toggleAdminCoupon(id, nextStatus);
      setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
      cbRef.current?.setFeedback?.({
        type: "success",
        message: nextStatus ? "تم تفعيل كوبون الخصم بنجاح" : "تم تعطيل كوبون الخصم بنجاح",
      });
      return true;
    } catch (err) {
      setCoupons((prev) => prev.map((c) => (c.id === id ? current : c)));
      const msg = err instanceof Error ? err.message : "فشل تعديل حالة الكوبون";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, [coupons]);

  const deleteCoupon = useCallback(async (id: string): Promise<boolean> => {
    cbRef.current?.setIsSaving?.(true);
    cbRef.current?.setError?.(null);
    try {
      await deleteAdminCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      cbRef.current?.setFeedback?.({ type: "success", message: "تم حذف كوبون الخصم بنجاح" });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "فشل حذف كوبون الخصم";
      cbRef.current?.setError?.(msg);
      cbRef.current?.setFeedback?.({ type: "error", message: msg });
      return false;
    } finally {
      cbRef.current?.setIsSaving?.(false);
    }
  }, []);

  return { coupons, setCoupons, createCoupon, toggleCoupon, deleteCoupon };
}
