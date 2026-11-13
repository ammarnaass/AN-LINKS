"use client";

import React, { useState } from "react";
import { Trash2, ArrowUp, ArrowDown, ExternalLink, GripVertical } from "lucide-react";
import { LinkData } from "../types/links.types";
import { CATEGORIES } from "../constants/categories";
import { validateLinkInput } from "../validators/link.validator";

interface LinkCardItemProps {
  link: LinkData;
  index: number;
  totalCount: number;
  onUpdate: (updated: LinkData) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

export function LinkCardItem({
  link,
  index,
  totalCount,
  onUpdate,
  onDelete,
  onMove,
}: LinkCardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [error, setError] = useState<string | null>(null);

  const catObj = CATEGORIES.find((c) => c.id === link.category) || CATEGORIES[4];

  const handleSave = () => {
    const validation = validateLinkInput({ title: editTitle, url: editUrl });
    if (!validation.valid || !validation.normalizedUrl) {
      setError(validation.error || "بيانات التعديل غير صحيحة");
      return;
    }

    onUpdate({
      ...link,
      title: validation.title!,
      url: validation.normalizedUrl,
    });
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <div className="rounded-xl p-4 bg-surface-container border border-primary/40 shadow-md space-y-3">
        {error && <p className="text-xs text-error">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface text-sm"
          />
          <input
            type="text"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            dir="ltr"
            className="px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface text-sm text-right"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high text-xs text-on-surface-variant"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs"
          >
            حفظ
          </button>
        </div>
      </div>
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
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${catObj.color}`}>
                {catObj.label}
              </span>
              {!link.isActive && (
                <span className="px-2 py-0.5 rounded-full bg-error-container/20 text-error text-[11px]">
                  مسودة مخفية
                </span>
              )}
            </div>

            <h4 className="font-bold text-on-surface text-base mt-1.5 truncate">{link.title}</h4>

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

            <div className="flex flex-wrap items-center gap-3 mt-2 pt-1">
              <span className="inline-flex items-center gap-1 text-primary text-xs bg-primary/10 px-2 py-0.5 rounded font-mono">
                <span className="material-symbols-outlined text-[13px]">ads_click</span>
                <span>{link.clicks ? link.clicks.toLocaleString("ar-SA") : "٠"} نقرة</span>
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-primary text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>200 OK • سليم</span>
              </div>
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
    </div>
  );
}
