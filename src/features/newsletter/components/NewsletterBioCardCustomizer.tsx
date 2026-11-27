"use client";

import React from "react";
import { Mail, Eye, Sparkles, Check, Loader2 } from "lucide-react";
import { NewsletterSettings } from "../types/newsletter.types";
import { AppButton } from "@/shared/ui";

interface NewsletterBioCardCustomizerProps {
  settings: NewsletterSettings;
  onChange: (updates: Partial<NewsletterSettings>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function NewsletterBioCardCustomizer({
  settings,
  onChange,
  onSave,
  isSaving,
}: NewsletterBioCardCustomizerProps) {
  const previewTitle =
    settings.newsletterTitle.trim() ||
    `النشرة البريدية لـ ${settings.displayName || "صانع المحتوى"}`;
  const previewSubtitle =
    settings.newsletterSubtitle.trim() ||
    "احصل على أحدث المحتوى والعروض الحصرية أولاً بأول";
  const previewButtonText = settings.newsletterButtonText.trim() || "اشتراك";
  const accent = settings.accentColor || "#3B82F6";

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              تخصيص بطاقة النشرة في صفحة البايو
            </h3>
            <p className="text-xs text-on-surface-variant">
              تحكم بظهور بطاقة الاشتراك ونصوصها وأزرارها أمام زوار صفحتك العامة
            </p>
          </div>
        </div>

        <label className="inline-flex items-center gap-2.5 cursor-pointer bg-surface-container px-3.5 py-2 rounded-2xl border border-outline-variant/25">
          <span className="text-xs font-bold text-on-surface">
            {settings.newsletterEnabled ? "البطاقة مفعّلة" : "البطاقة معطّلة"}
          </span>
          <input
            type="checkbox"
            checked={settings.newsletterEnabled}
            onChange={(e) => onChange({ newsletterEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary relative" />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              عنوان بطاقة النشرة
            </label>
            <input
              type="text"
              value={settings.newsletterTitle}
              onChange={(e) => onChange({ newsletterTitle: e.target.value })}
              placeholder={`النشرة البريدية لـ ${settings.displayName || "صانع المحتوى"}`}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              الوصف أو العبارة التشجيعية
            </label>
            <textarea
              rows={2}
              value={settings.newsletterSubtitle}
              onChange={(e) => onChange({ newsletterSubtitle: e.target.value })}
              placeholder="احصل على أحدث المحتوى والعروض الحصرية أولاً بأول"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              نص زر الاشتراك
            </label>
            <input
              type="text"
              value={settings.newsletterButtonText}
              onChange={(e) => onChange({ newsletterButtonText: e.target.value })}
              placeholder="اشتراك"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="pt-3 border-t border-outline-variant/20 space-y-3">
            <h4 className="text-xs font-bold text-primary">رسالة الترحيب التلقائية للمشتركين (اختياري)</h4>
            <input
              type="text"
              value={settings.welcomeSubject || ""}
              onChange={(e) => onChange({ welcomeSubject: e.target.value })}
              placeholder="عنوان رسالة الترحيب (مثال: أهلاً بك في قائمتي!)"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
            />
            <textarea
              rows={2}
              value={settings.welcomeBody || ""}
              onChange={(e) => onChange({ welcomeBody: e.target.value })}
              placeholder="نص الرسالة الترحيبية أو كود الخصم الحصري..."
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition resize-none"
            />
            <input
              type="url"
              dir="ltr"
              value={settings.welcomeGiftUrl || ""}
              onChange={(e) => onChange({ welcomeGiftUrl: e.target.value })}
              placeholder="https://... (رابط هدية أو ملف PDF تلقائي)"
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
            />
          </div>

          <div className="pt-2">
            <AppButton
              type="button"
              variant="primary"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              leftIcon={
                isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )
              }
            >
              {isSaving ? "جاري الحفظ..." : "حفظ إعدادات البطاقة"}
            </AppButton>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-surface-container-lowest/80 border border-outline-variant/25 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
            <Eye className="w-4 h-4 text-primary" />
            <span>معاينة حية للبطاقة</span>
            {!settings.newsletterEnabled && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md font-medium">
                مخفية حالياً
              </span>
            )}
          </div>

          <div className="w-full p-4 rounded-2xl border border-outline-variant/30 bg-surface-container/60 backdrop-blur-md shadow-lg flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-on-surface">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accent}25`, color: accent }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-right flex-1 truncate">
                <h4 className="text-xs font-bold text-on-surface truncate">
                  {previewTitle}
                </h4>
                <p className="text-[10px] text-on-surface-variant truncate">
                  {previewSubtitle}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <div className="flex-1 bg-surface-container-lowest/80 border border-outline-variant/30 rounded-xl px-3 py-2 text-[11px] text-outline">
                بريدك الإلكتروني...
              </div>
              <div
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shrink-0 text-center"
                style={{ backgroundColor: accent }}
              >
                {previewButtonText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
