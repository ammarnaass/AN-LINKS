import React from "react";
import { Sparkles } from "lucide-react";

export function FeaturesHero() {
  return (
    <div className="text-center space-y-5 max-w-3xl mx-auto pt-12 pb-10 px-4">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
        <Sparkles className="w-3.5 h-3.5" />
        <span>منظومة متكاملة لروابط البايو</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
        كل أداة تحتاجها لتحويل جمهورك إلى{" "}
        <span className="text-primary">عملاء ومتابعين أوفياء</span>
      </h1>

      <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
        ابتكرنا منصة «روابط» لتتجاوز مجرد قائمة روابط عادية، لتصبح مركز تحكم تفاعلي يرفع مبيعاتك، يحمي روابطك، ويمنحك تحليلات دقيقة.
      </p>
    </div>
  );
}

