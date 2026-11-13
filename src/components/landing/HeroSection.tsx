"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sanitizeClaimUsername } from "@/lib/claim-validator";
import { Sparkles, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function HeroSection() {
  const [handle, setHandle] = useState("");
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

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background soft glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-100/60 to-indigo-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>المنصة الأولى المتخصصة لصفحات الروابط بالعربية</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.2] sm:leading-[1.15]">
          رابط واحد يجمع كل حضورك الرقمي{" "}
          <span className="bg-gradient-to-l from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            بسرعة واحترافية
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          أنشئ صفحة روابط فائقة السرعة، متوافقة 100% مع شبكات الجوّال، وشارِك متجرك وحساباتك وإنجازاتك في خانة «النبذة» بنقرة واحدة.
        </p>

        {/* Handle Claim Form */}
        <div className="max-w-md mx-auto pt-2">
          <form
            onSubmit={handleClaim}
            className="flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-white rounded-2xl border-2 border-gray-100 shadow-xl shadow-blue-500/5 focus-within:border-blue-500 transition-all"
          >
            <div className="flex items-center flex-1 w-full px-3 dir-ltr" dir="ltr">
              <span className="text-sm font-semibold text-gray-400 select-none">
                anlinks.to/
              </span>
              <input
                type="text"
                value={handle}
                onChange={(e) => {
                  setHandle(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="yourname"
                className="w-full bg-transparent px-1.5 py-2.5 text-sm font-semibold text-gray-900 focus:outline-none placeholder:text-gray-300"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition active:scale-98 whitespace-nowrap cursor-pointer"
            >
              <span>احجز رابطك</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {error && (
            <p className="text-xs text-red-500 mt-2 font-medium text-right px-2">
              {error}
            </p>
          )}
        </div>

        {/* Value Micro-Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>مجاني 100% وبدون قيود</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>إعداد في أقل من دقيقتين</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>حماية وتحميل فوري SSR</span>
          </div>
        </div>
      </div>
    </section>
  );
}

