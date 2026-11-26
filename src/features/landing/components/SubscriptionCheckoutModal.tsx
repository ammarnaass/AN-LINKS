"use client";

import React, { useState, useEffect } from "react";
import { X, Check, ShieldCheck, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { PricingPlan } from "../types/pricing.types";
import { calculatePrice } from "../constants/pricing-plans";

export interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan | null;
  initialBilling?: boolean;
}

const PAYMENT_GATEWAYS = [
  { id: "mada", name: "مدى (Mada)", badge: "الأسرع في السعودية", icon: "💳" },
  { id: "apple_pay", name: "Apple Pay", badge: "دفع بلمسة واحدة", icon: "🍏" },
  { id: "stc_pay", name: "STC Pay", icon: "📱" },
  { id: "stripe", name: "بطاقة ائتمانية / Visa & MC", icon: "💳" },
  { id: "tamara", name: "تمارا (4 دفعات)", badge: "بدون فوائد", icon: "✨" },
  { id: "tabby", name: "تابي (4 دفعات)", badge: "بدون رسوم", icon: "🛍️" },
];

export function SubscriptionCheckoutModal({
  isOpen,
  onClose,
  plan,
  initialBilling = false,
}: SubscriptionCheckoutModalProps) {
  const [isYearly, setIsYearly] = useState(initialBilling);
  const [selectedGateway, setSelectedGateway] = useState("mada");
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsYearly(initialBilling);
    setIsSuccess(false);
    setErrorMessage(null);
  }, [initialBilling, isOpen]);

  if (!isOpen || !plan) return null;

  const monthlyPrice = calculatePrice(plan, false);
  const yearlyMonthlyPrice = calculatePrice(plan, true);
  const currentPrice = isYearly ? yearlyMonthlyPrice * 12 : monthlyPrice;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: plan.id,
          interval: isYearly ? "yearly" : "monthly",
          gatewayId: selectedGateway,
          couponCode: couponCode.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إنشاء طلب الاشتراك");
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      if (data.activated || data.success) setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ غير متوقع أثناء الدفع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-cairo" dir="rtl">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} type="button" aria-label="إغلاق النافذة" className="absolute top-5 left-5 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center border-2 border-primary animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-on-surface">تم تفعيل اشتراكك بنجاح! 🎉</h3>
            <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
              أهلاً بك في باقة <strong className="text-primary font-bold">{plan.name}</strong>. تمت ترقية حسابك وتفعيل كافة الميزات فوراً.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard" onClick={onClose} className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-lg hover:brightness-110 text-center">
                الانتقال للوحة التحكم
              </Link>
              <Link href="/dashboard/settings?tab=subscription" onClick={onClose} className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm text-center">
                إدارة الاشتراك والفواتير
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>إتمام الاشتراك والدفع</span>
              </div>
              <h3 className="text-2xl font-black text-on-surface">{plan.name}</h3>
              <p className="text-xs text-on-surface-variant mt-1">{plan.description}</p>
            </div>

            <div className="p-1 rounded-2xl bg-surface-container-high flex gap-1">
              <button type="button" onClick={() => setIsYearly(false)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isYearly ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
                دفع شهري (${monthlyPrice}/شهر)
              </button>
              <button type="button" onClick={() => setIsYearly(true)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isYearly ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
                <span>دفع سنوي (${yearlyMonthlyPrice}/شهر)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary/20 text-primary font-black">وفر 20%</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface block">اختر وسيلة الدفع المفضلة:</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_GATEWAYS.map((gw) => (
                  <button key={gw.id} type="button" onClick={() => setSelectedGateway(gw.id)} className={`flex items-center gap-2 p-2.5 rounded-xl border text-right transition-all cursor-pointer ${selectedGateway === gw.id ? "border-primary bg-primary/10 text-primary ring-1 ring-primary shadow-xs" : "border-outline-variant/30 bg-surface-container-low hover:bg-surface-container text-on-surface"}`}>
                    <span className="text-base">{gw.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{gw.name}</div>
                      {gw.badge && <div className="text-[10px] text-primary font-semibold">{gw.badge}</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface block">كوبون الخصم (اختياري):</label>
              <input type="text" placeholder="أدخل كود الخصم مثل SAUDI2026" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface text-on-surface text-xs focus:outline-none focus:border-primary font-mono" />
            </div>

            <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-1.5 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>الاشتراك المختار:</span>
                <span className="font-bold text-on-surface">{isYearly ? "سنوي (12 شهراً)" : "شهري"}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-on-surface pt-1 border-t border-outline-variant/15">
                <span>المبلغ الإجمالي المستحق:</span>
                <span className="text-primary font-mono">${currentPrice}</span>
              </div>
            </div>

            {errorMessage && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-bold">{errorMessage}</div>}

            <div className="space-y-2.5">
              <button type="button" onClick={handleCheckout} disabled={isSubmitting} className="w-full py-3 px-6 rounded-xl font-black text-sm bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ معالجة الدفع والاشتراك...</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد الدفع والاشتراك (${currentPrice})</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>دفع مشفر وآمن 100% متوافق مع معايير PCI-DSS والبنك المركزي</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
