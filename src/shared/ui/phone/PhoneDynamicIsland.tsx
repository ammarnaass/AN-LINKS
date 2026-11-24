"use client";

import React, { useState, useEffect } from "react";
import { Wifi, Battery, Sparkles } from "lucide-react";

export function PhoneDynamicIsland() {
  const [timeStr, setTimeStr] = useState("9:41");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full pt-2.5 px-5 pb-2 flex items-center justify-between text-[11px] font-bold text-on-surface select-none z-30 shrink-0">
      {/* Real Live Time Clock */}
      <span className="font-mono text-[11px] font-semibold tracking-tight w-10" dir="ltr">
        {timeStr}
      </span>

      {/* Interactive Dynamic Island Pill */}
      <div
        data-testid="dynamic-island-pill"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`dynamic-island-pill cursor-pointer transition-all duration-300 ease-out bg-black rounded-full flex items-center justify-between shadow-md border border-white/10 ${
          isExpanded ? "w-48 h-7 px-3 ring-1 ring-primary/40" : "w-24 h-5 px-2.5 hover:scale-105"
        }`}
        title="انقر لتوسيع الجزيرة التفاعلية"
      >
        {isExpanded ? (
          <div className="flex items-center justify-between w-full text-[10px] text-white animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400 font-mono">AN LINKS</span>
            </div>
            <span className="text-[9px] text-neutral-400">Live 100%</span>
          </div>
        ) : (
          <>
            {/* Front Camera Lens */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#161616] ring-1 ring-white/10" />
            {/* Live Indicator Dot */}
            <div className="w-2 h-2 rounded-full bg-emerald-500/90 animate-pulse" />
          </>
        )}
      </div>

      {/* Connectivity Icons */}
      <div className="flex items-center gap-1.5 opacity-90 w-12 justify-end" dir="ltr">
        <span className="text-[9px] font-mono font-bold text-primary">5G</span>
        <Wifi className="w-3 h-3 text-on-surface" />
        <Battery className="w-3.5 h-3.5 text-on-surface fill-on-surface/30" />
      </div>
    </div>
  );
}
