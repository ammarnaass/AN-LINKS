"use client";

import React, { useState, useMemo } from "react";
import { Printer, Download, X, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { NfcCardConfigDTO, NFC_CARD_MATERIALS, NFC_CARD_SHAPES } from "../types/nfc.types";
import { PrintSide } from "../types/nfc-print.types";
import { generateCode128Svg } from "../utils/code128";
import {
  triggerCardPrint,
  exportElementToHighResPng,
  exportElementToSvg,
} from "../utils/nfc-canvas-export.utils";
import { NfcPrintSheet } from "./NfcPrintSheet";

interface NfcPrintModalProps {
  card: NfcCardConfigDTO;
  liveQrSvg?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NfcPrintModal({ card, liveQrSvg, isOpen, onClose }: NfcPrintModalProps) {
  const [side, setSide] = useState<PrintSide>("both");
  const [includeCropMarks, setIncludeCropMarks] = useState(true);
  const [includeBleed, setIncludeBleed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const material = useMemo(
    () => NFC_CARD_MATERIALS.find((m) => m.key === card.material) || NFC_CARD_MATERIALS[0],
    [card.material]
  );
  const shape = useMemo(
    () => NFC_CARD_SHAPES.find((s) => s.key === card.cardShape) || NFC_CARD_SHAPES[0],
    [card.cardShape]
  );

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

  if (!isOpen) return null;

  const handleExportPng = async () => {
    setIsExporting(true);
    try {
      if (side === "front" || side === "both") {
        const el = document.getElementById("nfc-card-print-front");
        if (el) await exportElementToHighResPng(el, `${card.username}-card-front-300dpi.png`);
      }
      if (side === "back" || side === "both") {
        const el = document.getElementById("nfc-card-print-back");
        if (el) await exportElementToHighResPng(el, `${card.username}-card-back-300dpi.png`);
      }
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSvg = () => {
    if (side === "front" || side === "both") {
      const el = document.getElementById("nfc-card-print-front");
      if (el) exportElementToSvg(el, `${card.username}-card-front.svg`);
    }
    if (side === "back" || side === "both") {
      const el = document.getElementById("nfc-card-print-back");
      if (el) exportElementToSvg(el, `${card.username}-card-back.svg`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-on-surface">
                استوديو الطباعة والتنزيل عالي الدقة (CR80)
              </h3>
              <p className="text-xs text-on-surface-variant">
                أبعاد قياسية للمطابع: 85.6mm × 53.98mm بدقة 300 DPI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface">عرض الوجه:</span>
            {(["both", "front", "back"] as PrintSide[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  side === s
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {s === "both" ? "الوجهان معاً" : s === "front" ? "الأمامي" : "الخلفي"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCropMarks}
                onChange={(e) => setIncludeCropMarks(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary"
              />
              <span className="font-semibold text-on-surface-variant">علامات القص</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeBleed}
                onChange={(e) => setIncludeBleed(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary"
              />
              <span className="font-semibold text-on-surface-variant">تسييل 3mm</span>
            </label>
          </div>
        </div>

        {/* Live Sheet Preview */}
        <div className="border border-outline-variant/25 rounded-2xl overflow-hidden shadow-inner bg-slate-100 p-4 sm:p-6 flex justify-center">
          <NfcPrintSheet
            card={card}
            material={material}
            shape={shape}
            qrMarkup={qrMarkup}
            barcodeSvg={barcodeSvg}
            side={side}
            includeCropMarks={includeCropMarks}
            includeBleed={includeBleed}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <AppButton
              type="button"
              variant="primary"
              size="md"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={triggerCardPrint}
            >
              طباعة البطاقة الآن
            </AppButton>

            <AppButton
              type="button"
              variant="outline"
              size="md"
              isLoading={isExporting}
              leftIcon={
                exportSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4" />
              }
              onClick={() => void handleExportPng()}
            >
              {exportSuccess ? "تم التنزيل بنجاح!" : "تنزيل PNG (300 DPI)"}
            </AppButton>

            <AppButton
              type="button"
              variant="outline"
              size="md"
              leftIcon={<FileCode className="w-4 h-4" />}
              onClick={handleExportSvg}
            >
              تصدير SVG متجهي
            </AppButton>
          </div>

          <AppButton type="button" variant="outline" size="md" onClick={onClose}>
            إغلاق
          </AppButton>
        </div>
      </div>
    </div>
  );
}
