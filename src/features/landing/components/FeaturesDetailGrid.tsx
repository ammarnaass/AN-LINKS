import React from "react";
import { DETAILED_FEATURES } from "../constants/features-data";
import { CheckCircle2 } from "lucide-react";

export function FeaturesDetailGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {DETAILED_FEATURES.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-7 bg-surface-container/60 hover:bg-surface-container-high/80 border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-xl flex flex-col justify-between group space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.colorClass}`}>
                  {item.badge}
                </span>
                <span className="text-[11px] font-bold text-on-surface-variant font-mono">
                  {item.metrics}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-primary/80 font-medium mt-1">
                  {item.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-xs text-primary font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>جاهز للاستخدام الفوري</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

