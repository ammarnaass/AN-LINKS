"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  AVATAR_FRAME_SHAPES,
  AVATAR_BORDER_WIDTHS,
} from "../../constants/avatar-badge.constants";
import { AvatarFrameShape, AvatarBorderWidth } from "../../types/appearance.types";
import { AdvancedColorPicker } from "../AdvancedColorPicker";

interface AvatarFrameControlsProps {
  shape: AvatarFrameShape | string;
  borderWidth: AvatarBorderWidth | string;
  borderColor?: string | null;
  accentColor: string;
  onShapeChange: (shape: AvatarFrameShape) => void;
  onWidthChange: (width: AvatarBorderWidth) => void;
  onColorChange: (color: string) => void;
}

export function AvatarFrameControls({
  shape,
  borderWidth,
  borderColor,
  accentColor,
  onShapeChange,
  onWidthChange,
  onColorChange,
}: AvatarFrameControlsProps) {
  const currentShape = shape || "circle";
  const currentWidth = borderWidth || "2";

  return (
    <div className="space-y-4 pt-3 border-t border-outline-variant/20">
      <div>
        <label className="block text-xs font-bold text-on-surface mb-2">
          شكل إطار الصورة الشخصية
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {AVATAR_FRAME_SHAPES.map((s) => {
            const isSelected = currentShape === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onShapeChange(s.value)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary shadow-xs"
                    : "border-outline-variant/25 hover:border-outline-variant/50 bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <div
                  className={`w-6 h-6 border-2 border-current flex items-center justify-center ${
                    s.borderRadius || ""
                  }`}
                  style={s.clipPath ? { clipPath: s.clipPath } : undefined}
                />
                <span className="text-[11px] truncate">{s.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block text-xs font-bold text-on-surface mb-2">
            سمك الخط المحيط بالصورة (Stroke Width)
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {AVATAR_BORDER_WIDTHS.map((w) => {
              const isSelected = currentWidth === w.value;
              return (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => onWidthChange(w.value)}
                  className={`py-2 px-1 rounded-xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary text-on-primary border-primary shadow-xs"
                      : "bg-surface-container-low border-outline-variant/25 text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="text-xs font-mono">{w.px}px</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <AdvancedColorPicker
            value={borderColor || accentColor}
            onChange={onColorChange}
            label="لون إطار الصورة (Border Color)"
          />
        </div>
      </div>
    </div>
  );
}
