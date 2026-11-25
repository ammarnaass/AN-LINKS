"use client";

import React, { useMemo } from "react";
import { QrCode, Download, Printer, Barcode, Contact } from "lucide-react";
import { AppCard, AppButton, AppInput } from "@/shared/ui";
import { NfcCardConfigDTO, UpdateNfcCardInput } from "../types/nfc.types";
import { generateCode128Svg } from "../utils/code128";
import { buildVCardPayload } from "../utils/vcard";

interface BarcodeAndQrPanelProps {
  card: NfcCardConfigDTO;
  liveQrSvg?: string;
  liveQrPng?: string;
  onPatch: (patch: UpdateNfcCardInput) => void;
}

function downloadBlob(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function BarcodeAndQrPanel({
  card,
  liveQrSvg,
  liveQrPng,
  onPatch,
}: BarcodeAndQrPanelProps) {
  const barcodeSvg = useMemo(
    () =>
      generateCode128Svg(card.barcodeValue || `AN-${card.username.toUpperCase()}`, {
        fgColor: "#0f172a",
        bgColor: "#ffffff",
        height: 52,
        showText: true,
      }),
    [card.barcodeValue, card.username]
  );

  const qrSvg = liveQrSvg || card.qrSvgMarkup;
  const qrPng = liveQrPng || card.qrPngDataUrl;

  const handleDownloadVCard = () => {
    const vcf = buildVCardPayload({
      fullName: card.cardTitle || card.username,
      title: card.cardSubtitle || undefined,
      company: card.vcardCompany || undefined,
      phone: card.vcardPhone || undefined,
      email: card.vcardEmail || undefined,
      profileUrl: card.qrScanUrl,
    });
    downloadBlob(vcf, `${card.username}.vcf`, "text/vcard;charset=utf-8");
  };

  return (
    <div className="space-y-5">
      {/* QR Code Customizer & Exporter */}
      <AppCard className="p-5 sm:p-6 bg-surface-container-low border-outline-variant/25 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-on-surface">مولّد كود QR القابل للطباعة</h3>
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant" dir="ltr">
            {card.qrScanUrl}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="w-40 h-40 rounded-2xl border border-outline-variant/30 p-3 shadow-md shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
            style={{ backgroundColor: card.qrBackground }}
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />

          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-on-surface">لون الرمز</span>
                <input
                  type="color"
                  value={card.qrForeground}
                  onChange={(e) => onPatch({ qrForeground: e.target.value })}
                  className="w-8 h-6 rounded cursor-pointer bg-transparent border-0"
                />
              </label>
              <label className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between gap-2 cursor-pointer">
                <span className="text-xs font-semibold text-on-surface">لون الخلفية</span>
                <input
                  type="color"
                  value={card.qrBackground}
                  onChange={(e) => onPatch({ qrBackground: e.target.value })}
                  className="w-8 h-6 rounded cursor-pointer bg-transparent border-0"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={qrPng}
                download={`${card.username}-qr.png`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-90 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل PNG عالي الدقة</span>
              </a>
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadBlob(qrSvg, `${card.username}-qr.svg`, "image/svg+xml")}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                تحميل SVG (طباعة)
              </AppButton>
            </div>
          </div>
        </div>
      </AppCard>

      {/* Linear Code128 Barcode */}
      <AppCard className="p-5 sm:p-6 bg-surface-container-low border-outline-variant/25 space-y-4">
        <div className="flex items-center gap-2.5">
          <Barcode className="w-4 h-4 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-on-surface">الباركود الخطي (Code 128 Barcode)</h3>
            <p className="text-xs text-on-surface-variant">
              باركود تسلسلي قياسي لطباعته على البطاقات أو الفواتير ومسحه بأجهزة قراءة الباركود
            </p>
          </div>
        </div>

        <AppInput
          label="قيمة الباركود (أحرف وأرقام إنجليزية)"
          value={card.barcodeValue}
          onChange={(e) => onPatch({ barcodeValue: e.target.value.replace(/[^\x20-\x7e]/g, "") })}
          placeholder={`AN-${card.username.toUpperCase()}`}
          dir="ltr"
        />

        <div
          className="w-full max-w-sm mx-auto rounded-2xl bg-white p-3 border border-outline-variant/30 shadow-sm [&>svg]:w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: barcodeSvg }}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20">
          <div className="flex flex-wrap gap-2">
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                downloadBlob(barcodeSvg, `${card.username}-barcode.svg`, "image/svg+xml")
              }
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              تحميل الباركود SVG
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadVCard}
              leftIcon={<Contact className="w-3.5 h-3.5" />}
            >
              تنزيل ملف vCard
            </AppButton>
          </div>

          <AppButton
            type="button"
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            طباعة البطاقة والباركود
          </AppButton>
        </div>
      </AppCard>
    </div>
  );
}
