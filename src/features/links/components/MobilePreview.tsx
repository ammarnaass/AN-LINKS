"use client";

import React, { useState } from "react";
import { ProfileData } from "@/components/public/BioPageContent";
import { LinkData, SocialItem } from "../types/links.types";
import { ExternalLink, Smartphone, QrCode, Globe, RotateCw } from "lucide-react";
import { PhoneMockup, PhoneFinish, PhonePreviewMode } from "@/shared/ui/phone/PhoneMockup";
import { QrShareModal } from "@/features/bio";

interface MobilePreviewProps {
  profile: ProfileData;
  username: string;
  links: LinkData[];
  socials: SocialItem[];
  servicesCount?: number;
}

export function MobilePreview({ profile, username, links, socials, servicesCount = 0 }: MobilePreviewProps) {
  const [finish, setFinish] = useState<PhoneFinish>("titanium");
  const [mode, setMode] = useState<PhonePreviewMode>("simulator");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const publicUrl = `/${username}`;

  const FINISH_OPTIONS: Array<{ id: PhoneFinish; label: string; color: string }> = [
    { id: "titanium", label: "تيتانيوم", color: "bg-[#455063]" },
    { id: "obsidian", label: "أسود فلكي", color: "bg-[#1e232e]" },
    { id: "gold", label: "ذهبي", color: "bg-[#6b5835]" },
  ];

  return (
    <div className="flex flex-col items-center sticky top-20 select-none">
      {/* Upper Control Strip */}
      <div className="w-full max-w-[340px] mb-3 flex flex-col gap-2 px-1 text-xs">
        {/* Row 1: Status & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-on-surface">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>معاينة الهاتف</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mode Switcher Pill */}
            <div className="bg-surface-container-high/80 p-0.5 rounded-lg border border-outline-variant/30 flex items-center text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setMode("simulator")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  mode === "simulator"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="محاكي تفاعلي فائق السرعة"
              >
                تفاعلي
              </button>
              <button
                type="button"
                onClick={() => setMode("webview")}
                className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                  mode === "webview"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="متصفح ويب حقيقي Iframe"
              >
                ويب حقيقي
              </button>
            </div>

            {/* QR Scanner Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsQrOpen(true)}
              className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              title="مسح الباركود بكاميرا هاتفك الحقيقي"
              aria-label="عرض رمز QR"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>

            {/* Reload Preview */}
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              title="إعادة تحميل المعاينة"
              aria-label="تحديث المعاينة"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Chassis Finish Color Dots */}
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-outline">لون الهيكل:</span>
            <div className="flex items-center gap-1.5">
              {FINISH_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFinish(opt.id)}
                  className={`w-3.5 h-3.5 rounded-full ${opt.color} transition-all cursor-pointer ${
                    finish === opt.id ? "ring-2 ring-primary scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                  title={opt.label}
                  aria-label={opt.label}
                />
              ))}
            </div>
          </div>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-primary hover:text-primary-fixed font-semibold transition"
          >
            <span>زيارة الرابط</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Ultra-Realistic Phone Mockup */}
      <PhoneMockup
        showFloatingCards={false}
        finish={finish}
        mode={mode}
        refreshKey={refreshKey}
        username={username}
        displayName={profile.displayName}
        bio={profile.bio}
        location={profile.location}
        avatarUrl={profile.avatarUrl}
        themeKey={profile.themeKey}
        accentColor={profile.accentColor}
        buttonStyle={(profile.buttonStyle as any) || "filled"}
        borderRadius={(profile.borderRadius as any) || "rounded-xl"}
        font={profile.font || "Cairo"}
        cardStyle={profile.cardStyle}
        bgOverlayOpacity={profile.bgOverlayOpacity}
        backgroundType={profile.backgroundType}
        customBackground={profile.customBackground}
        socialPosition={profile.socialPosition}
        servicesCount={servicesCount}
        links={links.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          isActive: l.isActive,
          position: l.position,
          thumbnailUrl: l.thumbnailUrl,
          customBgColor: l.customBgColor,
          customTextColor: l.customTextColor,
          customBorderColor: l.customBorderColor,
          customShadow: l.customShadow,
        }))}
        socials={socials.map((s, idx) => ({
          network: s.network,
          url: s.url,
          position: idx,
        }))}
      />

      {/* QR Code Real Phone Scanner Modal */}
      <QrShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        username={username}
        displayName={profile.displayName}
      />
    </div>
  );
}
