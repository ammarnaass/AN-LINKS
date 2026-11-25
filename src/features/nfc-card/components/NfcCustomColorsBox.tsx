"use client";

import React from "react";
import { UpdateNfcCardInput } from "../types/nfc.types";

const BG_SWATCHES = ["#111827", "#0f172a", "#1e1b4b", "#064e3b", "#4c0519", "#ffffff"];
const TEXT_SWATCHES = ["#ffffff", "#e2e8f0", "#fde68a", "#0f172a"];

interface NfcCustomColorsBoxProps {
  customBgColor: string;
  customTextColor: string;
  onPatch: (patch: UpdateNfcCardInput) => void;
}

export function NfcCustomColorsBox({
  customBgColor,
  customTextColor,
  onPatch,
}: NfcCustomColorsBoxProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-surface-container border border-primary/25">
      <div className="space-y-2">
        <span className="text-xs font-bold text-on-surface block">لون الخلفية المخصص</span>
        <div className="flex flex-wrap items-center gap-2">
          {BG_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`خلفية ${hex}`}
              onClick={() =>
                onPatch({
                  customBgColor: hex,
                  customTextColor: hex === "#ffffff" ? "#0f172a" : customTextColor,
                })
              }
              className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                customBgColor.toLowerCase() === hex.toLowerCase()
                  ? "border-primary scale-110"
                  : "border-outline-variant/40"
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
          <input
            type="color"
            value={customBgColor}
            onChange={(e) => onPatch({ customBgColor: e.target.value })}
            aria-label="منتقي لون الخلفية"
            className="w-7 h-6 rounded cursor-pointer bg-transparent border-0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-on-surface block">لون النص</span>
        <div className="flex flex-wrap items-center gap-2">
          {TEXT_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`لون نص ${hex}`}
              onClick={() => onPatch({ customTextColor: hex })}
              className={`w-6 h-6 rounded-full border-2 transition cursor-pointer ${
                customTextColor.toLowerCase() === hex.toLowerCase()
                  ? "border-primary scale-110"
                  : "border-outline-variant/40"
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
          <input
            type="color"
            value={customTextColor}
            onChange={(e) => onPatch({ customTextColor: e.target.value })}
            aria-label="منتقي لون النص"
            className="w-7 h-6 rounded cursor-pointer bg-transparent border-0"
          />
        </div>
      </div>
    </div>
  );
}
