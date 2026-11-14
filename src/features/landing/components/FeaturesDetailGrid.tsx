import React from "react";
import { DETAILED_FEATURES } from "../constants/features-data";
import { BentoTile, AppBadge } from "@/shared/ui";
import { ShieldCheck, ShoppingBag, BarChart3, Palette, Clock, QrCode, Globe, Zap, ArrowLeft } from "lucide-react";

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "link-sentinel": <ShieldCheck className="w-6 h-6 text-amber-400" />,
  "digital-commerce": <ShoppingBag className="w-6 h-6 text-primary" />,
  "utm-analytics": <BarChart3 className="w-6 h-6 text-tertiary" />,
  "bento-customization": <Palette className="w-6 h-6 text-secondary" />,
  "smart-scheduling": <Clock className="w-6 h-6 text-emerald-400" />,
  "dynamic-qr": <QrCode className="w-6 h-6 text-cyan-400" />,
  "custom-domain": <Globe className="w-6 h-6 text-primary" />,
  "sub-accounts": <Zap className="w-6 h-6 text-secondary" />,
};

export function FeaturesDetailGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DETAILED_FEATURES.map((item, idx) => {
          const glow =
            item.id === "link-sentinel"
              ? "tertiary"
              : item.id === "bento-customization" || item.id === "sub-accounts"
              ? "secondary"
              : "primary";

          return (
            <BentoTile
              key={item.id}
              colSpan={1}
              glowColor={glow}
              icon={FEATURE_ICONS[item.id] || <Zap className="w-6 h-6 text-primary" />}
              title={item.title}
              description={item.description}
              badge={item.badge}
            >
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-on-surface-variant font-mono font-bold">
                  {item.metrics}
                </span>
                <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                  <span>اكتشف المزيد</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </BentoTile>
          );
        })}
      </div>
    </section>
  );
}
