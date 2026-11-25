"use client";

import React from "react";
import { NfcCardConfigDTO, NfcMaterialOption } from "../types/nfc.types";
import { CardPatternOverlay } from "./CardPatternOverlay";

interface CardBackFaceProps {
  card: NfcCardConfigDTO;
  material: NfcMaterialOption;
  qrMarkup: string;
  barcodeSvg: string;
  isVertical?: boolean;
}

export function CardBackFace({
  card,
  material,
  qrMarkup,
  barcodeSvg,
  isVertical = false,
}: CardBackFaceProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 select-none overflow-hidden">
      <CardPatternOverlay pattern={card.cardPattern} accent={card.accentColor} />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-[10px] opacity-80">
        <span className="font-mono font-bold" dir="ltr">{card.cardCode}</span>
        <span>امسح الكود أو قرّب البطاقة</span>
      </div>

      {/* QR & Barcode Section */}
      <div
        className={`relative z-10 flex-1 flex ${
          isVertical ? "flex-col justify-center items-center" : "items-center justify-between"
        } gap-4 my-auto`}
      >
        {card.showQrOnBack && (
          <div
            className="w-24 h-24 rounded-xl bg-white p-1.5 shadow-md shrink-0 mx-auto [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrMarkup }}
          />
        )}

        {card.showBarcodeOnBack && (
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1.5">
            <div
              className="w-full max-w-[200px] rounded-lg overflow-hidden bg-white p-1 shadow-sm [&>svg]:w-full [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: barcodeSvg }}
            />
          </div>
        )}

        {!card.showQrOnBack && !card.showBarcodeOnBack && (
          <div className={`text-xs text-center w-full ${material.mutedClass}`}>
            تم إخفاء رمز QR والباركود من الوجه الخلفي
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 flex items-center justify-between text-[10px] opacity-75">
        <span className="font-semibold tracking-wider">AN LINKS SMART NFC</span>
        <span dir="ltr" className="font-mono">@{card.username}</span>
      </div>

      {/* Accent Edge Line */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-1"
        style={{ backgroundColor: card.accentColor }}
      />
    </div>
  );
}
