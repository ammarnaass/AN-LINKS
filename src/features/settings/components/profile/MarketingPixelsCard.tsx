"use client";

import React from "react";
import { Activity, Share2 } from "lucide-react";
import { ProfileSettingsInput } from "../../validators/settings.validator";

interface MarketingPixelsCardProps {
  profile: ProfileSettingsInput;
  setProfile: React.Dispatch<React.SetStateAction<ProfileSettingsInput>>;
  onSave: () => void;
  isSaving: boolean;
}

export function MarketingPixelsCard({
  profile,
  setProfile,
  onSave,
  isSaving,
}: MarketingPixelsCardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl border border-outline-variant/30">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-on-surface">
              بيكسل التتبع الإعلاني والتسويقي (Marketing Pixels)
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            قم بربط معرفات التتبع الخاصة بحملاتك الإعلانية لقياس الزيارات والتحويلات مباشرة من صفحة الروابط
          </p>
        </div>
        <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
          2026 Pro Feature
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Meta Pixel */}
        <div className="space-y-1.5 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20">
          <label className="text-xs font-bold text-on-surface flex items-center justify-between">
            <span>Meta Pixel (فيسبوك وانستغرام)</span>
            <span className="text-[10px] text-on-surface-variant font-mono">fbq</span>
          </label>
          <input
            type="text"
            value={profile.metaPixelId || ""}
            onChange={(e) => setProfile({ ...profile, metaPixelId: e.target.value })}
            placeholder="مثال: 123456789012345"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
          />
          <p className="text-[11px] text-on-surface-variant">معرف بيكسل Meta لتتبع زوار الإعلانات</p>
        </div>

        {/* TikTok Pixel */}
        <div className="space-y-1.5 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20">
          <label className="text-xs font-bold text-on-surface flex items-center justify-between">
            <span>TikTok Pixel</span>
            <span className="text-[10px] text-on-surface-variant font-mono">ttq</span>
          </label>
          <input
            type="text"
            value={profile.tiktokPixelId || ""}
            onChange={(e) => setProfile({ ...profile, tiktokPixelId: e.target.value })}
            placeholder="مثال: C6ABCD123456789EFG"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
          />
          <p className="text-[11px] text-on-surface-variant">معرف بيكسل تيك توك لتتبع حملاتك</p>
        </div>

        {/* Google Analytics 4 */}
        <div className="space-y-1.5 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20">
          <label className="text-xs font-bold text-on-surface flex items-center justify-between">
            <span>Google Analytics 4 (GA4)</span>
            <span className="text-[10px] text-on-surface-variant font-mono">gtag</span>
          </label>
          <input
            type="text"
            value={profile.googleAnalyticsId || ""}
            onChange={(e) => setProfile({ ...profile, googleAnalyticsId: e.target.value })}
            placeholder="مثال: G-XXXXXXXXXX"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
          />
          <p className="text-[11px] text-on-surface-variant">معرف القياس القياسي لإحصاءات جوجل</p>
        </div>

        {/* Snapchat Pixel */}
        <div className="space-y-1.5 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20">
          <label className="text-xs font-bold text-on-surface flex items-center justify-between">
            <span>Snapchat Pixel</span>
            <span className="text-[10px] text-on-surface-variant font-mono">snaptr</span>
          </label>
          <input
            type="text"
            value={profile.snapchatPixelId || ""}
            onChange={(e) => setProfile({ ...profile, snapchatPixelId: e.target.value })}
            placeholder="مثال: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-primary/40"
            dir="ltr"
          />
          <p className="text-[11px] text-on-surface-variant">معرف بيكسل سناب شات للمعلنين</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-primary" />
          <span>يتم تحميل أكواد التتبع تلقائياً في صفحة البايو العامة للزوار فقط</span>
        </p>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {isSaving ? "جاري الحفظ..." : "حفظ معرفات التتبع"}
        </button>
      </div>
    </div>
  );
}
