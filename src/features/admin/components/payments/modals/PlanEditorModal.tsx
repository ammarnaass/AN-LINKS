"use client";

import React, { useState, useEffect } from "react";
import {
  AdminSubscriptionPlanItem,
  UpsertPlanInput,
  AdminPlanPriceItem,
} from "../../../types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { X, Layers, Save, Check, AlertCircle } from "lucide-react";

export interface PlanEditorModalProps {
  isOpen: boolean;
  plan?: AdminSubscriptionPlanItem | null;
  onClose: () => void;
  onSave: (input: UpsertPlanInput) => Promise<boolean>;
  isSaving?: boolean;
}

interface PriceState {
  monthly: number;
  yearly: number;
}

const SUPPORTED_PLAN_CURRENCIES = ["SAR", "USD", "AED", "EGP"] as const;

export function PlanEditorModal({
  isOpen,
  plan,
  onClose,
  onSave,
  isSaving = false,
}: PlanEditorModalProps) {
  const isEditing = Boolean(plan && plan.id);

  const [slug, setSlug] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [badgeAr, setBadgeAr] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Pricing matrix state by currency
  const [pricesState, setPricesState] = useState<Record<string, PriceState>>({
    SAR: { monthly: 0, yearly: 0 },
    USD: { monthly: 0, yearly: 0 },
    AED: { monthly: 0, yearly: 0 },
    EGP: { monthly: 0, yearly: 0 },
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (plan) {
      setSlug(plan.slug || "");
      setNameAr(plan.nameAr || "");
      setNameEn(plan.nameEn || "");
      setDescriptionAr(plan.descriptionAr || "");
      setBadgeAr(plan.badgeAr || "");
      setSortOrder(plan.sortOrder ?? 0);
      setIsActive(plan.isActive ?? true);

      // Map prices
      const initialPrices: Record<string, PriceState> = {
        SAR: { monthly: 0, yearly: 0 },
        USD: { monthly: 0, yearly: 0 },
        AED: { monthly: 0, yearly: 0 },
        EGP: { monthly: 0, yearly: 0 },
      };

      if (plan.prices) {
        plan.prices.forEach((p) => {
          const curr = p.currency.toUpperCase();
          if (!initialPrices[curr]) {
            initialPrices[curr] = { monthly: 0, yearly: 0 };
          }
          if (p.billingCycle === "MONTHLY") {
            initialPrices[curr].monthly = p.amount;
          } else if (p.billingCycle === "YEARLY") {
            initialPrices[curr].yearly = p.amount;
          }
        });
      }
      setPricesState(initialPrices);
      setStatusMessage(null);
    } else {
      setSlug("");
      setNameAr("");
      setNameEn("");
      setDescriptionAr("");
      setBadgeAr("");
      setSortOrder(0);
      setIsActive(true);
      setPricesState({
        SAR: { monthly: 0, yearly: 0 },
        USD: { monthly: 0, yearly: 0 },
        AED: { monthly: 0, yearly: 0 },
        EGP: { monthly: 0, yearly: 0 },
      });
      setStatusMessage(null);
    }
  }, [plan, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePriceChange = (
    currency: string,
    cycle: "monthly" | "yearly",
    val: number
  ) => {
    setPricesState((prev) => ({
      ...prev,
      [currency]: {
        ...prev[currency],
        [cycle]: val,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!slug.trim() || !nameAr.trim()) {
      setStatusMessage({
        type: "error",
        text: "يرجى ملء معرف الباقة والاسم العربي",
      });
      return;
    }

    // Convert pricesState to AdminPlanPriceItem[]
    const formattedPrices: AdminPlanPriceItem[] = [];
    Object.entries(pricesState).forEach(([currency, amounts]) => {
      formattedPrices.push({
        currency,
        billingCycle: "MONTHLY",
        amount: Number(amounts.monthly) || 0,
        isActive: true,
      });
      formattedPrices.push({
        currency,
        billingCycle: "YEARLY",
        amount: Number(amounts.yearly) || 0,
        isActive: true,
      });
    });

    const payload: UpsertPlanInput = {
      id: plan?.id,
      slug: slug.trim().toLowerCase(),
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || slug.trim(),
      descriptionAr: descriptionAr.trim(),
      badgeAr: badgeAr.trim() || undefined,
      sortOrder: Number(sortOrder),
      isActive,
      prices: formattedPrices,
      quotas: plan?.quotas,
    };

    const success = await onSave(payload);
    if (success) {
      setStatusMessage({ type: "success", text: "تم حفظ الباقة بنجاح" });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء حفظ الباقة" });
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
      aria-labelledby="plan-editor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 id="plan-editor-modal-title" className="font-bold text-on-surface text-base">
                {isEditing ? `تعديل باقة ${nameAr || plan?.nameAr}` : "إضافة باقة اشتراك جديدة"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                تحديد مواصفات وأسعار الباقة في مختلف العملات
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
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label="المعرف الفريد (Slug)"
              placeholder="pro, creator, agency..."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isEditing}
            />
            <AppInput
              label="الاسم بالعربية"
              placeholder="باقة المحترفين"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AppInput
              label="الاسم بالإنجليزية"
              placeholder="Pro Plan"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
            <AppInput
              label="شارة مميزة (Badge)"
              placeholder="الأكثر طلباً، خصم 20%..."
              value={badgeAr}
              onChange={(e) => setBadgeAr(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">
              وصف مختصر للباقة
            </label>
            <textarea
              rows={2}
              placeholder="مناسبة لصناع المحتوى وأصحاب المشاريع الناشئة..."
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/40 bg-surface-container text-on-surface text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <AppInput
              label="ترتيب الظهور (Sort Order)"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
            <div className="flex items-center gap-3 pt-4">
              <label className="text-xs font-bold text-on-surface">حالة الباقة:</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {isActive ? "نشطة ومتاحة" : "معطلة أو مسودة"}
              </button>
            </div>
          </div>

          {/* Pricing Matrix */}
          <div className="pt-2 border-t border-outline-variant/20 space-y-3">
            <h4 className="text-xs font-bold text-on-surface">مصفوفة التسعير متعددة العملات:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUPPORTED_PLAN_CURRENCIES.map((curr) => (
                <div
                  key={curr}
                  className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-2"
                >
                  <span className="font-mono font-bold text-xs text-primary">{curr}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-on-surface-variant mb-1">شهرياً</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricesState[curr]?.monthly || 0}
                        onChange={(e) =>
                          handlePriceChange(curr, "monthly", Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-on-surface-variant mb-1">سنوياً</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pricesState[curr]?.yearly || 0}
                        onChange={(e) =>
                          handlePriceChange(curr, "yearly", Number(e.target.value))
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface text-xs font-mono outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isEditing ? "حفظ تعديلات الباقة" : "إضافة الباقة"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
