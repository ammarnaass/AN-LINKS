"use client";

import React from "react";
import { Palette, Layout, Sparkles } from "lucide-react";
import { AppCard, AppInput } from "@/shared/ui";
import {
  NFC_CARD_MATERIALS,
  NfcCardConfigDTO,
  UpdateNfcCardInput,
} from "../types/nfc.types";

const ACCENT_SWATCHES = ["#4edea3", "#38bdf8", "#f59e0b", "#a855f7", "#f43f5e", "#ffffff"];

interface NfcDesignPanelProps {
  card: NfcCardConfigDTO;
  onPatch: (patch: UpdateNfcCardInput) => void;
}

export function NfcDesignPanel({ card, onPatch }: NfcDesignPanelProps) {
  const toggles: { key: keyof UpdateNfcCardInput; label: string; checked: boolean }[] = [
    { key: "showAvatar", label: "إظهار الصورة الشخصية", checked: card.showAvatar },
    { key: "showNfcIcon", label: "إظهار أيقونة موجات NFC", checked: card.showNfcIcon },
    { key: "showQrOnBack", label: "إظهار رمز QR على الوجه الخلفي", checked: card.showQrOnBack },
    { key: "showBarcodeOnBack", label: "إظهار الباركود الخطي على الوجه الخلفي", checked: card.showBarcodeOnBack },
  ];

  return (
    <AppCard className="p-5 sm:p-6 bg-surface-container-low border-outline-variant/25 space-y-6">
      <div className="flex items-center gap-2.5">
        <Palette className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-on-surface">تصميم ومظهر بطاقة NFC</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppInput
          label="الاسم المطبوع على البطاقة"
          value={card.cardTitle}
          onChange={(e) => onPatch({ cardTitle: e.target.value })}
          placeholder="مثال: فيصل السيف"
        />
        <AppInput
          label="المسمى الوظيفي / السطر الفرعي"
          value={card.cardSubtitle}
          onChange={(e) => onPatch({ cardSubtitle: e.target.value })}
          placeholder="مثال: صانع محتوى تقني"
        />
      </div>

      {/* Material Presets */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>خامة ولون البطاقة</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {NFC_CARD_MATERIALS.map((mat) => {
            const active = card.material === mat.key;
            return (
              <button
                key={mat.key}
                type="button"
                onClick={() => onPatch({ material: mat.key })}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition cursor-pointer ${
                  active
                    ? "border-primary bg-primary/10 text-on-surface shadow-sm"
                    : "border-outline-variant/25 bg-surface-container hover:border-outline-variant/50 text-on-surface-variant"
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: mat.previewSwatch }}
                />
                <span className="text-xs font-semibold truncate">{mat.labelAr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orientation & Accent Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-primary" />
            <span>اتجاه البطاقة</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "horizontal" as const, label: "أفقي (CR80)" },
              { key: "vertical" as const, label: "عمودي (طولي)" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onPatch({ orientation: item.key })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  card.orientation === item.key
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-outline-variant/25 bg-surface-container text-on-surface-variant"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface">اللون المميز (Accent)</label>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`اختيار اللون ${hex}`}
                onClick={() => onPatch({ accentColor: hex })}
                className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                  card.accentColor.toLowerCase() === hex.toLowerCase()
                    ? "border-primary scale-110"
                    : "border-outline-variant/40"
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
            <input
              type="color"
              value={card.accentColor}
              onChange={(e) => onPatch({ accentColor: e.target.value })}
              aria-label="اختيار لون مخصص"
              className="w-8 h-7 rounded cursor-pointer bg-transparent border-0"
            />
          </div>
        </div>
      </div>

      {/* Element Visibility Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-outline-variant/20">
        {toggles.map((t) => (
          <label
            key={t.key}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/20 cursor-pointer"
          >
            <span className="text-xs font-semibold text-on-surface">{t.label}</span>
            <input
              type="checkbox"
              checked={t.checked}
              onChange={(e) => onPatch({ [t.key]: e.target.checked })}
              className="w-4 h-4 accent-primary rounded"
            />
          </label>
        ))}
      </div>
    </AppCard>
  );
}
