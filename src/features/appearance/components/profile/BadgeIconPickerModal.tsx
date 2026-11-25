"use client";

import React, { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";
import { BADGE_AVAILABLE_ICONS, BadgeIconItem } from "../../constants/avatar-badge.constants";
import { renderBadgeIconComponent } from "../../utils/avatar-frame.utils";

interface BadgeIconPickerModalProps {
  isOpen: boolean;
  selectedIcon: string;
  onSelect: (iconId: string) => void;
  onClose: () => void;
}

export function BadgeIconPickerModal({
  isOpen,
  selectedIcon,
  onSelect,
  onClose,
}: BadgeIconPickerModalProps) {
  const [filter, setFilter] = useState<string>("all");

  if (!isOpen) return null;

  const filteredIcons =
    filter === "all"
      ? BADGE_AVAILABLE_ICONS
      : BADGE_AVAILABLE_ICONS.filter((item) => item.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-cairo" dir="rtl">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">اختر أيقونة الشارة</h3>
              <p className="text-[11px] text-on-surface-variant">حدد الرمز التعبيري لشارة ملفك التعريفي</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Tabs */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-outline-variant/15 text-xs">
          {[
            { id: "all", label: "الكل" },
            { id: "verified", label: "التوثيق" },
            { id: "royalty", label: "التميز والملكية" },
            { id: "energy", label: "الطاقة والنشاط" },
            { id: "special", label: "خاص ورموز" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === cat.id
                  ? "bg-primary text-on-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 gap-3">
          {filteredIcons.map((iconItem: BadgeIconItem) => {
            const isSelected = selectedIcon === iconItem.id;
            return (
              <button
                key={iconItem.id}
                type="button"
                onClick={() => {
                  onSelect(iconItem.id);
                  onClose();
                }}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-container"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-inner">
                  {renderBadgeIconComponent(iconItem.id, 20)}
                </div>
                <span className="text-[11px] font-semibold text-center truncate max-w-full">
                  {iconItem.labelAr}
                </span>
                {isSelected && (
                  <span className="absolute top-1.5 start-1.5 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
