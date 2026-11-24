"use client";

import React, { useState, useEffect } from "react";
import { Sliders, RotateCw } from "lucide-react";

interface GradientBuilderProps {
  value?: string | null;
  onChange: (gradientCss: string) => void;
}

const COMMON_ANGLES = [
  { deg: 0, label: "0° (أعلى)" },
  { deg: 45, label: "45°" },
  { deg: 90, label: "90° (يمين)" },
  { deg: 135, label: "135° (مائل)" },
  { deg: 180, label: "180° (أسفل)" },
  { deg: 270, label: "270° (يسار)" },
];

function parseGradient(css?: string | null): { color1: string; color2: string; angle: number } {
  if (!css || !css.includes("gradient")) {
    return { color1: "#0f172a", color2: "#1e293b", angle: 135 };
  }

  const angleMatch = css.match(/(\d+)deg/i);
  const angle = angleMatch ? parseInt(angleMatch[1], 10) : 135;

  const hexMatches = css.match(/#[0-9a-fA-F]{3,8}/g);
  if (hexMatches && hexMatches.length >= 2) {
    return { color1: hexMatches[0], color2: hexMatches[1], angle };
  }

  return { color1: "#0f172a", color2: "#1e293b", angle };
}

export function GradientBuilder({ value, onChange }: GradientBuilderProps) {
  const initial = parseGradient(value);
  const [color1, setColor1] = useState(initial.color1);
  const [color2, setColor2] = useState(initial.color2);
  const [angle, setAngle] = useState(initial.angle);

  useEffect(() => {
    if (value && value.includes("gradient")) {
      const parsed = parseGradient(value);
      setColor1(parsed.color1);
      setColor2(parsed.color2);
      setAngle(parsed.angle);
    }
  }, [value]);

  const updateGradient = (c1: string, c2: string, a: number) => {
    const css = `linear-gradient(${a}deg, ${c1} 0%, ${c2} 100%)`;
    onChange(css);
  };

  const handleColor1Change = (val: string) => {
    setColor1(val);
    updateGradient(val, color2, angle);
  };

  const handleColor2Change = (val: string) => {
    setColor2(val);
    updateGradient(color1, val, angle);
  };

  const handleAngleChange = (newAngle: number) => {
    setAngle(newAngle);
    updateGradient(color1, color2, newAngle);
  };

  const currentCss = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;

  return (
    <div className="space-y-4 p-4 rounded-xl bg-surface-container/60 border border-outline-variant/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-bold text-on-surface">صانع التدرجات المخصص</h4>
        </div>
        <span className="text-[11px] font-mono text-on-surface-variant" dir="ltr">
          {angle}°
        </span>
      </div>

      {/* Live Preview Strip */}
      <div
        className="w-full h-12 rounded-xl shadow-inner border border-white/10 transition-all"
        style={{ background: currentCss }}
      />

      {/* Color Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
            اللون الأول (البداية)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color1.slice(0, 7)}
              onChange={(e) => handleColor1Change(e.target.value)}
              className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/40 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => handleColor1Change(e.target.value)}
              dir="ltr"
              className="flex-1 h-9 px-2 text-xs font-mono bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 text-center"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
            اللون الثاني (النهاية)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color2.slice(0, 7)}
              onChange={(e) => handleColor2Change(e.target.value)}
              className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/40 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => handleColor2Change(e.target.value)}
              dir="ltr"
              className="flex-1 h-9 px-2 text-xs font-mono bg-surface-container-lowest text-on-surface rounded-lg border border-outline-variant/40 text-center"
            />
          </div>
        </div>
      </div>

      {/* Angles */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1">
            <RotateCw className="w-3 h-3" />
            <span>زاوية التدفق</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ANGLES.map((item) => (
            <button
              key={item.deg}
              type="button"
              onClick={() => handleAngleChange(item.deg)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                angle === item.deg
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
