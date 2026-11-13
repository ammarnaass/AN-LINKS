import React from "react";
import Link from "next/link";
import { Link2, ArrowLeft } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-surface-container-lowest/80 border-b border-outline-variant/20 text-on-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container shadow-md transition-all">
            <Link2 className="w-5 h-5 rotate-45" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-on-surface tracking-tight leading-none">
                روابط | Rawabet
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-primary text-[10px] border border-outline-variant/40">
                جديد
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium tracking-wider mt-0.5">
              منصة الـ Bio الذكية والتفاعلية
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-medium text-on-surface-variant hover:text-on-surface px-3.5 py-2 rounded-lg hover:bg-surface-container transition"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
          >
            <span>ابدأ مجاناً</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
