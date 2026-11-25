"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Root-level Next.js App Router global error boundary (catches root layout failures).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Root Error:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="min-h-screen bg-[#0a0e17] text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-white/10 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">تعذر تحميل المنصة مؤقتاً</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              واجه النظام خطأ غير متوقع على المستوى الجذري. تم تسجيل الحادثة، ويمكنك إعادة المحاولة أو العودة للرئيسية.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-slate-500" dir="ltr">
                Ref: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة التحميل</span>
            </button>
            <a
              href="/"
              className="w-full px-4 py-2.5 rounded-xl border border-white/15 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition"
            >
              <Home className="w-4 h-4" />
              <span>الصفحة الرئيسية</span>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
