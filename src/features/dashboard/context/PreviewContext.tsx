"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface PreviewLinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
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
  avatarUrl?: string;
  themeKey: string;
  accentColor: string;
  buttonStyle: "filled" | "outline" | "soft" | "shadow";
  borderRadius: "rounded-none" | "rounded-lg" | "rounded-xl" | "rounded-full";
  font: string;
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
  bio: "أهلاً بكم في صفحتي الشخصية على منصة روابط",
  avatarUrl: undefined,
  themeKey: "default",
  accentColor: "#4edea3",
  buttonStyle: "filled",
  borderRadius: "rounded-xl",
  font: "Cairo",
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
            avatarUrl: p.profile.avatarUrl ?? prev.avatarUrl,
            themeKey: p.profile.themeKey || prev.themeKey,
            accentColor: p.profile.accentColor || prev.accentColor,
            buttonStyle: p.profile.buttonStyle || prev.buttonStyle,
            borderRadius: p.profile.borderRadius || prev.borderRadius,
            font: p.profile.font || prev.font,
            links: l?.links || [],
            socials: l?.socials || [],
          }));
        }
      })
      .catch(() => {});
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
