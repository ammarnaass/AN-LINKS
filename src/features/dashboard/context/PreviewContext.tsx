"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface PreviewLinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
  thumbnailUrl?: string | null;
  customBgColor?: string | null;
  customTextColor?: string | null;
  customBorderColor?: string | null;
  customShadow?: string | null;
}

export interface PreviewSocialItem {
  network: string;
  url: string;
  position: number;
}

export interface PreviewState {
  username: string;
  displayName: string;
  bio: string;
  location?: string | null;
  avatarUrl?: string | null;
  themeKey: string;
  accentColor: string;
  buttonStyle: string;
  buttonShadow: string;
  borderRadius: string;
  font: string;
  backgroundType: string;
  customBackground: string | null;
  socialPosition: string;
  cardStyle: string;
  bgOverlayOpacity: number;
  avatarFrameShape: string;
  avatarBorderWidth: string;
  avatarBorderColor: string | null;
  badgeEnabled: boolean;
  badgeShape: string;
  badgeSize: string;
  badgeColor: string | null;
  badgeIcon: string;
  isLoaded: boolean;
  links: PreviewLinkItem[];
  socials: PreviewSocialItem[];
}

export interface PreviewContextValue {
  preview: PreviewState;
  updateProfile: (partial: Partial<PreviewState>) => void;
  updateLinks: (links: PreviewLinkItem[]) => void;
  updateSocials: (socials: PreviewSocialItem[]) => void;
}

const DEFAULT_PREVIEW: PreviewState = {
  username: "creator",
  displayName: "صانع محتوى",
  bio: "أهلاً بكم في صفحتي الشخصية على منصة AN LINKS",
  location: null,
  avatarUrl: null,
  themeKey: "layanDark",
  accentColor: "#4edea3",
  buttonStyle: "filled",
  buttonShadow: "none",
  borderRadius: "rounded-xl",
  font: "Cairo",
  backgroundType: "THEME",
  customBackground: null,
  socialPosition: "top",
  cardStyle: "glass",
  bgOverlayOpacity: 40,
  avatarFrameShape: "circle",
  avatarBorderWidth: "2",
  avatarBorderColor: null,
  badgeEnabled: true,
  badgeShape: "circle",
  badgeSize: "md",
  badgeColor: null,
  badgeIcon: "CheckCircle2",
  isLoaded: false,
  links: [],
  socials: [],
};

const PreviewContext = createContext<PreviewContextValue | undefined>(undefined);

export function PreviewProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: Partial<PreviewState>;
}) {
  const [preview, setPreview] = useState<PreviewState>({
    ...DEFAULT_PREVIEW,
    ...initialData,
    isLoaded: Boolean(initialData),
  });

  useEffect(() => {
    if (initialData) return;
    Promise.all([
      fetch("/api/profile").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/links").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([p, l]) => {
        if (p?.profile) {
          setPreview((prev) => ({
            ...prev,
            username: p.profile.username || prev.username,
            displayName: p.profile.displayName || prev.displayName,
            bio: p.profile.bio ?? prev.bio,
            location: p.profile.location ?? prev.location,
            avatarUrl: p.profile.avatarUrl ?? prev.avatarUrl,
            themeKey: p.profile.themeKey || prev.themeKey,
            accentColor: p.profile.accentColor || prev.accentColor,
            buttonStyle: p.profile.buttonStyle || prev.buttonStyle,
            buttonShadow: p.profile.buttonShadow || prev.buttonShadow,
            borderRadius: p.profile.borderRadius || prev.borderRadius,
            font: p.profile.font || prev.font,
            backgroundType: p.profile.backgroundType || prev.backgroundType,
            customBackground:
              p.profile.customBackground !== undefined
                ? p.profile.customBackground
                : prev.customBackground,
            socialPosition: p.profile.socialPosition || prev.socialPosition,
            cardStyle: p.profile.cardStyle || prev.cardStyle,
            bgOverlayOpacity: p.profile.bgOverlayOpacity ?? prev.bgOverlayOpacity,
            avatarFrameShape: p.profile.avatarFrameShape || prev.avatarFrameShape,
            avatarBorderWidth: p.profile.avatarBorderWidth || prev.avatarBorderWidth,
            avatarBorderColor: p.profile.avatarBorderColor ?? prev.avatarBorderColor,
            badgeEnabled: p.profile.badgeEnabled ?? prev.badgeEnabled,
            badgeShape: p.profile.badgeShape || prev.badgeShape,
            badgeSize: p.profile.badgeSize || prev.badgeSize,
            badgeColor: p.profile.badgeColor ?? prev.badgeColor,
            badgeIcon: p.profile.badgeIcon || prev.badgeIcon,
            links: l?.links || [],
            socials: l?.socials || [],
            isLoaded: true,
          }));
        } else {
          setPreview((prev) => ({ ...prev, isLoaded: true }));
        }
      })
      .catch(() => {
        setPreview((prev) => ({ ...prev, isLoaded: true }));
      });
  }, [initialData]);

  const updateProfile = useCallback((partial: Partial<PreviewState>) => {
    setPreview((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateLinks = useCallback((links: PreviewLinkItem[]) => {
    setPreview((prev) => ({ ...prev, links }));
  }, []);

  const updateSocials = useCallback((socials: PreviewSocialItem[]) => {
    setPreview((prev) => ({ ...prev, socials }));
  }, []);

  return (
    <PreviewContext.Provider value={{ preview, updateProfile, updateLinks, updateSocials }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
}
