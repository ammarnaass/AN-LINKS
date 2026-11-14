"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GiantCtaSectionProps } from "../types/landing.types";

export function GiantCtaSection({ onOpenAuth }: GiantCtaSectionProps = {}) {
  let router: ReturnType<typeof useRouter> | null = null;
  try {
    router = useRouter();
  } catch {
    router = null;
  }
  const [handle, setHandle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = handle.trim() ? handle.toLowerCase().replace(/[^a-z0-9_-]/g, "") : "";
    if (onOpenAuth && val) {
      onOpenAuth("claim", val);
    }
    const target = val ? `/register?username=${encodeURIComponent(val)}` : "/register";
    if (router) {
      router.push(target);
    } else if (typeof window !== "undefined") {
      window.location.href = target;
    }
  };

  return (
    <section className="w-full py-20 px-6 lg:px-12 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto relative rounded-3xl overflow-hidden p-8 sm:p-16 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col items-center text-center border border-white/5">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/20 text-primary text-xs font-bold mb-6">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>انضم لأكثر من 50 ألف مبدع عربي اليوم</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-bold text-on-surface max-w-2xl mb-4 leading-tight">
          جاهز لتوحيد حضورك الرقمي في <span className="text-primary">رابط واحد استثنائي؟</span>
        </h2>

        <p className="text-sm sm:text-base text-on-surface-variant max-w-xl mb-10 leading-relaxed">
          ابدأ الآن مجاناً، اختر قالبك المفضل، وانطلق في بناء علامتك الشخصية ومضاعفة وصولك بكل فخر وإتقان.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-2.5 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/5"
        >
          <div className="flex items-center w-full px-4 py-2.5 bg-surface-container-low rounded-lg flex-1">
            <span className="text-outline text-xs sm:text-sm font-mono" dir="ltr">
              rawabet.me/
            </span>
            <input
              className="w-full bg-transparent text-on-surface text-sm sm:text-base placeholder:text-outline focus:outline-none px-2 text-left"
              dir="ltr"
              placeholder="اسمك_الجديد"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
          </div>
          <button
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
            type="submit"
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            <span>ابدأ الآن مجاناً</span>
          </button>
        </form>

        <p className="text-xs text-outline mt-4">
          لا يتطلب بطاقة ائتمانية • إعداد سهل في 60 ثانية • دعم فني عربي على مدار الساعة
        </p>
      </div>
    </section>
  );
}
