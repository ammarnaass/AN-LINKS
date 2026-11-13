"use client";

import React, { useState } from "react";
import {
  validateSettingsProfile,
  validatePasswordChange,
} from "@/lib/dashboard-actions";
import {
  Check,
  Copy,
  AlertTriangle,
  Download,
  Key,
  ShieldCheck,
  CreditCard,
  Lock,
  Smartphone,
  Laptop,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "subscription" | "payouts" | "security" | "danger"
  >("profile");

  const [displayName, setDisplayName] = useState("فيصل عبد العزيز المنصور");
  const [username, setUsername] = useState("faisal");
  const [email, setEmail] = useState("faisal@almansour.sa");
  const [phone, setPhone] = useState("+966 54 889 1234");
  const [bio, setBio] = useState(
    "صانع محتوى في التقنية وريادة الأعمال، مؤسس بودكاست «أبعاد رقمية». أشارككم مصادري الحصرية واستشاراتي الاستثمارية الأسبوعية."
  );
  const [seoIndexing, setSeoIndexing] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    const validation = validateSettingsProfile({
      displayName,
      email,
      username,
      bio,
      phone,
    });

    if (!validation.valid) {
      alert(validation.error);
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 600);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (!check.valid) {
      setPasswordMsg({ type: "error", text: check.error || "خطأ في البيانات" });
      return;
    }

    setPasswordMsg({ type: "success", text: "تم تحديث كلمة المرور بنجاح!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const copyPublicUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Action Scrim & Page Header */}
      <section className="relative bg-surface-container-low rounded-2xl p-6 lg:p-8 overflow-hidden shadow-xl border border-outline-variant/30">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                لوحة الإدارة المتقدمة
              </span>
              <span className="text-on-surface-variant text-xs font-mono">• تشفير عالي الكفاءة بمستوى بنكي</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              إعدادات الحساب والأمان والاشتراك
            </h1>
            <p className="text-xs lg:text-sm text-on-surface-variant">
              إدارة بياناتك الشخصية، بوابات الدفع لتحصيل الأرباح، خطة الاشتراك، وإجراءات أمان الدخول والمصادقة المتقدمة.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-[0_0_24px_rgba(78,222,163,0.35)] hover:bg-primary-fixed transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم حفظ التغييرات</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>{isSaving ? "جاري الحفظ..." : "حفظ كافة التغييرات"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant/30">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "profile"
              ? "bg-surface-container-high text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>الملف الشخصي والبيانات العامة</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subscription")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "subscription"
              ? "bg-surface-container-high text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          <span>خطة الاشتراك والفواتير</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payouts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "payouts"
              ? "bg-surface-container-high text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          <span>تحصيل الأرباح وبوابات الدفع</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "security"
              ? "bg-surface-container-high text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">shield_person</span>
          <span>الأمان وتسجيل الدخول</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("danger")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "danger"
              ? "bg-error-container/30 text-error shadow-sm"
              : "text-error/80 hover:bg-error-container/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
          <span>منطقة الخطر</span>
        </button>
      </nav>

      {/* Tab 1: Profile & General Info */}
      {activeTab === "profile" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Avatar Bento Card (4 cols) */}
            <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xl border border-outline-variant/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    الهوية الشخصية
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>حساب موثق رسمي</span>
                  </span>
                </div>

                <div className="flex flex-col items-center text-center space-y-2 pt-2">
                  <div className="relative group cursor-pointer">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlgtf1yaAHft8TJ5l_AefB9IBYojW1Gs_HMIpNj_5247pwrFJeu00bqYDxDE0h9MfcsCzJboyC8agk0zLtQuBT6_KCo9GRXIRSZY2daFUAHLl0bxOwFu1SRWwDPAF1Fsu3uxMMfdbb4w7qQzK_qeA9KyADD5HRCHJrbaP5cMCw2fYBExiU7e1Qj9YRYtPFjEmJwmmr5t4HsDt3LUG1USlsYSyWa7t7PTS_pvEG_sfU"
                      alt={displayName}
                      className="w-28 h-28 rounded-full object-cover shadow-2xl ring-2 ring-primary/40 group-hover:scale-105 transition"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition"
                      title="تغيير الصورة"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-on-surface">{displayName}</h2>
                    <p className="text-xs text-on-surface-variant font-mono" dir="ltr">
                      @{username}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container space-y-1 border border-outline-variant/20">
                  <span className="text-[11px] text-on-surface-variant">رابط صفحة البايو المباشرة</span>
                  <div className="flex items-center justify-between gap-2 bg-surface-container-lowest px-3 py-2 rounded-lg font-mono text-xs text-primary" dir="ltr">
                    <span className="truncate">bio.link/{username}</span>
                    <button
                      type="button"
                      onClick={copyPublicUrl}
                      className="p-1 hover:text-on-surface transition"
                      title="نسخ الرابط"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>رفع صورة بدقة عالية</span>
                </button>
                <p className="text-[10px] text-outline text-center">الحد الأقصى الموصى به: 5 ميجابايت (1080×1080)</p>
              </div>
            </div>

            {/* Detailed Form Card (8 cols) */}
            <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <h3 className="font-bold text-on-surface text-base">بيانات الملف الشخصي</h3>
                <span className="text-xs text-on-surface-variant">البيانات الأساسية التي تظهر لجمهورك</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface">الاسم المعروض كاملاً</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-2.5 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-xs text-on-surface">اسم المستخدم (Slug)</label>
                    <span className="text-primary text-[11px] font-semibold flex items-center gap-0.5">
                      <Check className="w-3 h-3" />
                      <span>متاح وجاهز</span>
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-mono text-xs text-outline" dir="ltr">
                      bio.link/
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      dir="ltr"
                      className="w-full bg-surface-container-lowest rounded-xl pr-4 pl-20 py-2.5 text-on-surface font-mono text-xs border border-outline-variant/40 focus:outline-none focus:border-primary transition text-left"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-xs text-on-surface">البريد الإلكتروني الأساسي</label>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">
                      مؤكد ومحمي
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-2.5 text-on-surface font-mono text-xs border border-outline-variant/40 focus:outline-none focus:border-primary transition text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-xs text-on-surface">رقم الجوال لتلقي التنبيهات</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-2.5 text-on-surface font-mono text-xs border border-outline-variant/40 focus:outline-none focus:border-primary transition text-right"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-xs text-on-surface">نبذة البايو التعريفية (Bio)</label>
                  <span className="text-[11px] text-outline font-mono">{bio.length} / 160 حرف</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded-xl p-3 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary transition resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-3 bg-surface-container p-3 rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">public</span>
                  <span className="text-xs text-on-surface">
                    إتاحة ظهور الحساب في محركات البحث ومفهرسات Google (SEO Indexing)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seoIndexing}
                    onChange={(e) => setSeoIndexing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner" />
                </label>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Subscription & Invoices */}
      {activeTab === "subscription" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Pro Plan Bento Card (7 cols) */}
            <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary text-xs font-bold">
                      الخطة النشطة
                    </span>
                    <span className="text-tertiary text-xs font-mono">سداد سنوي (خصم 20%)</span>
                  </div>
                  <h2 className="text-xl font-bold text-on-surface">باقة المحترفين المتكاملة Pro</h2>
                  <p className="text-xs text-on-surface-variant">
                    تجديد الحساب القادم في <strong className="text-on-surface">15 ديسمبر 2025</strong> مقابل{" "}
                    <span className="font-mono text-primary font-bold">468.00 ر.س</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[26px]">military_tech</span>
                </div>
              </div>

              {/* Consumption Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-surface-container rounded-xl space-y-1.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>الروابط النشطة</span>
                    <span className="font-mono text-primary font-bold">28 / ∞</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "32%" }} />
                  </div>
                  <span className="text-[10px] text-outline block">غير محدودة في خطة Pro</span>
                </div>

                <div className="p-3 bg-surface-container rounded-xl space-y-1.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>النطاق المخصص</span>
                    <span className="font-mono text-primary font-bold">متصل</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                  <span className="text-[10px] text-outline font-mono truncate block" dir="ltr">
                    faisal-links.com
                  </span>
                </div>

                <div className="p-3 bg-surface-container rounded-xl space-y-1.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>معدل الفحص الذكي</span>
                    <span className="font-mono text-tertiary font-bold">كل دقيقة</span>
                  </div>
                  <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: "85%" }} />
                  </div>
                  <span className="text-[10px] text-outline block">تنبيهات فورية 24/7</span>
                </div>
              </div>
            </div>

            {/* Payment Method on File (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    وسيلة الدفع المسجلة
                  </span>
                  <span className="text-primary text-xs font-semibold">تجديد تلقائي</span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-surface-container to-surface-container-high shadow-inner space-y-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="font-bold text-xs text-on-surface">Al Rajhi mada Debit</span>
                    </div>
                    <span className="text-[11px] font-mono text-primary">mada</span>
                  </div>
                  <div className="font-mono text-base text-on-surface tracking-widest text-left" dir="ltr">
                    •••• •••• •••• 9014
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-[10px] font-mono">
                    <span>FAISAL A ALMANSOUR</span>
                    <span>EXP: 09/27</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-surface-container rounded-xl flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tertiary" />
                  <span className="text-xs text-on-surface">معاملاتك مشفّرة عبر PCI-DSS Level 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
            <h3 className="font-bold text-on-surface text-base">سجل الفواتير وعمليات السداد</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-on-surface-variant bg-surface-container/60">
                    <th className="py-2.5 px-4 rounded-r-lg">رقم الفاتورة</th>
                    <th className="py-2.5 px-4">تاريخ الإصدار</th>
                    <th className="py-2.5 px-4">الباقة / التفاصيل</th>
                    <th className="py-2.5 px-4">المبلغ شامل الضريبة</th>
                    <th className="py-2.5 px-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  <tr className="hover:bg-surface-container/40 transition">
                    <td className="py-3 px-4 font-mono text-primary" dir="ltr">INV-2024-8891</td>
                    <td className="py-3 px-4 text-on-surface">15 ديسمبر 2024</td>
                    <td className="py-3 px-4 text-on-surface-variant">اشتراك سنوي في باقة Pro</td>
                    <td className="py-3 px-4 font-mono text-on-surface font-bold">468.00 ر.س</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                        مدفوعة بنجاح
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container/40 transition">
                    <td className="py-3 px-4 font-mono text-primary" dir="ltr">INV-2023-4410</td>
                    <td className="py-3 px-4 text-on-surface">15 ديسمبر 2023</td>
                    <td className="py-3 px-4 text-on-surface-variant">اشتراك سنوي في باقة Pro</td>
                    <td className="py-3 px-4 font-mono text-on-surface font-bold">468.00 ر.س</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
                        مدفوعة بنجاح
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Payouts & Gateways */}
      {activeTab === "payouts" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  تحصيل مبيعات روابط
                </span>
                <span className="text-xs text-on-surface-variant block">الرصيد المتاح للسحب الفوري</span>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-4xl font-extrabold text-primary font-mono">4,850.00</span>
                  <span className="text-lg text-on-surface font-semibold">ر.س</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary-fixed transition"
              >
                طلب سحب الأرباح فوراً إلى حسابك
              </button>
            </div>

            <div className="lg:col-span-7 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30">
              <h3 className="font-bold text-on-surface text-base">بوابات الدفع لتحصيل مبيعات المتجر</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">شبكة مدى للمدفوعات السعودية (MADA)</h4>
                    <p className="text-[11px] text-on-surface-variant">عمولة تشغيلية منخفضة 1.0% + 1 ريال</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    نشطة ✓
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Apple Pay بنقرة واحدة</h4>
                    <p className="text-[11px] text-on-surface-variant">معدل تحويل أعلى بنسبة +43% لمستخدمي iOS</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    نشطة ✓
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">بطاقات الائتمان (Visa & Mastercard)</h4>
                    <p className="text-[11px] text-on-surface-variant">قبول المدفوعات من كافة دول الخليج والعالم</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    نشطة ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Security & Authentication */}
      {activeTab === "security" && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 2FA Card (6 cols) */}
            <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">phonelink_lock</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-base">المصادقة الثنائية (2FA)</h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      مفعلة بنجاح عبر TOTP
                    </span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  حسابك محمي بتوليد رموز زمنية من خلال تطبيق المصادقة (Google Authenticator أو 1Password).
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-bright transition"
                >
                  تجديد المفاتيح الاحتياطية
                </button>
              </div>
            </div>

            {/* Change Password Form (6 cols) */}
            <form
              onSubmit={handlePasswordSubmit}
              className="lg:col-span-6 bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-4 shadow-xl border border-outline-variant/30"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-on-surface text-base">تغيير كلمة المرور</h3>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passwordMsg.type === "success"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-error-container/20 text-error border border-error/30"
                  }`}
                >
                  {passwordMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    dir="ltr"
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-2 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    dir="ltr"
                    placeholder="8 أحرف على الأقل"
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-2 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    dir="ltr"
                    className="w-full bg-surface-container-lowest rounded-xl px-4 py-2 text-on-surface text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-fixed transition shadow-md"
              >
                تحديث كلمة المرور
              </button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
            <h3 className="font-bold text-on-surface text-base">الجلسات النشطة والأجهزة المتصلة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">متصفح Chrome على Linux / Desktop</h4>
                    <p className="text-[11px] text-on-surface-variant font-mono">الرياض، السعودية • نشط الآن</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  الجلسة الحالية
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-tertiary" />
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">متصفح Safari على iPhone 15 Pro</h4>
                    <p className="text-[11px] text-on-surface-variant font-mono">الرياض، السعودية • قبل ساعتين</p>
                  </div>
                </div>
                <span className="text-[11px] text-on-surface-variant font-semibold">متصل</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 5: Danger Zone */}
      {activeTab === "danger" && (
        <section className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-error/30">
          <div className="flex items-center gap-3 text-error pb-3 border-b border-error/20">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-base">منطقة الإجراءات الحساسة والخطرة</h3>
              <p className="text-xs text-on-surface-variant">العمليات هنا نهائية ولا يمكن التراجع عنها لاحقاً</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-on-surface">تصدير كافة بيانات الحساب والروابط</h4>
                <p className="text-xs text-on-surface-variant">
                  تنزيل ملف بصيغة JSON أو CSV يحتوي على كافة الروابط والإحصاءات وسجل الحساب.
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold transition flex items-center gap-2 self-start sm:self-auto"
              >
                <Download className="w-4 h-4 text-primary" />
                <span>تصدير البيانات</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-error-container/10 border border-error/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-error">حذف الحساب نهائياً</h4>
                <p className="text-xs text-on-surface-variant">
                  سيتم حذف صفحتك العامة وكافة الروابط والإحصاءات بشكل دائم من الخوادم.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("هل أنت متأكد تماماً من رغبتك في حذف الحساب نهائياً؟ هذا الإجراء لا يمكن الرجوع عنه.")) {
                    alert("يرجى التواصل مع الدعم الفني لتأكيد الحذف النهائي لحسابك.");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-error hover:bg-red-700 text-white text-xs font-bold transition self-start sm:self-auto"
              >
                حذف الحساب نهائياً
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
