"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ThemeToggle, BrandLogo, AppButton, AppInput } from "@/shared/ui";
import { AuthSideBanner } from "@/features/auth";
import { Lock, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("يجب ألا تقل كلمة المرور عن 8 أحرف");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "فشل تعيين كلمة المرور");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
    } catch {
      setErrorMessage("فشل الاتصال بالخادم. يرجى إعادة المحاولة.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-2xl space-y-4 text-center">
        <AlertCircle className="w-10 h-10 text-error mx-auto" />
        <h2 className="text-xl font-bold">الرابط غير صالح</h2>
        <p className="text-xs text-on-surface-variant">
          رمز الاستعادة غير موجود في الرابط. يرجى طلب رابط جديد.
        </p>
        <Link href="/forgot-password">
          <AppButton variant="primary" size="md" fullWidth>طلب رابط استعادة جديد</AppButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-2xl space-y-6 text-on-surface">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <ShieldCheck className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-on-surface">تعيين كلمة مرور جديدة</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          أدخل كلمة المرور الجديدة وتأكيدها لتأمين حسابك والتمكن من الدخول مجدداً.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded-2xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 mx-auto" />
          <h3 className="font-bold text-sm">تم تغيير كلمة المرور بنجاح!</h3>
          <p className="text-xs text-on-surface-variant">جاري توجيهك إلى صفحة تسجيل الدخول تلقائياً...</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AppInput
            label="كلمة المرور الجديدة"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            startAdornment={<Lock className="w-4 h-4" />}
          />

          <AppInput
            label="تأكيد كلمة المرور"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            startAdornment={<Lock className="w-4 h-4" />}
          />

          <AppButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}
          </AppButton>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-cairo" dir="rtl">
      <div className="max-w-7xl w-full mx-auto p-4 sm:px-8 flex items-center justify-between">
        <BrandLogo href="/" variant="minimal" size="sm" />
        <ThemeToggle />
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 w-full items-center">
          <div className="flex justify-center lg:justify-end">
            <Suspense fallback={<div className="p-8 text-center text-sm">جاري التحميل...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
          <AuthSideBanner />
        </div>
      </div>
    </div>
  );
}
