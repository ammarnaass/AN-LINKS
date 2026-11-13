"use client";

import React from "react";
import { THEMES, BUTTON_STYLES, BORDER_RADIUS_MAP, FONTS } from "@/lib/themes";
import { ProfileData } from "../public/BioPageContent";
import { Palette, Sparkles, Check, Image as ImageIcon } from "lucide-react";

interface ThemeCustomizerProps {
  profile: ProfileData;
  onProfileChange: (newProfile: ProfileData) => void;
}

export function ThemeCustomizer({ profile, onProfileChange }: ThemeCustomizerProps) {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  const currentTheme = (profile.themeKey && THEMES[profile.themeKey]) ? THEMES[profile.themeKey] : THEMES.layanDark;

  return (
    <div className="space-y-6">
      {/* Section 1: Profile Details */}
      <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </span>
            <div>
              <h3 className="font-bold text-on-surface text-base">بيانات الملف الشخصي</h3>
              <p className="text-xs text-on-surface-variant">الصورة والاسم التعريفي في أعلى بطاقتك</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
            مباشر
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative group">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover shadow-[0_0_24px_rgba(78,222,163,0.25)] ring-2 ring-primary/40"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md">
              <span className="material-symbols-outlined text-[13px]">photo_camera</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 text-center sm:text-right flex-1">
            <h4 className="font-bold text-on-surface text-sm">الصورة الرمزية</h4>
            <p className="text-xs text-on-surface-variant">
              نوصي بصورة مربعة واضحة بحجم لا يقل عن 600×600 بكسل.
            </p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <input
                type="text"
                placeholder="رابط الصورة (URL)"
                value={profile.avatarUrl || ""}
                onChange={(e) => handleChange("avatarUrl", e.target.value)}
                dir="ltr"
                className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs outline-none focus:border-primary flex-1 max-w-xs text-right"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">اسم العرض</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1">لون التمييز (Accent Color)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.accentColor || currentTheme.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="w-11 h-11 rounded-xl bg-surface-container-lowest border border-outline-variant/40 cursor-pointer p-1"
              />
              <input
                type="text"
                value={profile.accentColor || currentTheme.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                dir="ltr"
                className="flex-1 h-11 px-3 bg-surface-container-lowest text-on-surface rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary text-center font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-on-surface">النبذة التعريفية (Bio)</label>
            <span className="text-[11px] text-on-surface-variant font-mono">
              {(profile.bio || "").length} / 150
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={150}
            value={profile.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full p-3 bg-surface-container-lowest text-on-surface rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary transition resize-none"
            placeholder="اكتب نبذة قصيرة تعبر عنك وعن مجالك..."
          />
        </div>
      </section>

      {/* Section 2: Theme Presets */}
      <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">style</span>
            </span>
            <div>
              <h3 className="font-bold text-on-surface text-base">القوالب الجاهزة</h3>
              <p className="text-xs text-on-surface-variant">اختر النمط الجمالي بضغطة واحدة</p>
            </div>
          </div>
          <span className="text-xs text-tertiary font-semibold">{Object.keys(THEMES).length} قوالب متاحة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(THEMES).map((theme) => {
            const isSelected = (profile.themeKey || "layanDark") === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  handleChange("themeKey", theme.id);
                  handleChange("accentColor", theme.accentColor);
                }}
                className={`relative p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-surface-container-high border-primary ring-2 ring-primary/40 shadow-lg scale-[1.01]"
                    : "bg-surface-container border-outline-variant/30 hover:border-outline-variant/60"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" />
                    <span>المفعل</span>
                  </div>
                )}

                <div className={`h-20 rounded-lg p-2.5 mb-2 relative overflow-hidden flex flex-col justify-between ${theme.backgroundClass} border border-white/10`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: `${theme.accentColor}33`, color: theme.accentColor }}>
                    ●
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: `${theme.accentColor}66` }} />
                    <div className="h-1.5 w-1/2 rounded-full bg-white/20" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-on-surface text-sm">{theme.nameAr}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{theme.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Buttons & Appearance Style */}
      <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">animation</span>
            </span>
            <div>
              <h3 className="font-bold text-on-surface text-base">تخصيص الأزرار ونصف القطر</h3>
              <p className="text-xs text-on-surface-variant">نمط عرض الزر وانحناء الحواف</p>
            </div>
          </div>
        </div>

        {/* Button Style */}
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-2">نمط الأزرار</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "filled", label: "ممتلئ (Filled)" },
              { id: "glass", label: "إطار زجاجي (Glass)" },
              { id: "soft", label: "ناعم (Soft Blur)" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleChange("buttonStyle", st.id)}
                className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                  (profile.buttonStyle || "filled") === st.id
                    ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary"
                    : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Corner Radius */}
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-2">نصف قطر الحواف (Corner Radius)</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "rounded-md", label: "حاد (4px)", val: "rounded-md" },
              { id: "rounded-xl", label: "مستدير (12px)", val: "rounded-xl" },
              { id: "rounded-full", label: "بيضاوي (Pill)", val: "rounded-full" },
            ].map((rad) => (
              <button
                key={rad.id}
                type="button"
                onClick={() => handleChange("borderRadius", rad.val)}
                className={`p-3 rounded-xl border text-center transition text-xs font-semibold ${
                  (profile.borderRadius || "rounded-xl") === rad.val
                    ? "bg-surface-container-high border-primary text-primary ring-1 ring-primary"
                    : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {rad.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Typography Selection */}
      <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">text_fields</span>
            </span>
            <div>
              <h3 className="font-bold text-on-surface text-base">الخطوط العربية والطباعة</h3>
              <p className="text-xs text-on-surface-variant">اختر خط العرض المناسب لهويتك</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.entries(FONTS).map(([fontKey, font]) => (
            <button
              key={fontKey}
              type="button"
              onClick={() => handleChange("font", fontKey)}
              className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between ${
                (profile.font || "Cairo") === fontKey
                  ? "bg-surface-container-high border-primary ring-1 ring-primary text-primary"
                  : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="font-bold text-sm text-on-surface">{font.name}</span>
              <span className="text-xs opacity-75 mt-1">{font.nameAr}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
