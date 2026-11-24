"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeCustomizer, AppearanceHeader, MobilePhoneDrawer } from "@/features/appearance";
import { usePreview } from "@/features/dashboard";
import { PhoneMockup } from "@/shared/ui/phone/PhoneMockup";
import { Smartphone, ExternalLink } from "lucide-react";
import { ProfileData } from "@/features/appearance/types/appearance.types";

export default function AppearancePage() {
  const { preview, updateProfile } = usePreview();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const isFirstRender = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getProfilePayload = () => ({
    displayName: preview.displayName, bio: preview.bio, avatarUrl: preview.avatarUrl,
    themeKey: preview.themeKey, accentColor: preview.accentColor, buttonStyle: preview.buttonStyle,
    borderRadius: preview.borderRadius, font: preview.font, backgroundType: preview.backgroundType,
    customBackground: preview.customBackground, buttonShadow: preview.buttonShadow,
    socialPosition: preview.socialPosition, cardStyle: preview.cardStyle,
    bgOverlayOpacity: preview.bgOverlayOpacity,
  });

  const saveProfile = async (isManual = false) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getProfilePayload()),
        signal: controller.signal,
      });
      if (res.ok) {
        const timeStr = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
        setLastAutoSaved(isManual ? `محفوظ ${timeStr}` : `محفوظ تلقائياً ${timeStr}`);
        if (isManual) {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") console.error("Save failed", err);
    } finally {
      if (abortControllerRef.current === controller) setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!preview.isLoaded) return;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => saveProfile(false), 600);
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [
    preview.isLoaded, preview.themeKey, preview.accentColor, preview.buttonStyle,
    preview.borderRadius, preview.font, preview.displayName, preview.bio,
    preview.avatarUrl, preview.backgroundType, preview.customBackground,
    preview.buttonShadow, preview.socialPosition, preview.cardStyle, preview.bgOverlayOpacity,
  ]);

  const handleManualSave = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    saveProfile(true);
  };

  const handleProfileChange = (p: ProfileData) => {
    updateProfile({
      displayName: p.displayName, bio: p.bio || "", avatarUrl: p.avatarUrl || undefined,
      themeKey: p.themeKey || "layanDark", accentColor: p.accentColor || "#4edea3",
      buttonStyle: p.buttonStyle || "filled", borderRadius: p.borderRadius || "rounded-xl",
      font: p.font || "Cairo", backgroundType: p.backgroundType || "THEME",
      customBackground: p.customBackground !== undefined ? p.customBackground : null,
      buttonShadow: p.buttonShadow || "none", socialPosition: p.socialPosition || "top",
      cardStyle: p.cardStyle || "glass", bgOverlayOpacity: p.bgOverlayOpacity ?? 40,
    });
  };

  return (
    <div className="space-y-6">
      <AppearanceHeader
        username={preview.username}
        lastAutoSaved={lastAutoSaved}
        isSaving={isSaving}
        savedSuccess={savedSuccess}
        onManualSave={handleManualSave}
        onToggleMobilePreview={() => setShowMobilePreview(!showMobilePreview)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <ThemeCustomizer profile={getProfilePayload()} onProfileChange={handleProfileChange} />
        </div>

        <div className="hidden lg:flex lg:col-span-5 justify-center sticky top-24">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[340px] mb-3 flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>المعاينة المباشرة</span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <a href={`/${preview.username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline font-semibold transition">
                <span>زيارة الصفحة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <PhoneMockup
              showFloatingCards={false}
              username={preview.username} displayName={preview.displayName} bio={preview.bio}
              avatarUrl={preview.avatarUrl} themeKey={preview.themeKey} accentColor={preview.accentColor}
              buttonStyle={preview.buttonStyle} borderRadius={preview.borderRadius} font={preview.font}
              backgroundType={preview.backgroundType} customBackground={preview.customBackground}
              buttonShadow={preview.buttonShadow} socialPosition={preview.socialPosition}
              cardStyle={preview.cardStyle} bgOverlayOpacity={preview.bgOverlayOpacity}
              links={preview.links} socials={preview.socials}
            />
          </div>
        </div>
      </div>

      <MobilePhoneDrawer isOpen={showMobilePreview} onClose={() => setShowMobilePreview(false)} preview={preview} />
    </div>
  );
}
