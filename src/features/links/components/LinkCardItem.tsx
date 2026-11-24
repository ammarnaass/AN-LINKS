"use client";

import React, { useState } from "react";
import { Trash2, ArrowUp, ArrowDown, ExternalLink, GripVertical, Pin, Archive, Palette } from "lucide-react";
import { LinkData } from "../types/links.types";
import { CATEGORIES } from "../constants/categories";
import { validateLinkInput } from "../validators/link.validator";
import { detectPlatform, DEFAULT_PLATFORM_PATTERNS } from "../services/platform-detector";
import { getSocialIcon } from "@/shared/ui";
import { LinkAppearanceCustomizer } from "./LinkAppearanceCustomizer";
import { LinkInlineEdit } from "./LinkInlineEdit";

interface LinkCardItemProps {
  link: LinkData;
  index: number;
  totalCount: number;
  onUpdate: (updated: LinkData) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

export function LinkCardItem({ link, index, totalCount, onUpdate, onDelete, onMove }: LinkCardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [error, setError] = useState<string | null>(null);

  const catObj = CATEGORIES.find((c) => c.id === link.category) || CATEGORIES[4];
  const platformSlug = link.platform?.slug || link.platformId || detectPlatform(link.url)?.slug;
  const matched = platformSlug ? DEFAULT_PLATFORM_PATTERNS.find((p) => p.slug === platformSlug) : null;
  const platformName = link.platform?.nameAr || matched?.nameAr || platformSlug;
  const platformColor = link.platform?.brandColor || matched?.brandColor;
  const PlatformIcon = platformSlug ? getSocialIcon(platformSlug) : null;

  const hasCustomStyles = Boolean(
    link.thumbnailUrl || link.customBgColor || link.customTextColor || link.customBorderColor || link.customShadow
  );

  const handleSave = () => {
    const validation = validateLinkInput({ title: editTitle, url: editUrl });
    if (!validation.valid || !validation.normalizedUrl) {
      setError(validation.error || "بيانات التعديل غير صحيحة");
      return;
    }

    const detected = detectPlatform(validation.normalizedUrl);
    onUpdate({
      ...link,
      title: validation.title!,
      url: validation.normalizedUrl,
      platformId: detected?.slug || link.platformId,
    });
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <LinkInlineEdit
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editUrl={editUrl}
        setEditUrl={setEditUrl}
        error={error}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
      />
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-4 transition-all border ${
        link.isActive
          ? "bg-surface-container hover:bg-surface-container-high border-outline-variant/30 hover:border-outline-variant/50 shadow-md"
          : "bg-surface-container-lowest/60 border-outline-variant/20 opacity-60 hover:opacity-85"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex flex-col items-center gap-0.5 mt-0.5 text-on-surface-variant">
            <button
              type="button"
              onClick={() => onMove(index, "up")}
              disabled={index === 0}
              title="تحريك لأعلى"
              className="p-1 rounded hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-20 transition"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <GripVertical className="w-4 h-4 text-outline cursor-grab" />
            <button
              type="button"
              onClick={() => onMove(index, "down")}
              disabled={index === totalCount - 1}
              title="تحريك لأسفل"
              className="p-1 rounded hover:bg-surface-container-highest hover:text-on-surface disabled:opacity-20 transition"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1 ${catObj.color}`}>
                {catObj.icon && <span className="material-symbols-outlined text-[12px]">{catObj.icon}</span>}
                <span>{catObj.label}</span>
              </span>
              {link.isPinned && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
                  <Pin className="w-3 h-3 fill-current" />
                  <span>مثبت</span>
                </span>
              )}
              {link.isArchived && (
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant/40 text-[11px] font-semibold flex items-center gap-1">
                  <Archive className="w-3 h-3" />
                  <span>مؤرشف</span>
                </span>
              )}
              {hasCustomStyles && (
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 text-[11px] font-semibold flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  <span>مظهر مخصص</span>
                </span>
              )}
              {!link.isActive && (
                <span className="px-2 py-0.5 rounded-full bg-error-container/20 text-error text-[11px]">
                  مسودة مخفية
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              {link.thumbnailUrl && (
                <img src={link.thumbnailUrl} alt="" className="w-5 h-5 rounded object-cover shrink-0 border border-white/20" />
              )}
              <h4 className="font-bold text-on-surface text-base truncate">{link.title}</h4>
            </div>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="text-right text-xs text-on-surface-variant hover:text-primary truncate max-w-sm mt-0.5 flex items-center gap-1"
            >
              <span>{link.url.replace(/^https?:\/\//i, "")}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex flex-wrap items-center gap-2.5 mt-2 pt-1">
              <span className="inline-flex items-center gap-1 text-primary text-xs bg-primary/10 px-2 py-0.5 rounded font-mono">
                <span className="material-symbols-outlined text-[13px]">ads_click</span>
                <span>{(link.clicksCount ?? link.clicks ?? 0).toLocaleString("ar-SA")} نقرة</span>
              </span>
              {platformSlug && platformSlug !== "custom" && PlatformIcon && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-[11px] font-medium text-on-surface">
                  {platformColor && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: platformColor }}
                    />
                  )}
                  <PlatformIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{platformName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={link.isActive}
              onChange={() => onUpdate({ ...link, isActive: !link.isActive })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-on-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container shadow-inner" />
          </label>

          <div className="flex items-center gap-1 text-on-surface-variant pt-1">
            <button
              type="button"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className={`p-1.5 rounded-lg transition-colors ${
                isCustomizing || hasCustomStyles
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "hover:bg-surface-container-highest hover:text-on-surface"
              }`}
              title="تخصيص مظهر الرابط"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ ...link, isPinned: !link.isPinned })}
              className={`p-1.5 rounded-lg transition-colors ${
                link.isPinned
                  ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                  : "hover:bg-surface-container-highest hover:text-on-surface"
              }`}
              title={link.isPinned ? "إلغاء التثبيت" : "تثبيت الرابط"}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ ...link, isArchived: !link.isArchived })}
              className={`p-1.5 rounded-lg transition-colors ${
                link.isArchived
                  ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  : "hover:bg-surface-container-highest hover:text-on-surface"
              }`}
              title={link.isArchived ? "إلغاء الأرشفة" : "أرشفة الرابط"}
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg hover:bg-surface-container-highest hover:text-on-surface transition-colors"
              title="تعديل الرابط"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(link.id)}
              className="p-1.5 rounded-lg hover:bg-error-container/30 hover:text-error transition-colors"
              title="حذف الرابط"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isCustomizing && (
        <LinkAppearanceCustomizer link={link} onUpdate={onUpdate} />
      )}
    </div>
  );
}
