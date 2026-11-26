"use client";

import React, { useState, useEffect } from "react";
import { CreateCurrencyInput } from "../../../types/admin.types";
import { AppButton } from "@/shared/ui";
import { X, Plus, AlertCircle, Coins } from "lucide-react";

export interface NewCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (input: CreateCurrencyInput) => Promise<boolean>;
  isSaving?: boolean;
}

export function NewCurrencyModal({
  isOpen,
  onClose,
  onAdd,
  isSaving = false,
}: NewCurrencyModalProps) {
  const [code, setCode] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRateToUSD, setExchangeRateToUSD] = useState<number>(1.0);
  const [autoDetectCountries, setAutoDetectCountries] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isBaseCurrency, setIsBaseCurrency] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setNameAr("");
      setSymbol("");
      setExchangeRateToUSD(1.0);
      setAutoDetectCountries("");
      setIsActive(true);
      setIsBaseCurrency(false);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 2 || cleanCode.length > 5) {
      setStatusMessage({ type: "error", text: "رمز العملة يجب أن يكون بين 2 إلى 5 أحرف (مثل QAR)" });
      return;
    }
    if (!nameAr.trim() || !symbol.trim() || exchangeRateToUSD <= 0) {
      setStatusMessage({ type: "error", text: "يرجى تعبئة كافة الحقول بشكل صحيح وسعر صرف أكبر من صفر" });
      return;
    }

    const countries = autoDetectCountries.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean);
    const payload: CreateCurrencyInput = {
      code: cleanCode,
      nameAr: nameAr.trim(),
      symbol: symbol.trim(),
      exchangeRateToUSD: Number(exchangeRateToUSD),
      isActive,
      isBaseCurrency,
      autoDetectCountries: countries,
    };

    const success = await onAdd(payload);
    if (success) {
      setStatusMessage({ type: "success", text: "تمت إضافة العملة بنجاح" });
      setTimeout(() => onClose(), 800);
    } else {
      setStatusMessage({ type: "error", text: "فشل إضافة العملة، قد يكون الرمز مسجلاً مسبقاً" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-cairo" dir="rtl" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-md rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} type="button" aria-label="إغلاق النافذة" className="absolute top-5 left-5 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-outline-variant/20">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-on-surface">إضافة عملة جديدة</h3>
            <p className="text-xs text-on-surface-variant">تهيئة عملة عالمية جديدة وحساب سعر الصرف للـ USD</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-on-surface block mb-1">رمز العملة (ISO 4217):</label>
            <input type="text" placeholder="مثال: QAR, KWD, BHD" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface font-mono text-sm focus:outline-none focus:border-primary uppercase" maxLength={5} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">الاسم بالعربية:</label>
              <input type="text" placeholder="ريال قطري" value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface text-xs focus:outline-none focus:border-primary" required />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">رمز العرض:</label>
              <input type="text" placeholder="ر.ق" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface font-mono text-xs focus:outline-none focus:border-primary" required />
            </div>
          </div>

          <div>
            <label className="font-bold text-on-surface block mb-1">سعر الصرف الفعلي (1 USD =):</label>
            <input type="number" step="0.0001" min="0.0001" placeholder="3.64" value={exchangeRateToUSD} onChange={(e) => setExchangeRateToUSD(parseFloat(e.target.value) || 0)} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface font-mono text-xs focus:outline-none focus:border-primary" required />
            <span className="text-[10px] text-on-surface-variant mt-1 block">القيمة بالعملة المحلية مقابل دولار أمريكي واحد.</span>
          </div>

          <div>
            <label className="font-bold text-on-surface block mb-1">رموز الدول للكشف التلقائي (مفصولة بفواصل):</label>
            <input type="text" placeholder="QA, QA-DOH" value={autoDetectCountries} onChange={(e) => setAutoDetectCountries(e.target.value.toUpperCase())} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface font-mono text-xs focus:outline-none focus:border-primary uppercase" />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
              <span className="font-bold text-on-surface text-xs">تفعيل العملة للدفع</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isBaseCurrency} onChange={(e) => setIsBaseCurrency(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
              <span className="font-bold text-on-surface text-xs">تعيين كعملة مرجعية</span>
            </label>
          </div>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${statusMessage.type === "success" ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"}`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="pt-2">
            <AppButton type="submit" variant="primary" className="w-full py-2.5 rounded-xl font-bold text-xs" disabled={isSaving}>
              <Plus className="w-4 h-4 ml-1.5" />
              <span>{isSaving ? "جارٍ حفظ العملة..." : "إضافة العملة إلى المنصة"}</span>
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
