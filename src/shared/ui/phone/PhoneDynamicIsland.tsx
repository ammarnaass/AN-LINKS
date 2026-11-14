import React from "react";
import { Wifi, Battery } from "lucide-react";

export function PhoneDynamicIsland() {
  return (
    <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-on-surface select-none z-30 shrink-0">
      <span>9:41</span>
      {/* Dynamic Island pill */}
      <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-xs">
        <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
      </div>
      <div className="flex items-center gap-1.5 opacity-80">
        <Wifi className="w-3 h-3" />
        <Battery className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

