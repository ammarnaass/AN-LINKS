"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register service worker if supported
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // Graceful silent fallback
        });
    }

    // Check if app is already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    const dismissed = localStorage.getItem("anlinks_pwa_dismissed");
    if (dismissed) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsVisible(false);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("anlinks_pwa_dismissed", "true");
    } catch {
      // Storage unavailable fallback
    }
  };

  if (!isVisible && !deferredPrompt) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="تثبيت تطبيق AN LINKS"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-2xl bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/40 shadow-2xl transition animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-primary/15 text-primary flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-on-surface text-xs">تطبيق AN LINKS السريع</h4>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-md transition"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            ثبّت المنصة على شاشتك الرئيسية لتصفح أسرع وإدارة روابطك مباشرة دون الحاجة لمتجر التطبيقات.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 hover:opacity-90 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تثبيت التطبيق</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl text-on-surface-variant hover:text-on-surface text-xs font-semibold transition"
            >
              لاحقاً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
