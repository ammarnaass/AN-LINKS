"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, Mail, Lock } from "lucide-react";
import { loginWithCredentials } from "../services/auth.service";
import { AppButton, AppInput } from "@/shared/ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginWithCredentials(email, password);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("حدث خطأ غير متوقع. يرجى إعادة المحاولة.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-surface-container-high/60 border border-white/5 shadow-2xl space-y-6 text-on-surface">
      {/* Tab Switcher */}
      <div className="p-1 rounded-2xl bg-surface-container-lowest border border-white/5 flex items-center gap-1">
        <Link
          href="/login"
          className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-primary-container text-on-primary-container shadow-md transition-all"
        >
          تسجيل الدخول
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 text-center text-xs font-semibold rounded-xl text-on-surface-variant hover:text-on-surface transition-all"
        >
          إنشاء حساب جديد
        </Link>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-on-surface">مرحباً بعودتك</h2>
        <p className="text-xs text-on-surface-variant">
          أدخل بيانات حسابك للمتابعة إلى لوحة التحكم
        </p>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error px-4 py-3 rounded-2xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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

        <div className="space-y-1">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-semibold text-on-surface-variant">كلمة المرور</span>
            <span className="text-[11px] text-primary hover:underline cursor-pointer">
              نسيت كلمة المرور؟
            </span>
          </div>
          <AppInput
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            startAdornment={<Lock className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-surface-container border-white/10 text-primary focus:ring-primary/20 accent-primary"
          />
          <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer">
            تذكر بيانات الدخول على هذا الجهاز
          </label>
        </div>

        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<LogIn className="w-4 h-4" />}
        >
          {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
        </AppButton>
      </form>
    </div>
  );
}
