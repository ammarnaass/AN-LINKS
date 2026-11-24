"use client";

import React from "react";
import { useTranslation } from "@/shared/i18n";
import { getLandingContent } from "../constants/i18n";

function FloatingAnalyticsCard() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).phoneMockup;

  return (
    <div className="hidden lg:flex absolute -left-6 top-12 z-20 flex-col gap-2 p-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-60 transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-on-surface-variant font-semibold">{content.analyticsTitle}</span>
        <span className="inline-flex p-1 rounded-md bg-primary-container/15 text-primary">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-on-surface font-mono">+14,280</span>
        <span className="text-xs text-primary font-bold font-mono">{content.analyticsGrowth}</span>
      </div>
      <svg className="w-full h-8 text-primary overflow-visible mt-1" fill="none" viewBox="0 0 100 24">
        <path d="M0 18 Q 20 8, 35 15 T 65 5 T 100 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
        <path d="M0 18 Q 20 8, 35 15 T 65 5 T 100 2 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1" />
      </svg>
    </div>
  );
}

function FloatingHealthCard() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).phoneMockup;

  return (
    <div className="hidden lg:flex absolute -right-6 bottom-16 z-20 items-center gap-3.5 p-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-64 transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
      <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined text-[24px]">verified_user</span>
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-on-surface">{content.sentinelTitle}</span>
          <span className="w-2 h-2 rounded-full bg-primary-container" />
        </div>
        <span className="text-xs text-primary truncate">{content.sentinelDesc}</span>
      </div>
    </div>
  );
}

function FloatingSaleCard() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).phoneMockup;

  return (
    <div className="hidden lg:flex absolute -right-2 top-8 z-20 items-center gap-3 p-3.5 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-white/5">
      <div className="w-9 h-9 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center">
        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-on-surface font-bold">{content.saleTitle}</span>
        <span className="text-[11px] text-on-surface-variant font-mono">{content.saleTime}</span>
      </div>
    </div>
  );
}

function PhoneBentoTiles() {
  const { locale, direction } = useTranslation();
  const content = getLandingContent(locale).phoneMockup;
  const arrowIcon = direction === "rtl" ? "arrow_back" : "arrow_forward";

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 hover:bg-surface-container transition-colors cursor-pointer">
        <div className="relative w-full h-28 rounded-lg overflow-hidden bg-surface-container-high">
          <img
            className="w-full h-full object-cover"
            alt="Studio content"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiHQG-5svtX-byGr_5cfpU0mSLy0pofVz155SvSQQH1UwfxOH314vLEALfTETuPcpFpVborvY04-gRQQ5j0UOWNybAKJm6nI4sMsXlKFvWuYNZAf3HzfMxMFFC--yeAENJu8o-r3sUcTxmvgr-VQz4gtN7NDci5-hRrqOjyquNEayOUDOWhju3b6VME6vbBRITTVzHkNhLqHCidvKyWx33-wgjG-43Bn8EAopprhsv"
          />
          <div className="absolute inset-0 bg-surface-container-lowest/40 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[22px]">play_arrow</span>
            </div>
          </div>
          <div className="absolute bottom-2 end-2 px-2 py-0.5 rounded bg-surface-container-lowest/80 text-[10px] font-mono text-primary font-bold">
            {content.videoBadge}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface truncate">{content.videoTitle}</span>
          <span className="material-symbols-outlined text-[18px] text-outline">{arrowIcon}</span>
        </div>
      </div>

      <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </div>
          <div className="flex flex-col text-start">
            <span className="text-xs font-bold text-on-surface">{content.productTitle}</span>
            <span className="text-[10px] text-on-surface-variant">{content.productDesc}</span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-md bg-secondary-container/50 text-secondary-fixed text-xs font-bold">
          {content.productPrice}
        </span>
      </div>

      <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-tertiary-container/30 text-tertiary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
          </div>
          <div className="flex flex-col text-start">
            <span className="text-xs font-bold text-on-surface">{content.podcastTitle}</span>
            <span className="text-[10px] text-outline">{content.podcastDesc}</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">headphones</span>
      </div>

      <div className="w-full bg-surface-container-high/60 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-on-surface">{content.newsletterTitle}</span>
          <span className="material-symbols-outlined text-primary text-[16px]">mail</span>
        </div>
        <div className="flex items-center gap-1.5">
          <input className="w-full bg-surface-container-lowest px-2.5 py-1.5 rounded-md text-[12px] text-on-surface placeholder:text-outline focus:outline-none" placeholder={content.newsletterPlaceholder} type="email" />
          <button className="bg-primary-container text-on-primary-container px-3 py-1.5 rounded-md text-[12px] font-bold" type="button">{content.newsletterButton}</button>
        </div>
      </div>
    </div>
  );
}

export function PhoneMockup() {
  const { locale } = useTranslation();
  const content = getLandingContent(locale).phoneMockup;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
      <FloatingAnalyticsCard />
      <FloatingHealthCard />
      <FloatingSaleCard />

      <div className="relative w-[340px] sm:w-[375px] rounded-[44px] bg-surface-container-highest p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/5">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-surface-container-lowest rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-surface-variant" />
          <div className="w-8 h-1 rounded-full bg-surface-variant" />
        </div>

        <div className="w-full bg-surface-container-lowest rounded-[36px] overflow-hidden p-5 pt-12 flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary-container via-tertiary-container to-secondary-container shadow-md">
              <img
                className="w-full h-full rounded-full object-cover"
                alt={content.creatorName}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtCG1l8MU-TPAQrrs-GnIqgHe1fT59n-QyRn_tJngVy1VGTaGPHCFTyDM4lxxo3RY6_PHzL2lTNP0YnCgOgIYYDe9AUnxO17nl4M9EmqUHKpy3Iz9Oiubce8kfv2Yvf3c7nArj_M_wjENrNH2cBPWC1HZpp_zWn9sQk_yC_CYtusrDwFLQW8wRN18rjuuUZfcecQRUGAYZ8PoElkIx6bHGaYo6Z8LsXVHskw1Lostl"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-on-surface text-center">{content.creatorName}</h3>
          <p className="text-xs text-on-surface-variant text-center max-w-[260px] mt-1 mb-4 leading-relaxed">
            {content.creatorBio}
          </p>

          <div className="flex items-center gap-2 mb-5">
            {["play_circle", "chat", "podcasts", "mail"].map((icon) => (
              <span key={icon} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </span>
            ))}
          </div>

          <PhoneBentoTiles />

          <div className="mt-6 flex items-center gap-1 opacity-60">
            <span className="text-[11px] text-outline">Powered by</span>
            <span className="text-[11px] text-primary font-bold">AN LINKS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
