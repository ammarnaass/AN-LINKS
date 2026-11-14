"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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
  username: "faisal_client",
  displayName: "فيصل الشمري",
  bio: "صانع محتوى تقني وتجارة رقمية 🚀 | روابطي ومتاجري الرسمية",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  themeKey: "layanDark",
  accentColor: "#4edea3",
  buttonStyle: "filled",
  borderRadius: "rounded-xl",
  font: "Cairo",
  links: [
    { id: "1", title: "متجري الرقمي - قوالب وتطبيقات", url: "https://store.anlinks.dev", isActive: true, position: 0 },
    { id: "2", title: "قناتي على يوتيوب", url: "https://youtube.com/@faisal_demo", isActive: true, position: 1 },
    { id: "3", title: "حجز استشارة خاصة عبر واتساب", url: "https://wa.me/966501234567", isActive: true, position: 2 },
  ],
  socials: [
    { network: "x", url: "https://x.com/faisal_client", position: 0 },
    { network: "youtube", url: "https://youtube.com/@faisal_client", position: 1 },
    { network: "github", url: "https://github.com/faisal_client", position: 2 },
    { network: "instagram", url: "https://instagram.com/faisal_client", position: 3 },
  ],
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

