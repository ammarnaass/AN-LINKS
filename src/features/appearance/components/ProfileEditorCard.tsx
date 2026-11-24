"use client";

import React from "react";
import { ProfileData } from "../types/appearance.types";
import { ThemeConfig } from "../constants/themes";
import { AvatarUploadField } from "./AvatarUploadField";

interface ProfileEditorCardProps {
  profile: ProfileData;
  currentTheme: ThemeConfig;
  onChange: (field: keyof ProfileData, value: string) => void;
}

export function ProfileEditorCard({ profile, currentTheme, onChange }: ProfileEditorCardProps) {
  return (
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

      <AvatarUploadField
        avatarUrl={profile.avatarUrl}
        displayName={profile.displayName}
        onAvatarChange={(url) => onChange("avatarUrl", url || "")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">اسم العرض</label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => onChange("displayName", e.target.value)}
            className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">لون التمييز (Accent Color)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={profile.accentColor || currentTheme.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className="w-11 h-11 rounded-xl bg-surface-container-lowest border border-outline-variant/40 cursor-pointer p-1"
            />
            <input
              type="text"
              value={profile.accentColor || currentTheme.accentColor}
              onChange={(e) => onChange("accentColor", e.target.value)}
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
          onChange={(e) => onChange("bio", e.target.value)}
          className="w-full p-3 bg-surface-container-lowest text-on-surface rounded-xl text-sm border border-outline-variant/40 focus:outline-none focus:border-primary transition resize-none"
          placeholder="اكتب نبذة قصيرة تعبر عنك وعن مجالك..."
        />
      </div>
    </section>
  );
}

