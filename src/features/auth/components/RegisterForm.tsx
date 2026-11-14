"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle, User, Mail, Lock, AtSign } from "lucide-react";
import { validateUsernameFormat } from "../validators/auth.validator";
import { registerAccount, loginWithCredentials } from "../services/auth.service";
import { AppButton, AppInput } from "@/shared/ui";

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
        <AppInput
          label="الاسم الظاهر"
          type="text"
          name="displayName"
          required
          value={formData.displayName}
          onChange={handleChange}
          placeholder="مثال: سارة العتيبي"
          startAdornment={<User className="w-4 h-4" />}
        />

        <AppInput
          label="اسم المستخدم الفريد (الرابط)"
          type="text"
          name="username"
          required
          value={formData.username}
          onChange={handleChange}
          dir="ltr"
          placeholder="sara"
          error={formData.username ? usernameError || undefined : undefined}
          helperText={
            formData.username && !usernameError
              ? `رابطك سيكون: rawabet.me/${formData.username}`
              : undefined
          }
          startAdornment={<AtSign className="w-4 h-4" />}
        />

        <AppInput
          label="البريد الإلكتروني"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          dir="ltr"
          placeholder="sara@example.com"
          startAdornment={<Mail className="w-4 h-4" />}
        />

        <AppInput
          label="كلمة المرور"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          dir="ltr"
          placeholder="8 أحرف على الأقل"
          startAdornment={<Lock className="w-4 h-4" />}
        />

        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={isLoading || !!usernameError}
          rightIcon={<Sparkles className="w-4 h-4" />}
          className="mt-2"
        >
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب مجاناً"}
        </AppButton>
      </form>
    </div>
  );
}
