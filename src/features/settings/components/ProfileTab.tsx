"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface ProfileTabProps {
  displayName: string;
  setDisplayName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  seoIndexing: boolean;
  setSeoIndexing: (val: boolean) => void;
}

export function ProfileTab({
  displayName,
  setDisplayName,
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  bio,
  setBio,
  seoIndexing,
  setSeoIndexing,
}: ProfileTabProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const copyPublicUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/${username}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Avatar Bento Card */}
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
                <button type="button" onClick={copyPublicUrl} className="p-1 hover:text-on-surface transition" title="نسخ الرابط">
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

        {/* Detailed Form Card */}
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
                <span className="absolute left-3 font-mono text-xs text-outline" dir="ltr">bio.link/</span>
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
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-semibold">مؤكد ومحمي</span>
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
  );
}
