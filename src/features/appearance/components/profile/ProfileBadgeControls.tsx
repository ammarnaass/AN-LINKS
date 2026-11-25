"use client";

import React, { useState } from "react";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import {
  BADGE_SHAPES,
  BADGE_SIZES,
  PRESET_BADGE_COLORS,
} from "../../constants/avatar-badge.constants";
import { BadgeShape, BadgeSize } from "../../types/appearance.types";
import { BadgeIconPickerModal } from "./BadgeIconPickerModal";
import { renderBadgeIconComponent } from "../../utils/avatar-frame.utils";
import { AdvancedColorPicker } from "../AdvancedColorPicker";

interface ProfileBadgeControlsProps {
  enabled: boolean;
  shape: BadgeShape | string;
  size: BadgeSize | string;
  color?: string | null;
  icon?: string | null;
  accentColor: string;
  onToggleEnabled: (enabled: boolean) => void;
  onShapeChange: (shape: BadgeShape) => void;
  onSizeChange: (size: BadgeSize) => void;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
}

export function ProfileBadgeControls({
  enabled,
  shape,
  size,
  color,
  icon = "CheckCircle2",
  accentColor,
  onToggleEnabled,
  onShapeChange,
  onSizeChange,
  onColorChange,
  onIconChange,
}: ProfileBadgeControlsProps) {
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);

  const currentShape = shape || "circle";
  const currentSize = size || "md";
  const currentColor = color || "#10b981";
  const currentIcon = icon || "CheckCircle2";

  return (
    <div className="space-y-4 pt-4 border-t border-outline-variant/20">
      {/* Toggle Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-on-surface">شارة التوثيق والتميز بجانب الاسم</h4>
          <p className="text-[11px] text-on-surface-variant">
            أضف لمسة موثوقية أو شعاراً خاصاً بجانب اسم حسابك
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggleEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
        </label>
      </div>

      {enabled && (
        <div className="space-y-4 p-4 rounded-2xl bg-surface-container-lowest/60 border border-outline-variant/25 animate-in fade-in duration-200">
          {/* Badge Icon Selector Button */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: currentColor }}
              >
                {renderBadgeIconComponent(currentIcon, 16)}
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">رمز وأيقونة الشارة</span>
                <span className="text-[10px] text-on-surface-variant font-mono">{currentIcon}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsIconModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تغيير الأيقونة</span>
            </button>
          </div>

          {/* Badge Shape and Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">شكل الشارة</label>
              <div className="grid grid-cols-5 gap-1.5">
                {BADGE_SHAPES.map((s) => {
                  const isSelected = currentShape === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => onShapeChange(s.value)}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-on-primary border-primary shadow-xs"
                          : "bg-surface-container-low border-outline-variant/25 text-on-surface-variant hover:text-on-surface"
                      }`}
                      title={s.labelAr}
                    >
                      <div
                        className={`w-4 h-4 border-2 border-current ${s.borderRadius || ""}`}
                        style={s.clipPath ? { clipPath: s.clipPath } : undefined}
                      />
                      <span className="text-[9px] truncate">{s.labelAr.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">حجم الشارة</label>
              <div className="grid grid-cols-4 gap-1.5">
                {BADGE_SIZES.map((sz) => {
                  const isSelected = currentSize === sz.value;
                  return (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => onSizeChange(sz.value)}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-on-primary border-primary shadow-xs"
                          : "bg-surface-container-low border-outline-variant/25 text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <span className="text-xs">{sz.labelAr.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Badge Color */}
          <AdvancedColorPicker
            value={currentColor}
            onChange={onColorChange}
            label="لون الشارة (Badge Color)"
          />
        </div>
      )}

      {/* Icon Picker Modal */}
      <BadgeIconPickerModal
        isOpen={isIconModalOpen}
        selectedIcon={currentIcon}
        onSelect={onIconChange}
        onClose={() => setIsIconModalOpen(false)}
      />
    </div>
  );
}
