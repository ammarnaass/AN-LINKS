"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeCustomizer } from "@/features/appearance";
import { usePreview } from "@/features/dashboard";
import { PhoneMockup } from "@/shared/ui/phone/PhoneMockup";
import { AppButton, AppBadge } from "@/shared/ui";
import { Check, Save, Smartphone, ExternalLink, X } from "lucide-react";
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
    displayName: preview.displayName,
    bio: preview.bio,
    avatarUrl: preview.avatarUrl,
    themeKey: preview.themeKey,
    accentColor: preview.accentColor,
    buttonStyle: preview.buttonStyle,
    borderRadius: preview.borderRadius,
    font: preview.font,
    backgroundType: preview.backgroundType,
    customBackground: preview.customBackground,
    buttonShadow: preview.buttonShadow,
    socialPosition: preview.socialPosition,
  });

  // Auto-save logic debounced 600ms with AbortController
  useEffect(() => {
    if (!preview.isLoaded) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setIsSaving(true);
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getProfilePayload()),
          signal: controller.signal,
        });
        if (res.ok) {
          const now = new Date();
          const timeStr = now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
          setLastAutoSaved(`محفوظ تلقائياً ${timeStr}`);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Auto-save failed", err);
        }
      } finally {
        if (abortControllerRef.current === controller) {
          setIsSaving(false);
        }
      }
    }, 600);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    preview.isLoaded,
    preview.themeKey,
    preview.accentColor,
    preview.buttonStyle,
    preview.borderRadius,
    preview.font,
    preview.displayName,
    preview.bio,
    preview.avatarUrl,
    preview.backgroundType,
    preview.customBackground,
    preview.buttonShadow,
    preview.socialPosition,
  ]);

  const handleManualSave = async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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
        setSavedSuccess(true);
        const now = new Date();
        const timeStr = now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
        setLastAutoSaved(`محفوظ ${timeStr}`);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Manual save failed", err);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsSaving(false);
      }
    }
  };

  const handleProfileChange = (newProfile: ProfileData) => {
    updateProfile({
      displayName: newProfile.displayName,
      bio: newProfile.bio || "",
      avatarUrl: newProfile.avatarUrl || undefined,
      themeKey: newProfile.themeKey || "layanDark",
      accentColor: newProfile.accentColor || "#4edea3",
      buttonStyle: newProfile.buttonStyle || "filled",
      borderRadius: newProfile.borderRadius || "rounded-xl",
      font: newProfile.font || "Cairo",
      backgroundType: newProfile.backgroundType || "THEME",
      customBackground: newProfile.customBackground !== undefined ? newProfile.customBackground : null,
      buttonShadow: newProfile.buttonShadow || "none",
      socialPosition: newProfile.socialPosition || "top",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs">
            <AppBadge variant="primary" dot size="sm">
              استوديو المظهر الحي
            </AppBadge>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant font-mono">@{preview.username}</span>
            {lastAutoSaved && (
              <span className="text-[11px] text-primary/80 mr-2">{lastAutoSaved}</span>
            )}
          </div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">تخصيص المظهر والهوية</h1>
          <p className="text-xs text-on-surface-variant">
            تحكم بكافة التفاصيل البصرية لصفحتك الشخصية وشاهد انعكاسها الفوري في مجسم الهاتف الذكي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Preview Toggle Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-semibold shadow-sm hover:bg-surface-container"
          >
            <Smartphone className="w-4 h-4 text-primary" />
            <span>معاينة الهاتف</span>
          </button>

          <AppButton
            variant="primary"
            size="md"
            isLoading={isSaving}
            onClick={handleManualSave}
            rightIcon={savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          >
            {savedSuccess ? "تم الحفظ بنجاح!" : isSaving ? "جاري الحفظ..." : "حفظ المظهر ونشره"}
          </AppButton>
        </div>
      </div>

      {/* Grid Layout: Customizer + Live Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <ThemeCustomizer
            profile={{
              displayName: preview.displayName,
              bio: preview.bio,
              avatarUrl: preview.avatarUrl,
              themeKey: preview.themeKey,
              accentColor: preview.accentColor,
              buttonStyle: preview.buttonStyle,
              borderRadius: preview.borderRadius,
              font: preview.font,
              backgroundType: preview.backgroundType,
              customBackground: preview.customBackground,
              buttonShadow: preview.buttonShadow,
              socialPosition: preview.socialPosition,
            }}
            onProfileChange={handleProfileChange}
          />
        </div>

        {/* Desktop Sticky Live Phone Mockup */}
        <div className="hidden lg:flex lg:col-span-5 justify-center sticky top-24">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[340px] mb-3 flex items-center justify-between px-2 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-on-surface-variant">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>المعاينة المباشرة</span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <a
                href={`/${preview.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline font-semibold transition"
              >
                <span>زيارة الصفحة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
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
              links={preview.links}
              socials={preview.socials}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Modal for Phone Preview (< 1024px) */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-4 max-h-[92vh] overflow-y-auto flex flex-col items-center relative">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-1.5 font-bold text-sm text-on-surface">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>معاينة الجوال الحية</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
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
              links={preview.links}
              socials={preview.socials}
            />
          </div>
        </div>
      )}
    </div>
  );
}
