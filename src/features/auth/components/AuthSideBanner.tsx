import React from "react";
import { CheckCircle2, ArrowLeft, Sparkles, ShoppingBag, Calendar } from "lucide-react";

export function AuthSideBanner() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-8 xl:p-12 bg-gradient-to-br from-surface-container-high/90 via-surface-container to-surface-container-low rounded-[36px] border border-white/5 relative overflow-hidden shadow-2xl">
      {/* Background radial glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مجتمع النخبة الرقمي</span>
        </div>
        <span className="text-xs text-on-surface-variant font-mono">50,000+ مبدع</span>
      </div>

      {/* Creator Showcase Card */}
      <div className="relative z-10 my-8 p-6 rounded-2xl bg-surface-container-lowest/80 border border-white/5 shadow-2xl backdrop-blur-md space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="سارة العتيبي"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40 shadow-lg"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-primary text-on-primary rounded-full flex items-center justify-center shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-on-surface">سارة العتيبي</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                موثّق
              </span>
            </div>
            <p className="text-xs text-primary font-mono" dir="ltr">@sara.design</p>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          مصممة هوية بصرية واستشارية علامات تجارية فاخرة. أساعد المبدعين في تأسيس حضور رقمي استثنائي.
        </p>

        {/* 2 Simulated Bento Links */}
        <div className="space-y-2 pt-1">
          <div className="p-3 rounded-xl bg-surface-container-high/60 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-on-surface">حجز استشارة خاصة 1:1</span>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-on-surface-variant" />
          </div>

          <div className="p-3 rounded-xl bg-surface-container-high/60 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-on-surface">متجري الرقمي للقوالب الفاخرة</span>
            </div>
            <ArrowLeft className="w-3.5 h-3.5 text-on-surface-variant" />
          </div>
        </div>
      </div>

      {/* Bottom Social Proof */}
      <div className="relative z-10 pt-4 border-t border-white/5 text-xs text-on-surface-variant space-y-1">
        <p className="font-semibold text-on-surface">
          «منصة روابط وفرت عليّ استخدام 4 أدوات مختلفة وضاعفت مبيعات استشاراتي.»
        </p>
        <span className="text-[11px] text-outline">تقييم 4.9/5 من أكثر من 12,000 عميل</span>
      </div>
    </div>
  );
}

