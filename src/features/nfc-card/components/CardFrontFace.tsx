"use client";

import React from "react";
import { Wifi, ShieldAlert } from "lucide-react";
import { NfcCardConfigDTO, NfcMaterialOption } from "../types/nfc.types";
import { CardPatternOverlay } from "./CardPatternOverlay";

interface CardFrontFaceProps {
  card: NfcCardConfigDTO;
  material: NfcMaterialOption;
  isVertical?: boolean;
}

export function CardFrontFace({ card, material, isVertical = false }: CardFrontFaceProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 select-none overflow-hidden">
      <CardPatternOverlay pattern={card.cardPattern} accent={card.accentColor} />

      {/* Top Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: card.accentColor }}
          />
          <span className="text-[11px] font-black tracking-widest uppercase">AN LINKS</span>
        </div>

        <div className="flex items-center gap-2">
          {card.cardPattern === "chip" && (
            <div
              className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border border-amber-700/40 shadow-inner"
              aria-label="Smart Chip"
            />
          )}
          {card.showNfcIcon && (
            <Wifi className="w-5 h-5 rotate-90 opacity-85" style={{ color: card.accentColor }} />
          )}
        </div>
      </div>

      {/* Profile & Name Center */}
      <div
        className={`relative z-10 flex ${
          isVertical ? "flex-col items-center text-center gap-3 my-auto" : "items-center gap-4 my-auto"
        }`}
      >
        {card.showAvatar && (
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden border-2 shrink-0 bg-white/10 flex items-center justify-center font-black text-lg shadow-sm"
            style={{ borderColor: card.accentColor }}
          >
            {card.avatarUrl ? (
              <img
                src={card.avatarUrl}
                alt={card.cardTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{card.cardTitle.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
        )}

        <div className="min-w-0">
          <h4 className="text-base sm:text-lg font-black leading-snug truncate">
            {card.cardTitle || card.username}
          </h4>
          {card.cardSubtitle && (
            <p className={`text-xs mt-0.5 truncate ${material.mutedClass}`}>
              {card.cardSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Footer link & status */}
      <div className="relative z-10 flex items-center justify-between gap-2 text-[11px]">
        <span className={`font-mono ${material.mutedClass}`} dir="ltr">
          anlinks.dev/{card.username}
        </span>
        {!card.isEnabled && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
            <ShieldAlert className="w-3 h-3" />
            <span>موقوفة</span>
          </span>
        )}
      </div>

      {/* Accent Edge Line */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-1"
        style={{ backgroundColor: card.accentColor }}
      />
    </div>
  );
}
