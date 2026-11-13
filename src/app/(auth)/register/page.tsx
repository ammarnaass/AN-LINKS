"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { isUsernameReserved } from "@/lib/reserved-usernames";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const usernameError = (() => {
    if (!formData.username) return null;
    if (formData.username.length < 3) return "اسم المستخدم قصير جداً (3 أحرف على الأقل)";
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      return "أحرف لاتينية وأرقام وشرطة فقط";
    }
    if (isUsernameReserved(formData.username)) {
      return "هذا الاسم محجوز للنظام";
    }
    return null;
  })();

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["فشل إنشاء الحساب"]);
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful registration
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginResult?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrors(["حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            أنشئ صفحة روابطك في دقيقتين
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl space-y-1 text-sm">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسمك أو اسم نشاطك
            </label>
            <input
              name="displayName"
              type="text"
              required
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none transition"
              placeholder="مثال: متجر السعادة أو أحمد محمد"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم (رابط صفحتك)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-400 text-xs font-mono select-none" dir="ltr">
                anlinks.com/
              </span>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-28 pr-4 py-2.5 rounded-xl border ${
                  usernameError ? "border-red-300" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 text-sm outline-none transition font-mono`}
                placeholder="username"
                dir="ltr"
              />
            </div>
            {usernameError && (
              <p className="mt-1 text-xs text-red-600">{usernameError}</p>
            )}
            {!usernameError && formData.username.length >= 3 && (
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                صيغة اسم المستخدم صالحة ومتاحة
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none transition"
              placeholder="name@example.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور (8 أحرف على الأقل)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm outline-none transition"
              placeholder="••••••••"
              dir="ltr"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !!usernameError}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
            >
              {isLoading ? "جاري إنشاء حسابك..." : "إنشاء حساب ومتابعة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

