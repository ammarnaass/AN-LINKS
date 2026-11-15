"use client";

import React, { useState, useEffect } from "react";
import { CreateCouponInput } from "../../../types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { X, Tag, Plus, Check, AlertCircle } from "lucide-react";

export interface CouponEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: CreateCouponInput) => Promise<boolean>;
  availablePlanSlugs?: Array<{ slug: string; nameAr: string }>;
  isSaving?: boolean;
}

const DEFAULT_PLANS = [
  { slug: "creator", nameAr: "صانع المحتوى" },
  { slug: "pro", nameAr: "المحترف" },
  { slug: "agency", nameAr: "الوكالات" },
];

export function CouponEditorModal({
  isOpen,
  onClose,
  onSave,
  availablePlanSlugs = DEFAULT_PLANS,
  isSaving = false,
}: CouponEditorModalProps) {
  const [code, setCode] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [maxUses, setMaxUses] = useState<string>("");
  const [maxUsesPerUser, setMaxUsesPerUser] = useState<number>(1);
  const [validFrom, setValidFrom] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [validUntil, setValidUntil] = useState<string>("");
  const [selectedPlanSlugs, setSelectedPlanSlugs] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setDescriptionAr("");
      setDiscountType("PERCENTAGE");
      setDiscountValue(10);
      setMaxUses("");
      setMaxUsesPerUser(1);
      setValidFrom(new Date().toISOString().split("T")[0]);
      setValidUntil("");
      setSelectedPlanSlugs([]);
      setStatusMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePlanSlug = (slug: string) => {
    setSelectedPlanSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setStatusMessage({ type: "error", text: "يرجى إدخال رمز كود الخصم" });
      return;
    }

    if (discountValue <= 0) {
      setStatusMessage({ type: "error", text: "قيمة الخصم يجب أن تكون أكبر من صفر" });
      return;
    }

    const payload: CreateCouponInput = {
      code: cleanCode,
      descriptionAr: descriptionAr.trim() || undefined,
      discountType,
      discountValue: Number(discountValue),
      maxUses: maxUses ? Number(maxUses) : undefined,
      maxUsesPerUser: Number(maxUsesPerUser) || 1,
      validFrom: validFrom ? new Date(validFrom).toISOString() : new Date().toISOString(),
      validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
      applicablePlanSlugs: selectedPlanSlugs.length > 0 ? selectedPlanSlugs : undefined,
    };

    const success = await onSave(payload);
    if (success) {
      setStatusMessage({ type: "success", text: "تم إنشاء كود الخصم بنجاح" });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء إنشاء كود الخصم" });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-editor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="coupon-editor-modal-title" className="font-bold text-on-surface text-base">
                إنشاء كود خصم جديد
              </h3>
              <p className="text-xs text-on-surface-variant">
                تحديد نسبة الخصم والمدة والقيود على الاستخدام
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-error/15 text-error border border-error/30"
            }`}
          >
            {statusMessage.type === "success" ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label="رمز الكود (Coupon Code)"
              placeholder="مثلاً: RAMADAN25"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <AppInput
              label="الوصف بالعربية (اختياري)"
              placeholder="خصم شهر رمضان المبارك"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                نوع الخصم
              </label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as "PERCENTAGE" | "FIXED_AMOUNT")
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="PERCENTAGE">نسبة مئوية (%)</option>
                <option value="FIXED_AMOUNT">مبلغ ثابت (SAR)</option>
              </select>
            </div>
            <AppInput
              label={discountType === "PERCENTAGE" ? "نسبة الخصم (%)" : "المبلغ المخصوم (SAR)"}
              type="number"
              step="0.01"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-3">
            <AppInput
              label="أقصى عدد استخدام كلي (اتركه فارغاً لغير محدود)"
              type="number"
              placeholder="غير محدود"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
            />
            <AppInput
              label="أقصى استخدام لكل عميل"
              type="number"
              value={maxUsesPerUser}
              onChange={(e) => setMaxUsesPerUser(Number(e.target.value))}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <AppInput
              label="صالح من تاريخ"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
            <AppInput
              label="صالح حتى تاريخ (اختياري)"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>

          {/* Applicable Plans */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-on-surface">
              الباقات المشمولة بالخصم (اختياري، اتركه غير محدد لتطبيقه على كل الباقات)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {availablePlanSlugs.map((p) => {
                const isSelected = selectedPlanSlugs.includes(p.slug);
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => togglePlanSlug(p.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/30"
                    }`}
                  >
                    {p.nameAr} ({p.slug})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <AppButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              إنشاء كود الخصم
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
