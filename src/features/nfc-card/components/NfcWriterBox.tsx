"use client";

import React, { useEffect, useState } from "react";
import { Wifi, Copy, Check, ExternalLink, Smartphone } from "lucide-react";
import { AppCard, AppButton } from "@/shared/ui";

interface NfcWriterBoxProps {
  nfcTapUrl: string;
}

export function NfcWriterBox({ nfcTapUrl }: NfcWriterBoxProps) {
  const [webNfcSupported, setWebNfcSupported] = useState(false);
  const [nfcWriteState, setNfcWriteState] = useState<"idle" | "writing" | "done" | "error">("idle");
  const [nfcWriteMsg, setNfcWriteMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    setWebNfcSupported(typeof window !== "undefined" && "NDEFReader" in window);
  }, []);

  const handleCopyTapUrl = () => {
    navigator.clipboard?.writeText(nfcTapUrl).catch(() => {});
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleWriteNfcTag = async () => {
    if (!webNfcSupported) return;
    setNfcWriteState("writing");
    setNfcWriteMsg("قرّب شريحة NFC الفارغة من ظهر الهاتف الآن...");
    try {
      const NdefCtor = (
        window as unknown as {
          NDEFReader: new () => { write: (msg: unknown) => Promise<void> };
        }
      ).NDEFReader;
      const ndef = new NdefCtor();
      await ndef.write({ records: [{ recordType: "url", data: nfcTapUrl }] });
      setNfcWriteState("done");
      setNfcWriteMsg("تمت كتابة رابط بطاقتك على شريحة NFC بنجاح!");
    } catch (err) {
      setNfcWriteState("error");
      setNfcWriteMsg(
        err instanceof Error ? err.message : "تعذر الكتابة على الشريحة. تأكد من تفعيل NFC في الجهاز."
      );
    }
  };

  return (
    <AppCard className="p-5 sm:p-6 bg-surface-container-low border-outline-variant/25 space-y-4">
      <div className="flex items-center gap-2.5">
        <Wifi className="w-4 h-4 text-primary rotate-90" />
        <h3 className="text-sm font-bold text-on-surface">رابط البرمجة والكتابة على شريحة NFC</h3>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <code
          className="flex-1 min-w-0 text-xs font-mono bg-surface-container px-3 py-2 rounded-xl text-primary truncate border border-outline-variant/25"
          dir="ltr"
        >
          {nfcTapUrl}
        </code>
        <AppButton
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyTapUrl}
          leftIcon={copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copiedUrl ? "تم النسخ" : "نسخ الرابط"}
        </AppButton>
        <a
          href={nfcTapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-xs font-semibold text-on-surface transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>اختبار</span>
        </a>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container border border-outline-variant/20">
        <div className="flex items-center gap-2.5 text-xs text-on-surface-variant">
          <Smartphone className="w-4 h-4 text-primary shrink-0" />
          <span>
            {webNfcSupported
              ? "متصفحك يدعم الكتابة المباشرة على شرائح NFC (Web NFC)."
              : "للكتابة على الشريحة، افتح هذه الصفحة من Chrome على أندرويد أو انسخ الرابط أعلاه لتطبيق NFC Tools."}
          </span>
        </div>
        <AppButton
          type="button"
          variant="primary"
          size="sm"
          disabled={!webNfcSupported || nfcWriteState === "writing"}
          onClick={() => void handleWriteNfcTag()}
        >
          {nfcWriteState === "writing" ? "جاري الانتظار..." : "كتابة على الشريحة"}
        </AppButton>
      </div>

      {nfcWriteMsg && (
        <p className={`text-xs font-semibold ${nfcWriteState === "error" ? "text-error" : "text-primary"}`}>
          {nfcWriteMsg}
        </p>
      )}
    </AppCard>
  );
}
