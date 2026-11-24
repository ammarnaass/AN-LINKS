"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2, Image as ImageIcon, RotateCcw, Sparkles, Loader2, Link as LinkIcon } from "lucide-react";
import { LinkData } from "../types/links.types";
import { AdvancedColorPicker } from "@/features/appearance";

interface LinkAppearanceCustomizerProps {
  link: LinkData;
  onUpdate: (updated: LinkData) => void;
}

const SHADOW_OPTIONS = [
  { id: "none", label: "بدون ظل" },
  { id: "soft", label: "ظل ناعم" },
  { id: "strong", label: "ظل بارز" },
  { id: "glow", label: "نيون متوهج" },
];

export function LinkAppearanceCustomizer({ link, onUpdate }: LinkAppearanceCustomizerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(link.thumbnailUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار ملف صورة صالح");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("الحد الأقصى لحجم الصورة المصغرة هو 4 ميجابايت");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل رفع الصورة المصغرة");
      }

      onUpdate({ ...link, thumbnailUrl: data.url });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "حدث خطأ أثناء الرفع");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToTheme = () => {
    onUpdate({
      ...link,
      thumbnailUrl: null,
      customBgColor: null,
      customTextColor: null,
      customBorderColor: null,
      customShadow: null,
    });
    setUrlInput("");
  };

  const hasAnyCustomization = Boolean(
    link.thumbnailUrl || link.customBgColor || link.customTextColor || link.customBorderColor || link.customShadow
  );

  return (
    <div className="mt-3 pt-3 border-t border-outline-variant/30 space-y-4 animate-in fade-in duration-200 text-xs">
      {/* 1. Thumbnail / Media */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-on-surface flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            <span>الصورة المصغرة للرابط (Thumbnail)</span>
          </label>
          {link.thumbnailUrl && (
            <button
              type="button"
              onClick={() => onUpdate({ ...link, thumbnailUrl: null })}
              className="text-error hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>إزالة الصورة</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {link.thumbnailUrl ? (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-sm shrink-0">
              <img src={link.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-surface-container-highest border border-dashed border-outline-variant/40 flex items-center justify-center text-on-surface-variant shrink-0">
              <ImageIcon className="w-5 h-5 opacity-50" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 flex-1">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-container-high text-on-surface font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              <span>{link.thumbnailUrl ? "تغيير الصورة" : "رفع صورة"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? "إخفاء" : "رابط خارجي"}</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
            className="hidden"
          />
        </div>

        {uploadError && <p className="text-error text-[11px] font-medium">{uploadError}</p>}

        {showUrlInput && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              dir="ltr"
              className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-xs"
            />
            <button
              type="button"
              onClick={() => onUpdate({ ...link, thumbnailUrl: urlInput.trim() || null })}
              className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs"
            >
              تطبيق
            </button>
          </div>
        )}
      </div>

      {/* 2. Color Overrides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-2.5 rounded-xl bg-surface-container-lowest/60 border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-on-surface">لون خلفية الزر</label>
            {link.customBgColor && (
              <button
                type="button"
                onClick={() => onUpdate({ ...link, customBgColor: null })}
                className="text-[10px] text-on-surface-variant hover:text-error"
              >
                تلقائي
              </button>
            )}
          </div>
          <AdvancedColorPicker
            value={link.customBgColor || "#1e293b"}
            onChange={(hex) => onUpdate({ ...link, customBgColor: hex })}
          />
        </div>

        <div className="p-2.5 rounded-xl bg-surface-container-lowest/60 border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-on-surface">لون الإطار (Border)</label>
            {link.customBorderColor && (
              <button
                type="button"
                onClick={() => onUpdate({ ...link, customBorderColor: null })}
                className="text-[10px] text-on-surface-variant hover:text-error"
              >
                تلقائي
              </button>
            )}
          </div>
          <AdvancedColorPicker
            value={link.customBorderColor || "#4edea3"}
            onChange={(hex) => onUpdate({ ...link, customBorderColor: hex })}
          />
        </div>
      </div>

      {/* 3. Shadow Style */}
      <div className="space-y-1.5 pt-1">
        <label className="font-semibold text-on-surface flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>تأثير الظل والتوهج للرابط</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SHADOW_OPTIONS.map((sh) => (
            <button
              key={sh.id}
              type="button"
              onClick={() => onUpdate({ ...link, customShadow: sh.id })}
              className={`py-1.5 px-2 rounded-lg text-center font-medium transition ${
                (link.customShadow || "none") === sh.id
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {sh.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Reset Button */}
      {hasAnyCustomization && (
        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={handleResetToTheme}
            className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-error-container/20 text-on-surface-variant hover:text-error transition flex items-center gap-1.5 font-semibold text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>استعادة مظهر السمة الافتراضية</span>
          </button>
        </div>
      )}
    </div>
  );
}
