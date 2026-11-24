"use client";

import React from "react";
import { Layers, Sparkles, Square, Box, Check } from "lucide-react";
import { CardStyle } from "../types/appearance.types";

interface CardStylePickerProps {
  cardStyle: CardStyle;
  onCardStyleChange: (style: CardStyle) => void;
}

interface CardOption {
  id: CardStyle;
  label: string;
  desc: string;
  icon: React.ElementType;
  previewClass: string;
}

const CARD_OPTIONS: CardOption[] = [
  {
    id: "glass",
    label: "زجاجي شفاف (Glass)",
    desc: "تأثير بلوري نصف شفاف مع ضبابية خلفية عصرية",
    icon: Layers,
    previewClass: "bg-surface-container-lowest/60 backdrop-blur-md border border-white/20 shadow-md",
  },
  {
    id: "solid",
    label: "مسمط معتم (Solid)",
    desc: "سطح نقي معتم بلون ثابت يمنح تبايناً فائقاً",
    icon: Square,
    previewClass: "bg-surface-container-low border border-outline-variant/40 shadow-md",
  },
  {
    id: "glow",
    label: "نيون مشع (Glow)",
    desc: "إطار متوهج بلون التمييز يجذب انتباه الزوار",
    icon: Sparkles,
    previewClass: "bg-surface-container-lowest/80 border border-primary/60 shadow-[0_0_15px_rgba(78,222,163,0.3)]",
  },
  {
    id: "outline",
    label: "مفرغ أنيق (Outline)",
    desc: "تصميم انسيابي بخطوط محيطية خفيفة بدون تعتيم",
    icon: Box,
    previewClass: "bg-transparent border-2 border-outline-variant/60",
  },
];

export function CardStylePicker({
  cardStyle = "glass",
  onCardStyleChange,
}: CardStylePickerProps) {
  const currentStyle = cardStyle || "glass";

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 shadow-xl border border-outline-variant/30 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-on-surface text-base">نمط بطاقة الحاوية (Card Style)</h3>
            <p className="text-xs text-on-surface-variant">
              اختر المظهر العام للحاوية الزجاجية أو المسمطة المحيطة بملفك وروابطك
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {CARD_OPTIONS.map((opt) => {
          const isSelected = currentStyle === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onCardStyleChange(opt.id)}
              className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? "bg-surface-container-high border-primary ring-2 ring-primary/40 shadow-lg"
                  : "bg-surface-container border-outline-variant/30 hover:border-white/20 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 left-3 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}

              <div className="flex items-start gap-2.5 mb-3">
                <span
                  className={`p-2 rounded-lg ${
                    isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant group-hover:text-primary"
                  } transition`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">{opt.label}</h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                    {opt.desc}
                  </p>
                </div>
              </div>

              {/* Visual preview strip */}
              <div
                className={`w-full h-8 rounded-lg ${opt.previewClass} flex items-center justify-center px-3 mt-1 transition`}
              >
                <div className="w-16 h-1.5 rounded-full bg-current opacity-25" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
