"use client";

import React from "react";
import { THEMES, BUTTON_STYLES, BORDER_RADIUS_MAP, FONTS } from "@/lib/themes";
import { ProfileData } from "../public/BioPageContent";
import { Palette, Type, Layout } from "lucide-react";

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

  return (
    <div className="space-y-6">
      {/* Profile Details */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base">المعلومات الشخصية</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              الاسم الظاهر
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              النبذة التعريفية (Bio)
            </label>
            <textarea
              rows={3}
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="اكتب نبذة قصيرة تعبر عنك أو عن نشاطك..."
            />
          </div>
        </div>
      </div>

      {/* Theme Presets */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          <span>القوالب الجاهزة</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {Object.values(THEMES).map((theme) => {
            const isSelected = (profile.themeKey || "default") === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleChange("themeKey", theme.id)}
                className={`p-4 rounded-xl border text-right transition flex flex-col justify-between h-24 ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                } ${theme.backgroundClass}`}
              >
                <span className={`text-xs font-bold ${theme.textPrimary}`}>{theme.nameAr}</span>
                <span className={`text-[10px] opacity-75 ${theme.textSecondary}`}>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Button & Border Styling */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Layout className="w-5 h-5 text-blue-600" />
          <span>مظهر الأزرار والحواف</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              نمط الزر
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(BUTTON_STYLES).map((styleKey) => (
                <button
                  key={styleKey}
                  type="button"
                  onClick={() => handleChange("buttonStyle", styleKey)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition ${
                    (profile.buttonStyle || "filled") === styleKey
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {styleKey === "filled" && "ممتلئ"}
                  {styleKey === "outline" && "إطار"}
                  {styleKey === "soft" && "ناعم"}
                  {styleKey === "shadow" && "ظل بارز"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              استدارة الحواف
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(BORDER_RADIUS_MAP).map((radiusKey) => (
                <button
                  key={radiusKey}
                  type="button"
                  onClick={() => handleChange("borderRadius", BORDER_RADIUS_MAP[radiusKey])}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition ${
                    (profile.borderRadius || "rounded-xl") === BORDER_RADIUS_MAP[radiusKey]
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {radiusKey === "none" && "حادة"}
                  {radiusKey === "sm" && "خفيفة"}
                  {radiusKey === "md" && "متوسطة"}
                  {radiusKey === "lg" && "كبيرة"}
                  {radiusKey === "full" && "دائرية"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Font Selection */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-600" />
          <span>نوع الخط العربي</span>
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(FONTS).map(([fontKey, fontVal]) => (
            <button
              key={fontKey}
              type="button"
              onClick={() => handleChange("font", fontKey)}
              className={`p-3 rounded-xl border text-center transition ${
                (profile.font || "Cairo") === fontKey
                  ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="text-sm block">{fontVal.nameAr}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

