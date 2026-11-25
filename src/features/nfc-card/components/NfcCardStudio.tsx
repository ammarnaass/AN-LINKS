"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Palette, SlidersHorizontal, QrCode, Save, Check, AlertCircle } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { NfcCardConfigDTO, UpdateNfcCardInput } from "../types/nfc.types";
import { NfcCardPreview } from "./NfcCardPreview";
import { NfcDesignPanel } from "./NfcDesignPanel";
import { NfcSettingsPanel } from "./NfcSettingsPanel";
import { BarcodeAndQrPanel } from "./BarcodeAndQrPanel";

type StudioTab = "design" | "settings" | "barcode";

export function NfcCardStudio() {
  const [card, setCard] = useState<NfcCardConfigDTO | null>(null);
  const [activeTab, setActiveTab] = useState<StudioTab>("design");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveQrSvg, setLiveQrSvg] = useState<string>("");
  const [liveQrPng, setLiveQrPng] = useState<string>("");

  useEffect(() => {
    fetch("/api/nfc-card")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success && data.card) {
          setCard(data.card);
          setLiveQrSvg(data.card.qrSvgMarkup);
          setLiveQrPng(data.card.qrPngDataUrl);
        } else {
          setErrorMsg("تعذر تحميل بيانات بطاقة NFC");
        }
      })
      .catch(() => setErrorMsg("تعذر الاتصال بالخادم"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!card) return;
    let active = true;
    Promise.all([
      QRCode.toString(card.qrScanUrl, {
        type: "svg",
        margin: 1,
        width: 240,
        color: { dark: card.qrForeground, light: card.qrBackground },
        errorCorrectionLevel: "M",
      }),
      QRCode.toDataURL(card.qrScanUrl, {
        margin: 2,
        width: 512,
        color: { dark: card.qrForeground, light: card.qrBackground },
        errorCorrectionLevel: "M",
      }),
    ])
      .then(([svg, png]) => {
        if (active) {
          setLiveQrSvg(svg);
          setLiveQrPng(png);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [card?.qrScanUrl, card?.qrForeground, card?.qrBackground]);

  const handlePatch = (patch: UpdateNfcCardInput) => {
    setErrorMsg(null);
    setIsDirty(true);
    setIsSaved(false);
    setCard((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleSave = async () => {
    if (!card) return;
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/nfc-card", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEnabled: card.isEnabled,
          cardTitle: card.cardTitle,
          cardSubtitle: card.cardSubtitle,
          material: card.material,
          orientation: card.orientation,
          accentColor: card.accentColor,
          showAvatar: card.showAvatar,
          showNfcIcon: card.showNfcIcon,
          showQrOnBack: card.showQrOnBack,
          showBarcodeOnBack: card.showBarcodeOnBack,
          targetMode: card.targetMode,
          customTargetUrl: card.customTargetUrl,
          vcardPhone: card.vcardPhone,
          vcardEmail: card.vcardEmail,
          vcardCompany: card.vcardCompany,
          qrForeground: card.qrForeground,
          qrBackground: card.qrBackground,
          barcodeValue: card.barcodeValue,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "فشل حفظ بيانات بطاقة NFC");
        return;
      }
      setCard(data.card);
      setIsDirty(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch {
      setErrorMsg("حدث خطأ في الاتصال أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-pulse">
        <div className="xl:col-span-7 h-96 rounded-3xl bg-surface-container-low" />
        <div className="xl:col-span-5 h-72 rounded-3xl bg-surface-container-low" />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-6 rounded-2xl bg-error-container/20 border border-error/30 text-error text-sm">
        {errorMsg || "تعذر تحميل استوديو بطاقة NFC"}
      </div>
    );
  }

  const tabs: { key: StudioTab; label: string; icon: React.ReactNode }[] = [
    { key: "design", label: "تصميم البطاقة", icon: <Palette className="w-4 h-4" /> },
    { key: "settings", label: "إعدادات NFC والكتابة", icon: <SlidersHorizontal className="w-4 h-4" /> },
    { key: "barcode", label: "كود QR والباركود", icon: <QrCode className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-black text-on-surface">استوديو بطاقة NFC والباركود</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            صمّم بطاقتك الذكية، وبرمج شريحة NFC، وحمّل كود QR والباركود الخطي بجودة طباعة عالية
          </p>
        </div>

        <AppButton
          type="button"
          variant="primary"
          size="md"
          isLoading={isSaving}
          onClick={() => void handleSave()}
          leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        >
          {isSaved ? "تم الحفظ!" : isDirty ? "حفظ التعديلات *" : "حفظ البطاقة"}
        </AppButton>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-error-container/20 border border-error/30 text-error text-xs flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-5 print:hidden">
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-surface-container-low border border-outline-variant/25">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === t.key
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {activeTab === "design" && <NfcDesignPanel card={card} onPatch={handlePatch} />}
          {activeTab === "settings" && <NfcSettingsPanel card={card} onPatch={handlePatch} />}
          {activeTab === "barcode" && (
            <BarcodeAndQrPanel
              card={card}
              liveQrSvg={liveQrSvg}
              liveQrPng={liveQrPng}
              onPatch={handlePatch}
            />
          )}
        </div>

        <div className="xl:col-span-5 xl:sticky xl:top-24">
          <NfcCardPreview card={card} liveQrSvg={liveQrSvg} />
        </div>
      </div>
    </div>
  );
}
