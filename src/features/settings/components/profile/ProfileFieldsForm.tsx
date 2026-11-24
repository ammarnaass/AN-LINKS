"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { ProfileSettingsInput } from "../../validators/settings.validator";

interface ProfileFieldsFormProps {
  profile: ProfileSettingsInput;
  setProfile: React.Dispatch<React.SetStateAction<ProfileSettingsInput>>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  statusMessage: { type: "success" | "error"; text: string } | null;
}

export function ProfileFieldsForm({
  profile,
  setProfile,
  onSubmit,
  isSaving,
  statusMessage,
}: ProfileFieldsFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-outline-variant/30 flex-1"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <h3 className="text-base font-bold text-on-surface">بيانات الحساب الشخصية</h3>
          <p className="text-xs text-on-surface-variant">تظهر هذه المعلومات في صفحة روابطك وبطاقات التعريف</p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            statusMessage.type === "success"
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-error/10 text-error border border-error/20"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">الاسم المعروض</label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">اسم المستخدم (المعرف)</label>
          <input
            type="text"
            value={profile.username}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">البريد الإلكتروني</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-on-surface-variant">رقم الجوال (اختياري)</label>
          <input
            type="tel"
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="+966 5X XXX XXXX"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>مكان الإقامة / الدولة والمدينة (الساكن بها)</span>
          </label>
          <input
            type="text"
            value={profile.location || ""}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            placeholder="مثال: الرياض، السعودية أو طرابلس، ليبيا"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-on-surface-variant">النبذة التعريفية (Bio)</label>
        <textarea
          rows={3}
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="اكتب نبذة موجزة عنك ومجال صناعة المحتوى الخاص بك..."
          className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}
