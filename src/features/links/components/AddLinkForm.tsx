"use client";

import React, { useState } from "react";
import { AlertCircle, Link2, Heading, Music } from "lucide-react";
import { CATEGORIES } from "../constants/categories";
import { validateLinkInput } from "../validators/link.validator";
import { LinkData, LinkType } from "../types/links.types";
import { detectPlatform } from "../services/platform-detector";
import { detectAutoLinkType } from "../utils/media-embed";
import { getSocialIcon, YoutubeIcon } from "@/shared/ui";

interface AddLinkFormProps {
  onAdd: (newLink: LinkData) => Promise<void> | void;
  onCancel: () => void;
  existingCount: number;
}

export function AddLinkForm({ onAdd, onCancel, existingCount }: AddLinkFormProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [linkType, setLinkType] = useState<LinkType>("LINK");
  const [newCategory, setNewCategory] = useState("link");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectedPlatform = detectPlatform(newUrl);

  const handleUrlChange = (val: string) => {
    setNewUrl(val);
    const autoType = detectAutoLinkType(val);
    if (autoType !== "LINK") {
      setLinkType(autoType);
    }
    const detected = detectPlatform(val);
    if (detected && !newTitle.trim()) {
      setNewTitle(detected.nameAr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetUrl = linkType === "HEADER" ? (newUrl.trim() || "https://header.anlinks.dev") : newUrl;
    const validation = validateLinkInput({ title: newTitle, url: targetUrl, type: linkType });
    if (!validation.valid || !validation.normalizedUrl) {
      setError(validation.error || "البيانات المدخلة غير صحيحة");
      return;
    }

    const detected = detectPlatform(validation.normalizedUrl);

    const newLink: LinkData = {
      id: `link-${Date.now()}`,
      title: validation.title!,
      url: validation.normalizedUrl,
      type: linkType,
      isActive: true,
      position: existingCount,
      category: newCategory,
      platformId: detected?.slug || null,
      clicks: 0,
      clicksCount: 0,
    };

    try {
      setIsSubmitting(true);
      await onAdd(newLink);
    } catch (err: any) {
      setError(err?.message || "فشل إضافة الرابط");
    } finally {
      setIsSubmitting(false);
    }
  };

  const PlatformIcon = detectedPlatform ? getSocialIcon(detectedPlatform.slug) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-surface-container p-5 border border-primary/40 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-on-surface text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">add_link</span>
          <span>إضافة عنصر جديد</span>
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-on-surface-variant hover:text-on-surface"
        >
          إلغاء
        </button>
      </div>

      {/* Item Type Selector */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-container-high rounded-xl border border-outline-variant/30">
        <button
          type="button"
          onClick={() => setLinkType("LINK")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            linkType === "LINK" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>رابط عادي</span>
        </button>
        <button
          type="button"
          onClick={() => setLinkType("HEADER")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            linkType === "HEADER" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Heading className="w-3.5 h-3.5" />
          <span>عنوان قسم</span>
        </button>
        <button
          type="button"
          onClick={() => setLinkType("YOUTUBE")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            linkType === "YOUTUBE" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <YoutubeIcon className="w-3.5 h-3.5" />
          <span>يوتيوب</span>
        </button>
        <button
          type="button"
          onClick={() => setLinkType("SPOTIFY")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            linkType === "SPOTIFY" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>سبوتيفاي</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error-container/20 border border-error/40 text-error text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            {linkType === "HEADER" ? "نص عنوان القسم" : "عنوان الرابط / الفيديو"}
          </label>
          <input
            type="text"
            placeholder={linkType === "HEADER" ? "مثال: روابط المتاجر والمنتجات" : "مثال: قناتي على يوتيوب"}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            required
          />
        </div>

        {linkType !== "HEADER" ? (
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              {linkType === "YOUTUBE" ? "رابط فيديو يوتيوب" : linkType === "SPOTIFY" ? "رابط تراك أو ألبوم سبوتيفاي" : "الرابط أو المعرّف"}
            </label>
            <input
              type="text"
              placeholder={
                linkType === "YOUTUBE"
                  ? "youtube.com/watch?v=..."
                  : linkType === "SPOTIFY"
                  ? "open.spotify.com/track/..."
                  : "store.example.com"
              }
              value={newUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-on-surface placeholder-on-surface-variant/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary text-right"
              required
            />
          </div>
        ) : (
          <div className="flex items-center text-xs text-on-surface-variant bg-surface-container-high/40 p-3 rounded-xl border border-outline-variant/20">
            <span>عنصر تنظيمي لفصل المجموعات (لا يحتاج لرابط)</span>
          </div>
        )}
      </div>

      {detectedPlatform && linkType === "LINK" && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: detectedPlatform.brandColor }}
          />
          {PlatformIcon && <PlatformIcon className="w-4 h-4 shrink-0 text-on-surface" />}
          <span className="font-semibold text-primary">
            تم التعرف على المنصة: {detectedPlatform.nameAr}
          </span>
          <span className="text-[11px] text-on-surface-variant font-mono">
            ({detectedPlatform.slug})
          </span>
        </div>
      )}

      {linkType === "LINK" && (
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
            نوع أو تصنيف الرابط
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setNewCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  newCategory === cat.id
                    ? `${cat.color} ring-1 ring-primary`
                    : "bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "جاري الحفظ..." : "حفظ ونشر"}
        </button>
      </div>
    </form>
  );
}
