"use client";

import React, { useState } from "react";
import { sanitizeClaimUsername } from "../validators/claim.validator";
import { HeroSectionProps } from "../types/landing.types";

function HeroBadgeHeader() {
  return (
    <>
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-high/70 backdrop-blur-md shadow-sm mb-6 border border-white/5">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
        <span className="text-xs sm:text-sm font-semibold text-primary tracking-wide">
          ✨ المنصة العربية الأولى لروابط البايو الذكية والتفاعلية
        </span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-[56px] text-center font-bold text-on-surface max-w-4xl tracking-tight leading-[1.18] mb-6">
        رابط واحد يجمع <span className="text-primary drop-shadow-[0_0_24px_rgba(16,185,129,0.35)]">عالمك الرقمي</span> بالكامل ويضاعف وصولك
      </h1>

      <p className="text-base sm:text-lg text-on-surface-variant text-center max-w-2xl mb-10 leading-relaxed">
        ابنِ صفحة بايو مذهلة بتصميم بانتو عصري، مع ميزة الفحص الذاتي للروابط المعطلة، ونماذج بيع المنتجات الرقمية، وتحليلات فورية في أقل من 60 ثانية.
      </p>
    </>
  );
}

function HeroClaimForm({
  handle,
  setHandle,
  onSubmit,
}: {
  handle: string;
  setHandle: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="w-full max-w-xl p-2.5 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] mb-4 border border-white/5">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center w-full px-4 py-2.5 bg-surface-container-lowest rounded-lg flex-1">
          <span className="text-outline text-xs sm:text-sm select-none font-mono" dir="ltr">
            rawabet.me/
          </span>
          <input
            className="w-full bg-transparent text-on-surface text-sm sm:text-base placeholder:text-outline focus:outline-none px-2 text-left font-medium"
            dir="ltr"
            placeholder="اسمك_أو_علامتك"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
        </div>
        <button
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-container text-on-primary-container text-sm font-bold rounded-lg shadow-[0_0_22px_rgba(16,185,129,0.4)] hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
          type="submit"
        >
          <span className="material-symbols-outlined text-[20px]">bolt</span>
          <span>احجز رابطك مجاناً</span>
        </button>
      </form>
    </div>
  );
}

function HeroProofRow({ displayHandle }: { displayHandle: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-xs text-on-surface-variant">
      <div className="flex items-center gap-2 bg-surface-container/60 px-3 py-1.5 rounded-full border border-white/5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container" />
        </span>
        <span className="text-primary font-medium font-mono" dir="ltr">
          rawabet.me/{displayHandle} متاح للتسجيل الفوري
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
        <span>+50,000 صانع محتوى وشركة</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-tertiary text-[18px]">star</span>
        <span>تقييم 4.9/5 نجوم</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-secondary text-[18px]">credit_card_off</span>
        <span>بدون بطاقة ائتمانية</span>
      </div>
    </div>
  );
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  const [handle, setHandle] = useState("faisal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = sanitizeClaimUsername(handle);
    const validHandle = result.isValid ? result.username : "faisal";
    onOpenAuth?.("claim", validHandle);
  };

  const displayHandle = handle.trim() ? handle.toLowerCase().replace(/[^a-z0-9_-]/g, "") : "faisal";

  return (
    <section className="relative w-full pt-10 pb-16 lg:pt-16 lg:pb-24 px-6 lg:px-12 flex flex-col items-center justify-center text-on-surface">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[400px] bg-primary-container/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[360px] h-[360px] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 left-1/4 w-[280px] h-[280px] bg-tertiary-container/15 rounded-full blur-[90px] pointer-events-none -z-10" />

      <HeroBadgeHeader />
      <HeroClaimForm handle={handle} setHandle={setHandle} onSubmit={handleSubmit} />
      <HeroProofRow displayHandle={displayHandle} />
    </section>
  );
}
