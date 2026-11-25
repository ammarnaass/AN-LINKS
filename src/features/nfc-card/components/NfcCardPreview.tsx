"use client";

import React, { useMemo, useState } from "react";
import { RotateCw, Box, Printer, Layers } from "lucide-react";
import {
  NFC_CARD_MATERIALS,
  NFC_CARD_SHAPES,
  NfcCardConfigDTO,
} from "../types/nfc.types";
import { generateCode128Svg } from "../utils/code128";
import { CardFrontFace } from "./CardFrontFace";
import { CardBackFace } from "./CardBackFace";
import { NfcCard3DViewer } from "./NfcCard3DViewer";
import { NfcPrintModal } from "./NfcPrintModal";

interface NfcCardPreviewProps {
  card: NfcCardConfigDTO;
  liveQrSvg?: string;
}

export function NfcCardPreview({ card, liveQrSvg }: NfcCardPreviewProps) {
  const [face, setFace] = useState<"front" | "back">("front");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const material = useMemo(
    () => NFC_CARD_MATERIALS.find((m) => m.key === card.material) || NFC_CARD_MATERIALS[0],
    [card.material]
  );
  const shape = useMemo(
    () => NFC_CARD_SHAPES.find((s) => s.key === card.cardShape) || NFC_CARD_SHAPES[0],
    [card.cardShape]
  );
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
      {/* Top Controls: 2D vs 3D, Face Toggle & Print Modal */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant/25 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "3d"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>عرض 3D</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "2d"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>معاينة 2D</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "2d" && (
            <button
              type="button"
              onClick={() => setFace((f) => (f === "front" ? "back" : "front"))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-on-surface transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{face === "front" ? "قلب للخلف" : "قلب للأمام"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 text-xs font-bold transition cursor-pointer shadow-sm"
            title="طباعة وتصدير البطاقة بجودة عالية للمطابع"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة وتصدير</span>
          </button>
        </div>
      </div>

      {/* Render 3D Viewer or Flat 2D View */}
      {viewMode === "3d" ? (
        <NfcCard3DViewer card={card} liveQrSvg={liveQrSvg} />
      ) : (
        <div className="flex items-center justify-center p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden">
          <div
            id="nfc-printable-card"
            style={
              isCustom
                ? { backgroundColor: card.customBgColor, color: card.customTextColor }
                : undefined
            }
            className={`relative ${shape.radiusClass} border shadow-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
              material.bgClass
            } ${material.textClass} ${material.borderClass} ${
              isVertical ? "w-[265px] aspect-[1/1.586]" : "w-full max-w-[420px] aspect-[1.586/1]"
            }`}
          >
            {face === "front" ? (
              <CardFrontFace card={card} material={material} isVertical={isVertical} />
            ) : (
              <CardBackFace
                card={card}
                material={material}
                qrMarkup={qrMarkup}
                barcodeSvg={barcodeSvg}
                isVertical={isVertical}
              />
            )}
          </div>
        </div>
      )}

      {/* Print & High-Res Export Modal */}
      <NfcPrintModal
        card={card}
        liveQrSvg={liveQrSvg}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
}
