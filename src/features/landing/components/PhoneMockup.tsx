import React from "react";

export function PhoneMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center py-6">
      {/* Floating Card 1: Live Analytics Counter (Top-Left) */}
      <div className="hidden lg:flex absolute -left-6 top-12 z-20 flex-col gap-2 p-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-60 transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-semibold">زيارات اليوم المباشرة</span>
          <span className="inline-flex p-1 rounded-md bg-primary-container/15 text-primary">
            <span className="material-symbols-outlined text-[18px]">trending_up</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-on-surface font-mono">+14,280</span>
          <span className="text-xs text-primary font-bold font-mono">▲ 34.6%</span>
        </div>
        <svg className="w-full h-8 text-primary overflow-visible mt-1" fill="none" viewBox="0 0 100 24">
          <path d="M0 18 Q 20 8, 35 15 T 65 5 T 100 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
          <path d="M0 18 Q 20 8, 35 15 T 65 5 T 100 2 L 100 24 L 0 24 Z" fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>

      {/* Floating Card 2: Self-Healing Link Health Monitor (Bottom-Right) */}
      <div className="hidden lg:flex absolute -right-6 bottom-16 z-20 items-center gap-3.5 p-4 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-64 transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
        <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[24px]">verified_user</span>
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-on-surface">فاحص الروابط الذكي</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <span className="text-xs text-primary truncate">جميع الروابط تعمل 100% بنجاح</span>
        </div>
      </div>

      {/* Floating Card 3: New Sale Notification (Top-Right) */}
      <div className="hidden lg:flex absolute -right-2 top-8 z-20 items-center gap-3 p-3.5 bg-surface-container-high/90 backdrop-blur-xl rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-white/5">
        <div className="w-9 h-9 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-on-surface font-bold">مبيعة كتاب إلكتروني جديدة</span>
          <span className="text-[11px] text-on-surface-variant font-mono">149 ر.س • منذ دقيقتين</span>
        </div>
      </div>

      {/* Central Smartphone Chassis Simulator */}
      <div className="relative w-[340px] sm:w-[375px] rounded-[44px] bg-surface-container-highest p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-white/10">
        {/* Phone Speaker & Camera Notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-surface-container-lowest rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-surface-variant" />
          <div className="w-8 h-1 rounded-full bg-surface-variant" />
        </div>

        {/* Phone Display Canvas */}
        <div className="w-full bg-surface-container-lowest rounded-[36px] overflow-hidden p-5 pt-12 flex flex-col items-center">
          {/* Creator Avatar & Identity */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary via-tertiary to-secondary shadow-md flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center text-2xl font-bold text-white">
                ف
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-slate-900 flex items-center justify-center font-bold text-xs shadow">
              ✓
            </div>
          </div>

          <h3 className="text-base font-bold text-on-surface text-center">فيصل الشمري</h3>
          <p className="text-xs text-on-surface-variant text-center max-w-[260px] mt-1 mb-4 leading-relaxed">
            صانع محتوى تقني ومؤسس استوديو «ابتكار». أشارك أسرار الذكاء الاصطناعي والتجارة الرقمية.
          </p>

          {/* Social Quick Icons Row */}
          <div className="flex items-center gap-2 mb-4">
            {["play_circle", "chat", "podcasts", "mail"].map((icon) => (
              <span
                key={icon}
                className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </span>
            ))}
          </div>

          {/* Bento Bio Tiles Stack inside Phone */}
          <div className="w-full flex flex-col gap-2.5">
            {/* Tile 1: Video Bento Tile */}
            <div className="w-full bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 hover:bg-surface-container transition-colors cursor-pointer border border-white/5">
              <div className="relative w-full h-24 rounded-lg overflow-hidden bg-surface-container-high flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary text-slate-900 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-[22px]">play_arrow</span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/80 text-[10px] font-mono text-primary font-bold">
                  جديد 18:42 دقيقة
                </div>
              </div>
              <span className="text-xs font-bold text-on-surface truncate">
                دليل أدوات الذكاء الاصطناعي 2025
              </span>
            </div>

            {/* Tile 2: Product Bento Tile */}
            <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-on-surface truncate">كتاب احتراف هندسة الأوامر</span>
                  <span className="text-[10px] text-on-surface-variant">PDF + قوالب جاهزة</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-xs font-bold text-primary font-mono">149 ر.س</span>
                <span className="text-[9px] text-amber-400 font-bold">خصم 30%</span>
              </div>
            </div>

            {/* Tile 3: Consultation Bento Tile */}
            <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-on-surface truncate">حجز استشارة خاصة 45 دقيقة</span>
                  <span className="text-[10px] text-on-surface-variant">متاح 3 مقاعد فقط</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">arrow_back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
