"use client";

import React, { useState, useEffect } from "react";
import { PlatformDTO } from "@/features/links/types/links.types";
import { PlatformUpsertInput } from "@/features/admin/types/admin.types";
import { AppButton, AppInput } from "@/shared/ui";
import { X, Check } from "lucide-react";

const CATEGORIES = [
  { value: "SOCIAL", label: "شبكات تواصل" },
  { value: "VIDEO", label: "فيديو وبث" },
  { value: "MESSAGING", label: "مراسلة وتواصل" },
  { value: "COMMERCE", label: "تجارة إلكترونية" },
  { value: "DEV", label: "تطوير وبرمجة" },
  { value: "MUSIC", label: "صوت وموسيقى" },
  { value: "PROFESSIONAL", label: "مهني وأعمال" },
  { value: "CUSTOM", label: "مخصص" },
];

const DEFAULT_FORM: PlatformUpsertInput = {
  slug: "",
  nameAr: "",
  nameEn: "",
  category: "SOCIAL",
  defaultIcon: "globe",
  brandColor: "#4EDEA3",
  domainPattern: "",
  urlPlaceholder: "https://",
  isEnabled: true,
  sortOrder: 0,
};

export interface PlatformModalProps {
  isOpen: boolean;
  platform: PlatformDTO | null;
  onClose: () => void;
  onSaved: (platform: PlatformDTO) => void;
}

export function PlatformModal({ isOpen, platform, onClose, onSaved }: PlatformModalProps) {
  const [formData, setFormData] = useState<PlatformUpsertInput>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (platform) {
      setFormData({
        slug: platform.slug,
        nameAr: platform.nameAr,
        nameEn: platform.nameEn,
        category: platform.category,
        defaultIcon: platform.defaultIcon,
        brandColor: platform.brandColor,
        domainPattern: platform.domainPattern,
        urlPlaceholder: platform.urlPlaceholder,
        isEnabled: platform.isEnabled,
        sortOrder: platform.sortOrder,
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
    setError(null);
  }, [platform, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const url = platform ? `/api/admin/platforms/${platform.id}` : "/api/admin/platforms";
      const method = platform ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "فشل حفظ بيانات المنصة");
      onSaved(data.platform);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-cairo" dir="rtl">
      <div className="w-full max-w-lg bg-surface-container-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 bg-surface-container-lowest">
          <h3 className="font-bold text-sm sm:text-base text-on-surface">
            {platform ? "تعديل المنصة المعتمدة" : "إضافة منصة جديدة إلى الدليل"}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1 text-xs">
          {error && <div className="p-2.5 rounded-xl bg-error/10 text-error border border-error/20">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">الاسم بالعربية *</label>
              <AppInput value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} required placeholder="مثال: يوتيوب" />
            </div>
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">الاسم بالإنجليزية *</label>
              <AppInput value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} required placeholder="مثال: YouTube" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">الرمز الفريد (Slug) *</label>
              <AppInput value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })} required placeholder="youtube" dir="ltr" />
            </div>
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">الفئة</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 text-xs rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface focus:outline-none">
                {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">نمط النطاقات (Domain Pattern)</label>
            <AppInput value={formData.domainPattern} onChange={(e) => setFormData({ ...formData, domainPattern: e.target.value })} placeholder="youtube.com|youtu.be" dir="ltr" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">لون الهوية (Hex)</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.brandColor} onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                <AppInput value={formData.brandColor} onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })} dir="ltr" className="font-mono text-xs" />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-on-surface-variant mb-1">أيقونة Lucide</label>
              <AppInput value={formData.defaultIcon} onChange={(e) => setFormData({ ...formData, defaultIcon: e.target.value })} placeholder="youtube" dir="ltr" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">نموذج الرابط (Placeholder)</label>
            <AppInput value={formData.urlPlaceholder} onChange={(e) => setFormData({ ...formData, urlPlaceholder: e.target.value })} placeholder="https://..." dir="ltr" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1 font-semibold text-on-surface">
            <input type="checkbox" checked={formData.isEnabled} onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })} className="w-4 h-4 rounded text-primary" />
            <span>تفعيل المنصة في دليل المنصات</span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant/20">
            <AppButton type="button" variant="ghost" size="sm" onClick={onClose}>إلغاء</AppButton>
            <AppButton type="submit" variant="primary" size="sm" isLoading={isSubmitting} leftIcon={<Check className="w-3.5 h-3.5" />}>
              {platform ? "حفظ التعديلات" : "إضافة المنصة"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
