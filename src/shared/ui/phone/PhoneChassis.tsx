import React from "react";

export type PhoneFinish = "titanium" | "obsidian" | "gold";

export interface PhoneChassisProps {
  children?: React.ReactNode;
  finish?: PhoneFinish;
  className?: string;
}

const FINISH_STYLES: Record<
  PhoneFinish,
  {
    outerBorder: string;
    rimGradient: string;
    buttonColor: string;
    glowShadow: string;
  }
> = {
  titanium: {
    outerBorder: "border-[#384252]",
    rimGradient: "from-[#1a2332] via-[#0f141f] to-[#0a0d14]",
    buttonColor: "bg-[#455063]",
    glowShadow: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(78,222,163,0.18)]",
  },
  obsidian: {
    outerBorder: "border-[#1e232e]",
    rimGradient: "from-[#0d121c] via-[#070a10] to-[#030508]",
    buttonColor: "bg-[#29303d]",
    glowShadow: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,0,0,0.7)]",
  },
  gold: {
    outerBorder: "border-[#5c4a2c]",
    rimGradient: "from-[#2e2619] via-[#1a150e] to-[#0c0906]",
    buttonColor: "bg-[#6b5835]",
    glowShadow: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.2)]",
  },
};

export function PhoneChassis({
  children,
  finish = "titanium",
  className = "",
}: PhoneChassisProps) {
  const selectedFinish = FINISH_STYLES[finish] || FINISH_STYLES.titanium;

  return (
    <div
      className={`relative w-[305px] sm:w-[325px] h-[615px] sm:h-[635px] bg-gradient-to-b ${selectedFinish.rimGradient} rounded-[48px] p-2.5 sm:p-3 ${selectedFinish.glowShadow} border-4 ${selectedFinish.outerBorder} ring-1 ring-white/10 select-none ${className}`}
      dir="rtl"
    >
      {/* Side Hardware Buttons */}
      {/* Action Button (Top Left) */}
      <div
        data-testid="action-button"
        className={`action-button absolute -left-[6px] top-20 w-1.5 h-6 ${selectedFinish.buttonColor} rounded-l-md shadow-xs`}
      />
      {/* Volume Up */}
      <div
        data-testid="volume-up"
        className={`volume-up absolute -left-[6px] top-30 w-1.5 h-11 ${selectedFinish.buttonColor} rounded-l-md shadow-xs`}
      />
      {/* Volume Down */}
      <div
        className={`volume-down absolute -left-[6px] top-44 w-1.5 h-11 ${selectedFinish.buttonColor} rounded-l-md shadow-xs`}
      />
      {/* Power / Siri Button (Right) */}
      <div
        className={`power-button absolute -right-[6px] top-28 w-1.5 h-16 ${selectedFinish.buttonColor} rounded-r-md shadow-xs`}
      />

      {/* Subtle Antenna Bands */}
      <div className="absolute top-12 left-0 w-1 h-1 bg-black/60 pointer-events-none" />
      <div className="absolute bottom-12 left-0 w-1 h-1 bg-black/60 pointer-events-none" />
      <div className="absolute top-12 right-0 w-1 h-1 bg-black/60 pointer-events-none" />
      <div className="absolute bottom-12 right-0 w-1 h-1 bg-black/60 pointer-events-none" />

      {/* Inner Screen Bezel with Glass Highlights */}
      <div className="relative w-full h-full bg-surface-container-lowest rounded-[38px] overflow-hidden flex flex-col border border-white/5 shadow-inner">
        {/* Subtle Specular Sheen across top glass */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-10" />

        {children}

        {/* Home Indicator bar */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-30">
          <div className="w-28 sm:w-32 h-1 bg-on-surface/30 rounded-full hover:bg-on-surface/50 transition-colors" />
        </div>
      </div>
    </div>
  );
}
