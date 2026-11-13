"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
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

    const result = await registerAccount(formData);
    if (!result.ok) {
      setErrors(result.errors || ["فشل إنشاء الحساب"]);
      setIsLoading(false);
      return;
    }

    const loginResult = await loginWithCredentials(formData.email, formData.password);
    if (loginResult?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
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
            type="text"
            name="displayName"
            required
            value={formData.displayName}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
            placeholder="مثال: سارة أحمد"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم المستخدم لرابط صفحتك
          </label>
          <div className="relative rounded-xl shadow-sm">
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              dir="ltr"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                usernameError ? "border-red-300" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-left text-gray-900 pl-24`}
              placeholder="username"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm font-mono">rawabet.me/</span>
            </div>
          </div>
          {usernameError && (
            <p className="mt-1 text-xs text-red-600">{usernameError}</p>
          )}
          {!usernameError && formData.username.length >= 3 && (
            <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>اسم المستخدم متاح ومطابق للشروط</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right text-gray-900"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            كلمة المرور
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-right text-gray-900"
            placeholder="8 أحرف على الأقل"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || Boolean(usernameError)}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 mt-2"
        >
          {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب وبدء التجربة"}
        </button>
      </form>
    </div>
  );
}
