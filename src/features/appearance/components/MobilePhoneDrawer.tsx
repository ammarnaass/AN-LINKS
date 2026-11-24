"use client";

import React from "react";
import { Smartphone, X } from "lucide-react";
import { PhoneMockup } from "@/shared/ui/phone/PhoneMockup";
import { PreviewState } from "@/features/dashboard";

export interface MobilePhoneDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preview: PreviewState;
}

export function MobilePhoneDrawer({ isOpen, onClose, preview }: MobilePhoneDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-4 max-h-[92vh] overflow-y-auto flex flex-col items-center relative">
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-1.5 font-bold text-sm text-on-surface">
            <Smartphone className="w-4 h-4 text-primary" />
            <span>معاينة الجوال الحية</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
            aria-label="إغلاق المعاينة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <PhoneMockup
          showFloatingCards={false}
          username={preview.username}
          displayName={preview.displayName}
          bio={preview.bio}
          avatarUrl={preview.avatarUrl}
          themeKey={preview.themeKey}
          accentColor={preview.accentColor}
          buttonStyle={preview.buttonStyle}
          borderRadius={preview.borderRadius}
          font={preview.font}
          backgroundType={preview.backgroundType}
          customBackground={preview.customBackground}
          buttonShadow={preview.buttonShadow}
          socialPosition={preview.socialPosition}
          cardStyle={preview.cardStyle}
          bgOverlayOpacity={preview.bgOverlayOpacity}
          links={preview.links}
          socials={preview.socials}
        />
      </div>
    </div>
  );
}
