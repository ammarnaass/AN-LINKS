"use client";

import React, { useMemo, useState } from "react";
import { Wifi, RotateCw, ShieldAlert } from "lucide-react";
import {
  NFC_CARD_MATERIALS,
  NFC_CARD_SHAPES,
  NfcCardConfigDTO,
} from "../types/nfc.types";
import { generateCode128Svg } from "../utils/code128";

interface NfcCardPreviewProps {
  card: NfcCardConfigDTO;
  liveQrSvg?: string;
}

function CardPatternOverlay({ pattern, accent }: { pattern: string; accent: string }) {
  if (pattern === "none") return null;
  if (pattern === "grid") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(to right, ${accent}55 1px, transparent 1px), linear-gradient(to bottom, ${accent}55 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />
    );
  }
  if (pattern === "waves") {
    return (
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 170 Q110 110 210 165 T400 140 L400 250 L0 250 Z" fill={accent} />
        <path d="M0 205 Q140 155 260 195 T400 180 L400 250 L0 250 Z" fill={accent} opacity="0.6" />
      </svg>
    );
  }
  return (
    <div
      className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-25 blur-2xl"
      style={{ backgroundColor: accent }}
    />
  );
}

export function NfcCardPreview({ card, liveQrSvg }: NfcCardPreviewProps) {
  const [face, setFace] = useState<"front" | "back">("front");
  const material =
    NFC_CARD_MATERIALS.find((m) => m.key === card.material) || NFC_CARD_MATERIALS[0];
  const shape = NFC_CARD_SHAPES.find((s) => s.key === card.cardShape) || NFC_CARD_SHAPES[0];
  const isVertical = card.orientation === "vertical";
  const isCustom = card.material === "custom";

  const barcodeSvg = useMemo(
    () =>
      generateCode128Svg(card.barcodeValue || `AN-${card.username.toUpperCase()}`, {
        fgColor: "#0f172a",
        bgColor: "#ffffff",
        height: 36,
        showText: true,
      }),
    [card.barcodeValue, card.username]
  );

  const qrMarkup = liveQrSvg || card.qrSvgMarkup;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant/25 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFace("front")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              face === "front"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            الوجه الأمامي
          </button>
          <button
            type="button"
            onClick={() => setFace("back")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              face === "back"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            الوجه الخلفي (QR وباركود)
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFace((f) => (f === "front" ? "back" : "front"))}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-on-surface transition cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>قلب البطاقة</span>
        </button>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden print:border-0 print:p-0">
        <div
          id="nfc-printable-card"
          style={
            isCustom
              ? { backgroundColor: card.customBgColor, color: card.customTextColor }
              : undefined
          }
          className={`relative ${shape.radiusClass} border shadow-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 ${
            material.bgClass
          } ${material.textClass} ${material.borderClass} ${
            isVertical ? "w-[265px] aspect-[1/1.586]" : "w-full max-w-[420px] aspect-[1.586/1]"
          }`}
        >
          <CardPatternOverlay pattern={card.cardPattern} accent={card.accentColor} />
          <div
            className="pointer-events-none absolute bottom-0 inset-x-0 h-1"
            style={{ backgroundColor: card.accentColor }}
          />

          {face === "front" ? (
            <>
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
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

              <div
                className={`relative z-10 flex ${
                  isVertical ? "flex-col items-center text-center gap-3 my-auto" : "items-center gap-4 my-auto"
                }`}
              >
                {card.showAvatar && (
                  <div
                    className="w-14 h-14 rounded-2xl overflow-hidden border-2 shrink-0 bg-white/10 flex items-center justify-center font-black text-lg"
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
            </>
          ) : (
            <div className="relative z-10 h-full flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between text-[10px] opacity-80">
                <span className="font-mono" dir="ltr">{card.cardCode}</span>
                <span>امسح الكود أو قرّب البطاقة</span>
              </div>

              <div
                className={`flex-1 flex ${
                  isVertical ? "flex-col justify-center" : "items-center justify-between"
                } gap-4`}
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

              <div className="flex items-center justify-between text-[10px] opacity-75">
                <span>AN LINKS SMART NFC</span>
                <span dir="ltr">@{card.username}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
