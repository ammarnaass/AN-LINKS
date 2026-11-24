"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle, BrandLogo, AppButton, AppInput } from "@/shared/ui";
import { AuthSideBanner } from "@/features/auth";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewToken, setPreviewToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPreviewToken(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "حدث خطأ أثناء إرسال الرابط");
      } else {
        setSuccessMessage(data.message);
        if (data.resetToken) {
          setPreviewToken(data.resetToken);
        }
      }
    } catch {
      setErrorMessage("فشل الاتصال بالخادم. يرجى إعادة المحاولة.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-cairo" dir="rtl">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:px-8 flex items-center justify-between">
        <BrandLogo href="/" variant="minimal" size="sm" />
        <ThemeToggle />
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 w-full items-center">
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-2xl space-y-6 text-on-surface">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-on-surface">استعادة كلمة المرور</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة.
                </p>
              </div>

              {errorMessage && (
                <div className="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded-2xl flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage ? (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm mb-1">تم إرسال الطلب بنجاح</p>
                      <p>{successMessage}</p>
                    </div>
                  </div>

                  {previewToken && (
                    <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/30 text-xs space-y-2">
                      <span className="text-[11px] text-primary font-bold">رابط المعاينة المباشر:</span>
                      <Link
                        href={`/reset-password?token=${previewToken}`}
                        className="block text-primary underline truncate font-mono text-[11px]"
                        dir="ltr"
                      >
                        /reset-password?token={previewToken.slice(0, 16)}...
                      </Link>
                    </div>
                  )}

                  <Link href="/login" className="block pt-2">
                    <AppButton variant="outline" size="md" fullWidth leftIcon={<ArrowRight className="w-4 h-4" />}>
                      العودة لتسجيل الدخول
                    </AppButton>
                  </Link>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <AppInput
                    label="البريد الإلكتروني"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sara@example.com"
                    dir="ltr"
                    startAdornment={<Mail className="w-4 h-4" />}
                  />

                  <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                  >
                    {isLoading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
                  </AppButton>

                  <div className="text-center pt-2">
                    <Link
                      href="/login"
                      className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>تذكرت كلمة المرور؟ تسجيل الدخول</span>
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
          <AuthSideBanner />
        </div>
      </div>
    </div>
  );
}
