"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2, Image as ImageIcon, Link as LinkIcon, Loader2, Sparkles } from "lucide-react";

interface BackgroundImagePickerProps {
  customBackground?: string | null;
  bgOverlayOpacity?: number | null;
  onImageChange: (url: string | null) => void;
  onOverlayOpacityChange: (opacity: number) => void;
}

const CURATED_BACKGROUND_PRESETS = [
  { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80", label: "تجريدي داكن" },
  { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80", label: "تدرج ملون" },
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80", label: "طبيعة ساحرة" },
  { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80", label: "تقنية وسيركت" },
  { url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80", label: "جبال ونجوم" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80", label: "شاطئ هادئ" },
];

export function BackgroundImagePicker({
  customBackground,
  bgOverlayOpacity = 40,
  onImageChange,
  onOverlayOpacityChange,
}: BackgroundImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCurrentAnImage = customBackground && (
    customBackground.startsWith("/uploads/") ||
    customBackground.startsWith("http://") ||
    customBackground.startsWith("https://")
  );

  const handleUpload = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار ملف صورة صالح (PNG, JPEG, WebP)");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError("الحد الأقصى لحجم خلفية الصفحة هو 8 ميجابايت");
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
        throw new Error(data.error || "فشل رفع صورة الخلفية");
      }

      onImageChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصورة";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-90 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري الرفع...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>رفع صورة من جهازك</span>
              </>
            )}
          </button>

          {isCurrentAnImage && (
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="px-3 py-2 rounded-xl bg-surface-container-high text-error hover:bg-error-container/30 text-xs font-medium transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إزالة الخلفية</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3 py-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-medium transition flex items-center gap-1"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{showUrlInput ? "إخفاء الرابط" : "رابط خارجي"}</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
          className="hidden"
        />
      </div>

      {uploadError && <p className="text-xs text-error font-medium">{uploadError}</p>}

      {showUrlInput && (
        <div>
          <input
            type="text"
            placeholder="https://images.unsplash.com/photo-..."
            value={isCurrentAnImage ? customBackground : ""}
            onChange={(e) => onImageChange(e.target.value.trim() || null)}
            dir="ltr"
            className="w-full px-3.5 py-2 bg-surface-container-lowest text-on-surface rounded-xl text-xs border border-outline-variant/40 focus:outline-none focus:border-primary text-right"
          />
        </div>
      )}

      {/* Opacity Overlay Slider */}
      <div className="p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/30 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-on-surface">نسبة التعتيم على الصورة (Overlay)</label>
          <span className="font-mono text-primary font-bold">{bgOverlayOpacity ?? 40}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={bgOverlayOpacity ?? 40}
          onChange={(e) => onOverlayOpacityChange(parseInt(e.target.value, 10))}
          className="w-full accent-primary cursor-pointer"
        />
        <p className="text-[11px] text-on-surface-variant">
          يساعد التعتيم في إبراز الروابط والنصوص لتكون واضحة ومريحة للعين.
        </p>
      </div>

      {/* Preset Curated Images */}
      <div>
        <label className="block text-xs font-semibold text-on-surface mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>خلفيات سينمائية مقترحة (6 صور جاهزة)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CURATED_BACKGROUND_PRESETS.map((preset) => {
            const isSelected = customBackground === preset.url;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onImageChange(preset.url)}
                className={`relative h-20 rounded-xl overflow-hidden border transition-all group ${
                  isSelected ? "ring-2 ring-primary border-primary shadow-lg scale-[1.02]" : "border-white/10 hover:border-white/30"
                }`}
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                  <span className="text-[11px] font-bold text-white drop-shadow">{preset.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
