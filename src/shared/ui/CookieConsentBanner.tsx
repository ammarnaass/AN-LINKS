"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";

const CONSENT_STORAGE_KEY = "anlinks_cookie_consent";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        // Small delay so it animates in smoothly after initial render
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const handleConsent = (level: "all" | "essential") => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, level);
    } catch {
      // Storage unavailable
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="إشعار ملفات تعريف الارتباط"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[420px] z-50 p-4 rounded-2xl bg-surface-container-high/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-fadeIn transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span>ملفات تعريف الارتباط والخصوصية</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </h4>
            <button
              onClick={() => handleConsent("essential")}
              aria-label="إغلاق الإشعار"
              className="text-outline hover:text-on-surface p-1 rounded-lg transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك وقياس أداء الروابط وفق نظام حماية البيانات الشخصية (PDPL). يمكنك مراجعة{" "}
            <Link href="/privacy" className="text-primary underline hover:text-primary/80 transition">
              سياسة الخصوصية
            </Link>.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3.5 pt-3 border-t border-white/5">
        <button
          onClick={() => handleConsent("essential")}
          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition"
        >
          الضرورية فقط
        </button>
        <button
          onClick={() => handleConsent("all")}
          className="px-4 py-1.5 rounded-xl text-[11px] font-bold bg-primary text-on-primary shadow-sm hover:brightness-110 active:scale-95 transition"
        >
          قبول الكل
        </button>
      </div>
    </div>
  );
}
