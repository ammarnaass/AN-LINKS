import React from "react";

export interface FloatingMetricCardProps {
  title: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  positionClasses: string;
}

export function FloatingMetricCard({
  title,
  value,
  delta,
  deltaType = "positive",
  icon,
  positionClasses,
}: FloatingMetricCardProps) {
  const deltaColor =
    deltaType === "positive"
      ? "text-primary"
      : deltaType === "negative"
      ? "text-error"
      : "text-on-surface-variant";

  return (
    <div
      className={`absolute z-20 bg-surface-container-high/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.35)] flex items-center gap-3 transition-transform hover:scale-105 pointer-events-auto ${positionClasses}`}
      dir="rtl"
    >
      <div className="w-9 h-9 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center ring-1 ring-white/10 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold text-on-surface-variant font-cairo">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-on-surface tracking-tight font-cairo">
            {value}
          </span>
          {delta && (
            <span className={`text-[10px] font-bold ${deltaColor} font-cairo`}>
              {delta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

