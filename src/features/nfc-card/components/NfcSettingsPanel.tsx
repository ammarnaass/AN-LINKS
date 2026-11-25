"use client";

import React from "react";
import { ShieldCheck, Activity, Link2, Contact, UserCircle2 } from "lucide-react";
import { AppCard, AppInput, AppBadge } from "@/shared/ui";
import { NfcCardConfigDTO, NfcTargetMode, UpdateNfcCardInput } from "../types/nfc.types";
import { NfcWriterBox } from "./NfcWriterBox";

interface NfcSettingsPanelProps {
  card: NfcCardConfigDTO;
  onPatch: (patch: UpdateNfcCardInput) => void;
}

export function NfcSettingsPanel({ card, onPatch }: NfcSettingsPanelProps) {
  const modes: { key: NfcTargetMode; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: "BIO_PAGE",
      title: "صفحة البايو الرئيسية",
      desc: `يفتح صفحة /${card.username} مع تسجيل زيارة NFC`,
      icon: <UserCircle2 className="w-4 h-4 text-primary" />,
    },
    {
      key: "DIRECT_URL",
      title: "رابط مخصص مباشر",
      desc: "تحويل فوري إلى واتساب أو متجر أو موقع خارجي",
      icon: <Link2 className="w-4 h-4 text-sky-400" />,
    },
    {
      key: "VCARD",
      title: "بطاقة جهة اتصال (vCard)",
      desc: "تنزيل وحفظ اسمك ورقمك مباشرة في دفتر الهاتف",
      icon: <Contact className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <div className="space-y-5">
      <AppCard className="p-5 sm:p-6 bg-surface-container-low border-outline-variant/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-on-surface">حالة بطاقة NFC</h3>
              <p className="text-xs text-on-surface-variant">
                يمكنك إيقاف التوجيه فوراً في حال فقدان البطاقة وإعادة تفعيله لاحقاً
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={card.isEnabled}
            onClick={() => onPatch({ isEnabled: !card.isEnabled })}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
              card.isEnabled
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-error-container/15 border-error/30 text-error"
            }`}
          >
            <span>{card.isEnabled ? "البطاقة مفعّلة" : "البطاقة موقوفة"}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-outline-variant/20 text-center">
          <div className="p-3 rounded-xl bg-surface-container">
            <div className="text-lg font-black text-on-surface">{card.tapCount}</div>
            <div className="text-[11px] text-on-surface-variant">لمسات NFC</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container">
            <div className="text-lg font-black text-on-surface">{card.qrScanCount}</div>
            <div className="text-[11px] text-on-surface-variant">مسحات QR</div>
          </div>
          <div className="p-3 rounded-xl bg-surface-container">
            <div className="text-xs font-bold text-primary flex items-center justify-center gap-1 h-7">
              <Activity className="w-3.5 h-3.5" />
              <span>
                {card.lastTappedAt
                  ? new Date(card.lastTappedAt).toLocaleDateString("ar-SA")
                  : "لا يوجد بعد"}
              </span>
            </div>
            <div className="text-[11px] text-on-surface-variant">آخر تفاعل</div>
          </div>
        </div>
      </AppCard>

      <AppCard className="p-5 sm:p-6 bg-surface-container-low border-outline-variant/25 space-y-4">
        <h3 className="text-sm font-bold text-on-surface">وجهة البطاقة عند التمرير (Tap Action)</h3>
        <div className="grid grid-cols-1 gap-2.5">
          {modes.map((m) => {
            const active = card.targetMode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onPatch({ targetMode: m.key })}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-3 transition cursor-pointer ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-outline-variant/25 bg-surface-container hover:border-outline-variant/50"
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-on-surface">{m.title}</div>
                  <div className="text-[11px] text-on-surface-variant">{m.desc}</div>
                </div>
                <AppBadge variant={active ? "success" : "neutral"} size="sm">
                  {active ? "مختار" : "اختيار"}
                </AppBadge>
              </button>
            );
          })}
        </div>

        {card.targetMode === "DIRECT_URL" && (
          <AppInput
            label="الرابط المخصص للتحويل الفوري"
            value={card.customTargetUrl}
            onChange={(e) => onPatch({ customTargetUrl: e.target.value })}
            placeholder="https://wa.me/966500000000"
            dir="ltr"
          />
        )}

        {card.targetMode === "VCARD" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AppInput
              label="رقم الجوال"
              value={card.vcardPhone}
              onChange={(e) => onPatch({ vcardPhone: e.target.value })}
              placeholder="+966500000000"
              dir="ltr"
            />
            <AppInput
              label="البريد الإلكتروني"
              value={card.vcardEmail}
              onChange={(e) => onPatch({ vcardEmail: e.target.value })}
              placeholder="name@domain.com"
              dir="ltr"
            />
            <AppInput
              label="الشركة / الجهة"
              value={card.vcardCompany}
              onChange={(e) => onPatch({ vcardCompany: e.target.value })}
              placeholder="اسم شركتك أو نشاطك"
            />
          </div>
        )}
      </AppCard>

      <NfcWriterBox nfcTapUrl={card.nfcTapUrl} />
    </div>
  );
}
