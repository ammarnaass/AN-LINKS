"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { AppButton } from "@/shared/ui";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-surface text-on-surface font-cairo"
      dir="rtl"
    >
      <div className="max-w-md w-full p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-on-surface">حدث خطأ غير متوقع</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            نعتذر عن هذا الخلل المؤقت. لقد تم تسجيل هذا الخطأ وسيعمل فريق الدعم الفني على معالجته فوراً.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-on-surface-variant/60" dir="ltr">
              Ref: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <AppButton
            variant="primary"
            size="md"
            fullWidth
            onClick={() => reset()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            إعادة المحاولة
          </AppButton>
          <Link href="/" className="w-full">
            <AppButton
              variant="outline"
              size="md"
              fullWidth
              leftIcon={<Home className="w-4 h-4" />}
            >
              الرئيسية
            </AppButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
