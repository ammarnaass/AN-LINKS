"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle, CheckCircle2, User, Mail, Lock, AtSign } from "lucide-react";
import { validateUsernameFormat } from "../validators/auth.validator";
import { registerAccount, loginWithCredentials } from "../services/auth.service";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const usernameError = validateUsernameFormat(formData.username);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (usernameError) {
      setErrors([usernameError]);
      return;
    }

    setIsLoading(true);

    try {
      const regRes = await registerAccount(formData);

      if (!regRes.ok) {
        setErrors(regRes.errors || ["فشل إنشاء الحساب"]);
        setIsLoading(false);
        return;
      }

      await loginWithCredentials(formData.email, formData.password);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrors(["حدث خطأ غير متوقع أثناء إنشاء الحساب"]);
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
          className="flex-1 py-2 text-center text-xs font-semibold rounded-xl text-on-surface-variant hover:text-on-surface transition-all"
        >
          تسجيل الدخول
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-primary-container text-on-primary-container shadow-md transition-all"
        >
          إنشاء حساب جديد
        </Link>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-black text-on-surface">أنشئ صفحتك الآن</h2>
        <p className="text-xs text-on-surface-variant">
          ابدأ مجاناً في دقيقتين وامتلك صفحة بايو باحترافية استثنائية
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-error-container/20 border border-error/30 text-error p-3.5 rounded-2xl space-y-1 text-xs">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">
            الاسم الظاهر
          </label>
          <div className="relative flex items-center rounded-xl bg-surface-container-lowest border border-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <User className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
            <input
              type="text"
              name="displayName"
              required
              value={formData.displayName}
              onChange={handleChange}
              className="w-full bg-transparent py-2.5 px-3 text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-outline/40"
              placeholder="مثال: سارة العتيبي"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">
            اسم المستخدم الفريد (الرابط)
          </label>
          <div className="relative flex items-center rounded-xl bg-surface-container-lowest border border-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <AtSign className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-transparent py-2.5 px-3 text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-outline/40"
              placeholder="sara"
            />
          </div>
          {formData.username && !usernameError && (
            <p className="text-[11px] text-primary flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> رابطك سيكون: rawabet.me/{formData.username}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">
            البريد الإلكتروني
          </label>
          <div className="relative flex items-center rounded-xl bg-surface-container-lowest border border-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Mail className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-transparent py-2.5 px-3 text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-outline/40"
              placeholder="sara@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-on-surface-variant">
            كلمة المرور
          </label>
          <div className="relative flex items-center rounded-xl bg-surface-container-lowest border border-white/5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Lock className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              dir="ltr"
              className="w-full bg-transparent py-2.5 px-3 text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-outline/40"
              placeholder="8 أحرف على الأقل"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!usernameError}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب مجاناً"}</span>
        </button>
      </form>
    </div>
  );
}
