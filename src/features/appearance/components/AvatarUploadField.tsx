"use client";

import React, { useState, useRef } from "react";
import { Upload, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";

interface AvatarUploadFieldProps {
  avatarUrl?: string | null;
  displayName: string;
  onAvatarChange: (url: string | null) => void;
}

export function AvatarUploadField({
  avatarUrl,
  displayName,
  onAvatarChange,
}: AvatarUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialLetter = (displayName?.trim()?.charAt(0) || "ر").toUpperCase();

  const handleUploadFile = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("يرجى اختيار ملف صورة صالح (PNG, JPEG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("الحد الأقصى لحجم الصورة هو 5 ميجابايت");
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
        throw new Error(data.error || "فشل رفع الصورة");
      }

      onAvatarChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصورة";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar click & preview */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative group cursor-pointer shrink-0 transition-transform ${
            isDragging ? "scale-105" : ""
          }`}
          title="انقر لتغيير الصورة"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || "صورة المستخدم"}
              className="w-20 h-20 rounded-full object-cover shadow-[0_0_24px_rgba(78,222,163,0.25)] ring-2 ring-primary/40 group-hover:opacity-85 transition"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-2xl shadow-[0_0_24px_rgba(78,222,163,0.25)] ring-2 ring-primary/40 select-none group-hover:bg-primary/30 transition">
              {initialLetter}
            </div>
          )}

          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-md">
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[13px]">photo_camera</span>
            )}
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Upload controls */}
        <div className="flex flex-col gap-1.5 text-center sm:text-right flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-90 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الرفع...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع صورة جديدة</span>
                </>
              )}
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={() => onAvatarChange(null)}
                className="px-3 py-1.5 rounded-xl bg-surface-container-high text-error hover:bg-error-container/30 text-xs font-medium transition flex items-center gap-1"
                title="حذف الصورة والعودة للحرف الرمزي"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>إزالة</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-2.5 py-1.5 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-medium transition flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? "إخفاء الرابط" : "رابط صورة"}</span>
            </button>
          </div>

          <p className="text-[11px] text-on-surface-variant">
            اسحب وأفلت صورتك هنا، أو انقر للاختيار (PNG, JPG, WebP بحد أقصى 5MB).
          </p>

          {uploadError && (
            <p className="text-xs text-error font-medium">{uploadError}</p>
          )}

          {showUrlInput && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={avatarUrl || ""}
                onChange={(e) => onAvatarChange(e.target.value.trim() || null)}
                dir="ltr"
                className="w-full max-w-sm px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 text-on-surface text-xs outline-none focus:border-primary text-right"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
