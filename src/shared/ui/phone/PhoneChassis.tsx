import React from "react";

export interface PhoneChassisProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneChassis({ children, className = "" }: PhoneChassisProps) {
  return (
    <div
      className={`relative w-[300px] sm:w-[320px] h-[610px] sm:h-[630px] bg-[#0c1017] rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(78,222,163,0.15)] border-4 border-[#232936] ring-1 ring-white/10 select-none ${className}`}
      dir="rtl"
    >
      {/* Side Hardware Buttons */}
      <div className="absolute -left-[7px] top-24 w-1 h-8 bg-[#333b4d] rounded-l-md" />
      <div className="absolute -left-[7px] top-36 w-1 h-12 bg-[#333b4d] rounded-l-md" />
      <div className="absolute -left-[7px] top-52 w-1 h-12 bg-[#333b4d] rounded-l-md" />
      <div className="absolute -right-[7px] top-32 w-1 h-16 bg-[#333b4d] rounded-r-md" />

      {/* Inner Screen Bezel */}
      <div className="relative w-full h-full bg-surface-container-lowest rounded-[38px] overflow-hidden flex flex-col border border-white/5 shadow-inner">
        {children}

        {/* Home Indicator bar */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-30">
          <div className="w-32 h-1 bg-on-surface/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
