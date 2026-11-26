"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles, Loader2, CreditCard, ChevronLeft } from "lucide-react";
import { BrandLogo, ThemeToggle } from "@/shared/ui";
import { useCurrentUser, UserNavDropdown } from "@/features/auth";
import { PRICING_PLANS, calculatePrice } from "@/features/landing";

const PAYMENT_GATEWAYS = [
  { id: "mada", name: "مدى (Mada)", badge: "الأسرع في السعودية", icon: "💳" },
  { id: "apple_pay", name: "Apple Pay", badge: "دفع بلمسة واحدة", icon: "🍏" },
  { id: "stc_pay", name: "STC Pay", icon: "📱" },
  { id: "stripe", name: "بطاقة ائتمانية / Visa & MC", icon: "💳" },
  { id: "tamara", name: "تمارا (قسمها 4 دفعات)", badge: "بدون فوائد", icon: "✨" },
  { id: "tabby", name: "تابي (قسمها 4 دفعات)", badge: "بدون رسوم", icon: "🛍️" },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useCurrentUser();

  const planParam = searchParams.get("plan") || "pro";
  const billingParam = searchParams.get("billing");

  const [isYearly, setIsYearly] = useState(billingParam === "yearly");
  const [selectedGateway, setSelectedGateway] = useState("mada");
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const matchedPlan = PRICING_PLANS.find((p) => p.id === planParam && p.priceMonthly > 0) || PRICING_PLANS[1];

  const monthlyPrice = calculatePrice(matchedPlan, false);
  const yearlyMonthlyPrice = calculatePrice(matchedPlan, true);
  const currentPrice = isYearly ? yearlyMonthlyPrice * 12 : monthlyPrice;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-on-surface-variant font-bold">جارٍ تحميل بيانات الاشتراك...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const callback = `/checkout?plan=${matchedPlan.id}&billing=${isYearly ? "yearly" : "monthly"}`;
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-surface-container border border-outline-variant/30 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-on-surface">تسجيل الدخول مطلوب للمتابعة</h2>
        <p className="text-xs text-on-surface-variant">يُرجى تسجيل الدخول أو إنشاء حساب لربط خطة {matchedPlan.name} بحسابك.</p>
        <Link href={`/login?callbackUrl=${encodeURIComponent(callback)}`} className="block w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:brightness-110 transition-all">
          تسجيل الدخول للمتابعة
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: matchedPlan.id,
          interval: isYearly ? "yearly" : "monthly",
          gatewayId: selectedGateway,
          couponCode: couponCode.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل إتمام طلب الاشتراك");
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

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 rounded-3xl bg-surface-container border border-outline-variant/30 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center border-2 border-primary">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h2 className="text-2xl font-black text-on-surface">تم تفعيل اشتراكك بنجاح! 🎉</h2>
        <p className="text-sm text-on-surface-variant">
          تم ترقية حسابك إلى خطة <strong className="text-primary font-bold">{matchedPlan.name}</strong> فوراً.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:brightness-110">
            الانتقال إلى لوحة التحكم
          </Link>
          <Link href="/dashboard/settings?tab=subscription" className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest">
            إدارة الاشتراك والفواتير
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Plan Details & Features */}
      <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-md">
        <div>
          <span className="text-xs font-bold text-primary">{matchedPlan.tag}</span>
          <h2 className="text-2xl font-black text-on-surface mt-1">{matchedPlan.name}</h2>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{matchedPlan.description}</p>
        </div>

        <div className="pt-2 pb-4 border-b border-outline-variant/15 flex items-baseline gap-2">
          <span className="text-4xl font-black text-on-surface font-mono">${currentPrice}</span>
          <span className="text-xs text-on-surface-variant">/ {isYearly ? "سنوياً" : "شهرياً"}</span>
        </div>

        <ul className="space-y-2.5 text-xs text-on-surface-variant">
          {matchedPlan.features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="leading-snug text-on-surface">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Checkout Form */}
      <div className="lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-surface-container border border-outline-variant/30 space-y-5 shadow-xl">
        <h3 className="text-lg font-black text-on-surface">إعدادات الدفع والفاتورة</h3>

        <div className="p-1 rounded-2xl bg-surface-container-high flex gap-1">
          <button type="button" onClick={() => setIsYearly(false)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${!isYearly ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant"}`}>
            دفع شهري (${monthlyPrice}/شهر)
          </button>
          <button type="button" onClick={() => setIsYearly(true)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isYearly ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant"}`}>
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
          <input type="text" placeholder="كود الخصم مثل SAUDI2026" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-outline-variant/30 bg-surface text-on-surface text-xs focus:outline-none focus:border-primary font-mono" />
        </div>

        {errorMessage && <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-xs font-bold">{errorMessage}</div>}

        <div className="space-y-2.5 pt-2">
          <button type="button" onClick={handleCheckout} disabled={isSubmitting} className="w-full py-3.5 px-6 rounded-xl font-black text-sm bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جارٍ معالجة الدفع والاشتراك...</span>
              </>
            ) : (
              <>
                <span>تأكيد الدفع والاشتراك (${currentPrice})</span>
                <ChevronLeft className="w-4 h-4" />
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>دفع مشفر وآمن 100% متوافق مع معايير PCI-DSS والبنك المركزي</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-cairo" dir="rtl">
      <header className="h-20 w-full border-b border-outline-variant/15 px-6 lg:px-12 flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <BrandLogo href="/" variant="full" size="md" />
          <Link href="/pricing" className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لجدول الأسعار</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserNavDropdown />
        </div>
      </header>
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-on-surface-variant">جارٍ التحميل...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
    </div>
  );
}
