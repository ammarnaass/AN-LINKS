"use client";

import React from "react";
import { NfcCardConfigDTO, NfcMaterialOption, NfcCardShapeOption } from "../types/nfc.types";
import { PrintSide } from "../types/nfc-print.types";
import { CardFrontFace } from "./CardFrontFace";
import { CardBackFace } from "./CardBackFace";

interface NfcPrintSheetProps {
  card: NfcCardConfigDTO;
  material: NfcMaterialOption;
  shape: NfcCardShapeOption;
  qrMarkup: string;
  barcodeSvg: string;
  side: PrintSide;
  includeCropMarks: boolean;
  includeBleed: boolean;
}

export function NfcPrintSheet({
  card,
  material,
  shape,
  qrMarkup,
  barcodeSvg,
  side,
  includeCropMarks,
  includeBleed,
}: NfcPrintSheetProps) {
  const isVertical = card.orientation === "vertical";
  const isCustom = card.material === "custom";

  const cardStyle = isCustom
    ? { backgroundColor: card.customBgColor, color: card.customTextColor }
    : undefined;

  const cardDimensionsClass = isVertical
    ? "w-[53.98mm] h-[85.60mm]"
    : "w-[85.60mm] h-[53.98mm]";

  const renderCropMarks = () => {
    if (!includeCropMarks) return null;
    return (
      <div className="pointer-events-none absolute -inset-3 print:block hidden">
        {/* Top-Left Crop Marks */}
        <div className="absolute top-0 left-2 w-2 h-[0.5px] bg-black" />
        <div className="absolute top-2 left-0 h-2 w-[0.5px] bg-black" />
        {/* Top-Right Crop Marks */}
        <div className="absolute top-0 right-2 w-2 h-[0.5px] bg-black" />
        <div className="absolute top-2 right-0 h-2 w-[0.5px] bg-black" />
        {/* Bottom-Left Crop Marks */}
        <div className="absolute bottom-0 left-2 w-2 h-[0.5px] bg-black" />
        <div className="absolute bottom-2 left-0 h-2 w-[0.5px] bg-black" />
        {/* Bottom-Right Crop Marks */}
        <div className="absolute bottom-0 right-2 w-2 h-[0.5px] bg-black" />
        <div className="absolute bottom-2 right-0 h-2 w-[0.5px] bg-black" />
      </div>
    );
  };

  return (
    <div
      id="nfc-print-sheet-root"
      className="p-6 bg-white text-slate-900 rounded-2xl flex flex-wrap items-center justify-center gap-8 print:p-0 print:m-0 print:gap-6 print:bg-white"
    >
      {/* FRONT FACE */}
      {(side === "front" || side === "both") && (
        <div className="relative group p-2">
          {renderCropMarks()}
          <div
            id="nfc-card-print-front"
            style={cardStyle}
            className={`relative ${shape.radiusClass} border shadow-lg overflow-hidden flex flex-col justify-between ${
              material.bgClass
            } ${material.textClass} ${material.borderClass} ${cardDimensionsClass} ${
              includeBleed ? "ring-2 ring-dashed ring-slate-300 print:ring-0" : ""
            }`}
          >
            <CardFrontFace card={card} material={material} isVertical={isVertical} />
          </div>
          <div className="text-center text-[10px] font-mono text-slate-500 mt-2 print:hidden">
            الوجه الأمامي (CR80: 85.6mm × 53.98mm)
          </div>
        </div>
      )}

      {/* BACK FACE */}
      {(side === "back" || side === "both") && (
        <div className="relative group p-2">
          {renderCropMarks()}
          <div
            id="nfc-card-print-back"
            style={cardStyle}
            className={`relative ${shape.radiusClass} border shadow-lg overflow-hidden flex flex-col justify-between ${
              material.bgClass
            } ${material.textClass} ${material.borderClass} ${cardDimensionsClass} ${
              includeBleed ? "ring-2 ring-dashed ring-slate-300 print:ring-0" : ""
            }`}
          >
            <CardBackFace
              card={card}
              material={material}
              qrMarkup={qrMarkup}
              barcodeSvg={barcodeSvg}
              isVertical={isVertical}
            />
          </div>
          <div className="text-center text-[10px] font-mono text-slate-500 mt-2 print:hidden">
            الوجه الخلفي (رمز QR وباركود خطي)
          </div>
        </div>
      )}

      {/* Dedicated Print Stylesheet Injection */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #nfc-print-sheet-root,
          #nfc-print-sheet-root * {
            visibility: visible !important;
          }
          #nfc-print-sheet-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 10mm !important;
            background: white !important;
            box-shadow: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
}
