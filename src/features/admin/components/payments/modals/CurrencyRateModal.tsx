"use client";

import React, { useState, useEffect } from "react";
import { AdminCurrencyItem, UpdateCurrencyInput } from "../../../types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { X, Coins, Save, Check, AlertCircle } from "lucide-react";

export interface CurrencyRateModalProps {
  isOpen: boolean;
  currency: AdminCurrencyItem | null;
  onClose: () => void;
  onSave: (code: string, input: UpdateCurrencyInput) => Promise<boolean>;
  isSaving?: boolean;
}

export function CurrencyRateModal({
  isOpen,
  currency,
  onClose,
  onSave,
  isSaving = false,
}: CurrencyRateModalProps) {
  const [nameAr, setNameAr] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRateToUSD, setExchangeRateToUSD] = useState<number>(1);
  const [autoDetectCountries, setAutoDetectCountries] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isBaseCurrency, setIsBaseCurrency] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (currency) {
      setNameAr(currency.nameAr || "");
      setSymbol(currency.symbol || "");
      setExchangeRateToUSD(currency.exchangeRateToUSD || 1);
      setAutoDetectCountries(currency.autoDetectCountries?.join(", ") || "");
      setIsActive(currency.isActive ?? true);
      setIsBaseCurrency(currency.isBaseCurrency ?? false);
      setStatusMessage(null);
    }
  }, [currency, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currency) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (exchangeRateToUSD <= 0) {
      setStatusMessage({ type: "error", text: "سعر الصرف مقابل الدولار يجب أن يكون أكبر من الصفر" });
      return;
    }

    const countriesArray = autoDetectCountries
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    const payload: UpdateCurrencyInput = {
      code: currency.code,
      nameAr: nameAr.trim() || undefined,
      symbol: symbol.trim() || undefined,
      exchangeRateToUSD: Number(exchangeRateToUSD),
      isActive,
      isBaseCurrency,
      autoDetectCountries: countriesArray,
    };

    const success = await onSave(currency.code, payload);
    if (success) {
      setStatusMessage({ type: "success", text: "تم تحديث إعدادات العملة بنجاح" });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: "error", text: "حدث خطأ أثناء تحديث إعدادات العملة" });
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
      aria-labelledby="currency-rate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-container-low rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-outline-variant/30 space-y-5 animate-in fade-in zoom-in duration-150 font-cairo">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 id="currency-rate-modal-title" className="font-bold text-on-surface text-base">
                تعديل سعر صرف {currency.nameAr}
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">{currency.code} ({currency.symbol})</p>
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
          <div className="grid grid-cols-2 gap-3">
            <AppInput
              label="الاسم بالعربية"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
            />
            <AppInput
              label="رمز العرض (Symbol)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>

          {/* Exchange Rate to USD */}
          <div>
            <AppInput
              label="سعر الصرف مقابل 1 دولار أمريكي (1 USD = ?)"
              type="number"
              step="0.0001"
              value={exchangeRateToUSD}
              onChange={(e) => setExchangeRateToUSD(Number(e.target.value))}
            />
            <span className="block text-[11px] text-on-surface-variant mt-1">
              مثال: 1 USD = 3.75 SAR (ريال سعودي)، أو 1 USD = 0.31 KWD (دينار كويتي)
            </span>
          </div>

          {/* Auto-detect country codes */}
          <div>
            <AppInput
              label="رموز الدول للكشف التلقائي (مفصولة بفواصل)"
              placeholder="SA, KSA"
              value={autoDetectCountries}
              onChange={(e) => setAutoDetectCountries(e.target.value)}
            />
            <span className="block text-[11px] text-on-surface-variant mt-1">
              سيتم عرض الأسعار بهذه العملة تلقائياً للمستخدمين القادمين من هذه الدول
            </span>
          </div>

          {/* Base currency & Active status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface">حالة العملة:</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {isActive ? "مفعلة" : "معطلة"}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container border border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface">العملة المرجعية:</span>
              <button
                type="button"
                onClick={() => setIsBaseCurrency(!isBaseCurrency)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isBaseCurrency
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {isBaseCurrency ? "المرجعية ★" : "تعيين كمرجع"}
              </button>
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
              حفظ سعر الصرف
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
