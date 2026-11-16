"use client";

import React, { useState, useEffect } from "react";
import { AdminSubscriptionPlanItem, UpsertPlanInput } from "../../../types/admin.types";
import { AppButton } from "@/shared/ui";
import { X, Layers, Save, Check, AlertCircle } from "lucide-react";
import { PlanGeneralFields, PlanGeneralData, INITIAL_PLAN_GENERAL } from "./plans/PlanGeneralFields";
import {
  PlanPricingMatrix,
  PriceState,
  DEFAULT_PLAN_PRICES,
  extractPlanPrices,
  formatPricesState,
} from "./plans/PlanPricingMatrix";

export interface PlanEditorModalProps {
  isOpen: boolean;
  plan?: AdminSubscriptionPlanItem | null;
  onClose: () => void;
  onSave: (input: UpsertPlanInput) => Promise<boolean>;
  isSaving?: boolean;
}

export function PlanEditorModal({
  isOpen, plan, onClose, onSave, isSaving = false,
}: PlanEditorModalProps) {
  const isEditing = Boolean(plan && plan.id);
  const [general, setGeneral] = useState<PlanGeneralData>(INITIAL_PLAN_GENERAL);
  const [pricesState, setPricesState] = useState<Record<string, PriceState>>(DEFAULT_PLAN_PRICES);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (plan) {
      setGeneral({
        slug: plan.slug || "", nameAr: plan.nameAr || "", nameEn: plan.nameEn || "", descriptionAr: plan.descriptionAr || "",
        badgeAr: plan.badgeAr || "", sortOrder: plan.sortOrder ?? 0, isActive: plan.isActive ?? true,
      });
      setPricesState(extractPlanPrices(plan.prices));
    } else {
      setGeneral(INITIAL_PLAN_GENERAL);
      setPricesState(DEFAULT_PLAN_PRICES);
    }
    setStatusMessage(null);
  }, [plan, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!general.slug.trim() || !general.nameAr.trim()) {
      setStatusMessage({ type: "error", text: "يرجى ملء معرف الباقة والاسم العربي" });
      return;
    }
    const success = await onSave({
      id: plan?.id, slug: general.slug.trim().toLowerCase(),
      nameAr: general.nameAr.trim(), nameEn: general.nameEn.trim() || general.slug.trim(),
      descriptionAr: general.descriptionAr.trim(), badgeAr: general.badgeAr.trim() || undefined,
      sortOrder: Number(general.sortOrder), isActive: general.isActive,
      prices: formatPricesState(pricesState), quotas: plan?.quotas,
    });
    if (success) {
      setStatusMessage({ type: "success", text: "تم حفظ الباقة بنجاح" });
      setTimeout(() => onClose(), 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء حفظ الباقة" });
    }
  };

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="plan-editor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 id="plan-editor-modal-title" className="font-bold text-on-surface text-base">
                {isEditing ? `تعديل باقة ${general.nameAr || plan?.nameAr}` : "إضافة باقة اشتراك جديدة"}
              </h3>
              <p className="text-xs text-on-surface-variant">تحديد مواصفات وأسعار الباقة في مختلف العملات</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer" aria-label="إغلاق النافذة">
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${statusMessage.type === "success" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-error/15 text-error border border-error/30"}`}>
            {statusMessage.type === "success" ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PlanGeneralFields data={general} onChange={(key, val) => setGeneral((p) => ({ ...p, [key]: val }))} isEditing={isEditing} />
          <PlanPricingMatrix pricesState={pricesState} onPriceChange={(c, cy, v) => setPricesState((p) => ({ ...p, [c]: { ...p[c], [cy]: v } }))} />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
              إلغاء
            </button>
            <AppButton type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              {isEditing ? "حفظ تعديلات الباقة" : "إضافة الباقة"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanEditorModal;
