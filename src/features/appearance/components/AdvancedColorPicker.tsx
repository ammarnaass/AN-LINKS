"use client";

import React, { useState, useEffect } from "react";
import { Pipette } from "lucide-react";

export interface ColorPreset {
  hex: string;
  label: string;
}

export const DEFAULT_COLOR_PALETTE: ColorPreset[] = [
  { hex: "#4edea3", label: "زمردي" },
  { hex: "#2563EB", label: "أزرق ملكي" },
  { hex: "#7C3AED", label: "بنفسجي" },
  { hex: "#EC4899", label: "وردي" },
  { hex: "#F59E0B", label: "كهرماني" },
  { hex: "#EF4444", label: "ياقوتي" },
  { hex: "#06B6D4", label: "سماوي" },
  { hex: "#0f172a", label: "كحلي داكن" },
  { hex: "#1e293b", label: "سليت" },
  { hex: "#0b0f17", label: "فحمي" },
  { hex: "#faf7f2", label: "عاجي" },
  { hex: "#ffffff", label: "أبيض" },
];

interface AdvancedColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  palette?: ColorPreset[];
}

export function AdvancedColorPicker({
  value,
  onChange,
  label = "اختيار اللون",
  palette = DEFAULT_COLOR_PALETTE,
}: AdvancedColorPickerProps) {
  const [inputVal, setInputVal] = useState(value || "#4edea3");

  useEffect(() => {
    if (value) setInputVal(value);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#")) raw = `#${raw}`;
    setInputVal(raw);

    if (/^#([0-9a-fA-F]{3,8})$/.test(raw)) {
      onChange(raw);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setInputVal(hex);
    onChange(hex);
  };

  const safeColor = /^#([0-9a-fA-F]{3,8})$/.test(inputVal) ? inputVal : "#4edea3";

  return (
    <div className="space-y-3">
      {label && <label className="block text-xs font-semibold text-on-surface">{label}</label>}

      <div className="flex items-center gap-3">
        <label className="relative cursor-pointer shrink-0">
          <input
            type="color"
            value={safeColor.slice(0, 7)}
            onChange={handleColorChange}
            className="sr-only"
          />
          <div
            className="w-11 h-11 rounded-xl border border-outline-variant/50 shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{ backgroundColor: safeColor }}
          >
            <Pipette className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>
        </label>

        <div className="flex-1 relative">
          <input
            type="text"
            value={inputVal}
            onChange={handleTextChange}
            dir="ltr"
            placeholder="#4edea3"
            className="w-full h-11 px-3.5 bg-surface-container-lowest text-on-surface rounded-xl text-sm font-mono border border-outline-variant/40 focus:outline-none focus:border-primary text-center"
          />
        </div>
      </div>

      {palette.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {palette.map((item) => {
            const isSelected = value.toLowerCase() === item.hex.toLowerCase();
            return (
              <button
                key={item.hex}
                type="button"
                onClick={() => {
                  setInputVal(item.hex);
                  onChange(item.hex);
                }}
                className={`w-7 h-7 rounded-lg border transition-all ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low scale-110 border-white"
                    : "border-outline-variant/40 hover:scale-105"
                }`}
                style={{ backgroundColor: item.hex }}
                title={`${item.label} (${item.hex})`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
