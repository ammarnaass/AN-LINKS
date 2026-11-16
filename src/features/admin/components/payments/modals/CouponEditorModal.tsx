"use client";

import React, { useState, useEffect } from "react";
import { CreateCouponInput } from "../../../types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { X, Tag, Plus, Check, AlertCircle } from "lucide-react";
import { CouponDiscountFields, CouponDiscountData, INITIAL_COUPON_DISCOUNT } from "./coupons/CouponDiscountFields";
import { CouponPlanSelector, DEFAULT_PLAN_SLUGS, PlanSlugItem } from "./coupons/CouponPlanSelector";

export interface CouponEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateCouponInput) => Promise<boolean>;
  availablePlanSlugs?: PlanSlugItem[];
  isSaving?: boolean;
}

export function CouponEditorModal({
  isOpen, onClose, onSave, availablePlanSlugs = DEFAULT_PLAN_SLUGS, isSaving = false,
}: CouponEditorModalProps) {
  const [code, setCode] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [discount, setDiscount] = useState<CouponDiscountData>(INITIAL_COUPON_DISCOUNT);
  const [selectedPlanSlugs, setSelectedPlanSlugs] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCode(""); setDescriptionAr(""); setDiscount(INITIAL_COUPON_DISCOUNT); setSelectedPlanSlugs([]);
      setStatusMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePlanSlug = (slug: string) => {
    setSelectedPlanSlugs((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setStatusMessage({ type: "error", text: "يرجى إدخال رمز كود الخصم" });
      return;
    }
    if (discount.discountValue <= 0) {
      setStatusMessage({ type: "error", text: "قيمة الخصم يجب أن تكون أكبر من صفر" });
      return;
    }
    const success = await onSave({
      code: cleanCode, descriptionAr: descriptionAr.trim() || undefined,
      discountType: discount.discountType, discountValue: Number(discount.discountValue),
      maxUses: discount.maxUses ? Number(discount.maxUses) : undefined, maxUsesPerUser: Number(discount.maxUsesPerUser) || 1,
      validFrom: discount.validFrom ? new Date(discount.validFrom).toISOString() : new Date().toISOString(),
      validUntil: discount.validUntil ? new Date(discount.validUntil).toISOString() : undefined,
      applicablePlanSlugs: selectedPlanSlugs.length > 0 ? selectedPlanSlugs : undefined,
    });
    if (success) {
      setStatusMessage({ type: "success", text: "تم إنشاء كود الخصم بنجاح" });
      setTimeout(() => onClose(), 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء إنشاء كود الخصم" });
    }
  };

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="coupon-editor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Tag className="w-5 h-5" /></div>
            <div>
              <h3 id="coupon-editor-modal-title" className="font-bold text-on-surface text-base">إنشاء كود خصم جديد</h3>
              <p className="text-xs text-on-surface-variant">تحديد نسبة الخصم والمدة والقيود على الاستخدام</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer" aria-label="إغلاق النافذة"><X className="w-5 h-5" /></button>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${statusMessage.type === "success" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-error/15 text-error border border-error/30"}`}>
            {statusMessage.type === "success" ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput label="رمز الكود (Coupon Code)" placeholder="مثلاً: RAMADAN25" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <AppInput label="الوصف بالعربية (اختياري)" placeholder="خصم شهر رمضان المبارك" value={descriptionAr} onChange={(e) => setDescriptionAr(e.target.value)} />
          </div>
          <CouponDiscountFields data={discount} onChange={(k, v) => setDiscount((p) => ({ ...p, [k]: v }))} />
          <CouponPlanSelector availablePlanSlugs={availablePlanSlugs} selectedPlanSlugs={selectedPlanSlugs} onTogglePlanSlug={togglePlanSlug} />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">إلغاء</button>
            <AppButton type="submit" variant="primary" size="sm" isLoading={isSaving} leftIcon={<Plus className="w-4 h-4" />}>إنشاء كود الخصم</AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CouponEditorModal;
