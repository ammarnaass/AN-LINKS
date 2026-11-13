"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sanitizeClaimUsername } from "@/lib/claim-validator";
import { Zap, CheckCircle2, Star, CreditCard } from "lucide-react";

export function HeroSection() {
  const [handle, setHandle] = useState("faisal");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const result = sanitizeClaimUsername(handle);

    if (!result.isValid && result.error) {
      setError(result.error);
      return;
    }

    setError(null);
    router.push(result.targetUrl);
  };

  const displayHandle = handle.trim() ? handle.toLowerCase().replace(/[^a-z0-9_-]/g, "") : "yourname";

  return (
    <section className="relative w-full pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 flex flex-col items-center justify-center text-on-surface overflow-hidden">
      {/* Atmospheric Ambient Glows (Stitch _6) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[360px] h-[360px] bg-secondary-container/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 left-1/4 w-[280px] h-[280px] bg-tertiary-container/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Centered Header Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-high/80 border border-white/5 backdrop-blur-md shadow-sm mb-6">
        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">
          ✨ المنصة العربية الأولى لروابط البايو الذكية والتفاعلية
        </span>
      </div>

      {/* Main Hero Headlines */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl text-center font-bold text-on-surface max-w-4xl tracking-tight leading-[1.2] mb-6">
        رابط واحد يجمع{" "}
        <span className="text-primary drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]">
          عالمك الرقمي
        </span>{" "}
        بالكامل ويضاعف وصولك
      </h1>

      <p className="text-base sm:text-lg text-on-surface-variant text-center max-w-2xl mb-10 leading-relaxed">
        ابنِ صفحة بايو مذهلة بتصميم بانتو عصري، مع ميزة الفحص الذاتي للروابط المعطلة، ونماذج بيع المنتجات الرقمية، وتحليلات فورية في أقل من 60 ثانية.
      </p>

      {/* Claim Username Form Card */}
      <div className="w-full max-w-xl p-2.5 bg-surface-container-high/90 border border-white/5 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] mb-4">
        <form onSubmit={handleClaim} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center w-full px-4 py-2.5 bg-surface-container-lowest rounded-xl flex-1 border border-outline-variant/30 dir-ltr" dir="ltr">
            <span className="text-outline text-xs sm:text-sm select-none font-mono font-medium">
              rawabet.me/
            </span>
            <input
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="اسمك_أو_علامتك"
              className="w-full bg-transparent text-on-surface text-sm sm:text-base font-semibold placeholder:text-outline focus:outline-none px-2 text-left font-mono"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-container text-on-primary-container font-bold text-sm rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>احجز رابطك مجاناً</span>
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-400 mt-2 font-medium text-right px-2">
            {error}
          </p>
        )}
      </div>

      {/* Live Availability Indicator & Proof Metrics */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2 bg-surface-container/60 border border-white/5 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="font-medium text-primary font-mono dir-ltr" dir="ltr">
            rawabet.me/{displayHandle} متاح للتسجيل الفوري
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>+50,000 صانع محتوى وشركة</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>تقييم 4.9/5 نجوم</span>
        </div>

        <div className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-secondary" />
          <span>بدون بطاقة ائتمانية</span>
        </div>
      </div>
    </section>
  );
}
