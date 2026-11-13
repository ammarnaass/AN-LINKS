import React from "react";
import {
  InstagramIcon,
  TwitterXIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/public/SocialIcons";
import {
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function PhoneMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center py-6">
      {/* Floating Card 1: Live Analytics Counter (Left-Top) */}
      <div className="hidden lg:flex absolute -left-4 xl:-left-8 top-12 z-20 flex-col gap-2 p-4 bg-surface-container-high/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-64 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-on-surface">إحصاءات حية</span>
          </div>
          <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
            +١٤.٢٪ ↗
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black text-on-surface">٢٨,٤٥٠</span>
          <span className="text-[10px] text-on-surface-variant font-medium">زيارة حقيقية</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="h-1.5 flex-1 bg-surface-container-lowest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-4/5 animate-pulse" />
          </div>
          <span className="text-[10px] text-outline">معدل نقر 32%</span>
        </div>
      </div>

      {/* Floating Card 2: Sales Toast (Right-Bottom) */}
      <div className="hidden lg:flex absolute -right-4 xl:-right-8 bottom-16 z-20 flex-col gap-2 p-4 bg-surface-container-high/90 border border-white/10 backdrop-blur-xl rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] w-64 transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-tertiary/20 text-tertiary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-on-surface">مبيعات رقمية مباشرة</span>
          </div>
          <span className="text-[10px] text-on-surface-variant">الآن</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-semibold text-on-surface truncate">
            دليل التصميم الذكي v2
          </span>
          <span className="text-xs font-bold text-primary font-mono">$49.00</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-medium">
          ✓ تم استلام الدفعة وتحويل المشتري تلقائياً
        </span>
      </div>

      {/* Center Phone Device Container */}
      <div className="relative mx-auto max-w-[320px] sm:max-w-[340px]">
        {/* Outer Phone Shell */}
        <div className="relative rounded-[48px] p-3.5 bg-gray-900 border border-white/10 shadow-2xl ring-1 ring-gray-800 shadow-primary/10">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-900 border border-gray-800" />
          </div>

          {/* Screen Content */}
          <div className="relative overflow-hidden rounded-[38px] bg-gradient-to-b from-[#0f131c] via-[#141824] to-[#0a0e16] text-on-surface p-6 pt-10 min-h-[580px] flex flex-col items-center justify-between">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-3 w-full">
              {/* Avatar with Glow Ring */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary via-tertiary to-secondary p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white uppercase overflow-hidden">
                    ط
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-slate-900 rounded-full p-0.5 shadow">
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </div>
              </div>

              {/* Names */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-bold text-base text-white">طارق المنصور</h3>
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-[11px] font-mono text-primary/80 dir-ltr" dir="ltr">
                  @tariq
                </p>
              </div>

              {/* Bio */}
              <p className="text-xs text-on-surface-variant leading-relaxed max-w-[260px]">
                صانع محتوى تقني ورائد أعمال 🚀 أشارككم أحدث أدوات الذكاء الاصطناعي وتطوير المنتجات الرقمية.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-2 pt-1">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition">
                  <TwitterXIcon className="w-3 h-3" />
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition">
                  <LinkedinIcon className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Bento Links Deck */}
            <div className="w-full space-y-2.5 my-4">
              <div className="w-full p-3 rounded-xl bg-surface-container-high border border-white/5 text-right flex items-center justify-between text-xs font-semibold text-white transition shadow-sm hover:border-primary/40">
                <div className="flex items-center gap-2">
                  <span>🛍️ متجري الإلكتروني - عتاد ذكي</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-primary text-slate-900 text-[9px] font-bold">
                    خصم 20%
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </div>

              <div className="w-full p-3 rounded-xl bg-surface-container border border-white/5 text-right flex items-center justify-between text-xs font-medium text-on-surface-variant transition shadow-sm hover:bg-surface-container-high">
                <span>🎥 بودكاست تقنية الغد - الحلقة 42</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </div>

              <div className="w-full p-3 rounded-xl bg-gradient-to-l from-primary-container to-emerald-700 text-slate-950 font-bold text-right flex items-center justify-between text-xs transition shadow-md shadow-primary/20">
                <span>💬 حجز استشارة خاصة 1:1</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Platform Watermark */}
            <div className="text-[10px] text-on-surface-variant font-medium tracking-wide">
              ⚡ صُمم بواسطة AN LINKS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
