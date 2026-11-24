"use client";

import React from "react";
import { Trash2, Pin, Archive, Palette } from "lucide-react";
import { LinkData } from "../types/links.types";

interface LinkCardActionsProps {
  link: LinkData;
  onUpdate: (link: LinkData) => void;
  onDelete: (id: string) => void;
  onStartEdit: () => void;
  isCustomizing: boolean;
  setIsCustomizing: (val: boolean) => void;
  hasCustomStyles: boolean;
}

export function LinkCardActions({
  link,
  onUpdate,
  onDelete,
  onStartEdit,
  isCustomizing,
  setIsCustomizing,
  hasCustomStyles,
}: LinkCardActionsProps) {
  return (
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
          onClick={onStartEdit}
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
  );
}
