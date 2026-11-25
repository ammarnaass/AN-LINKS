"use client";

import React from "react";
import { RotateCw, Sparkles, RefreshCcw, Layers } from "lucide-react";

interface NfcCard3DControlsProps {
  isAutoRotating: boolean;
  isFlipped: boolean;
  enableGlare: boolean;
  onToggleAutoRotate: () => void;
  onToggleFlip: () => void;
  onToggleGlare: () => void;
  onResetView: () => void;
}

export function NfcCard3DControls({
  isAutoRotating,
  isFlipped,
  enableGlare,
  onToggleAutoRotate,
  onToggleFlip,
  onToggleGlare,
  onResetView,
}: NfcCard3DControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/25">
      <div className="flex items-center gap-1.5">
        {/* Flip 3D Face */}
        <button
          type="button"
          onClick={onToggleFlip}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            isFlipped
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface hover:bg-surface-container-highest"
          }`}
          title="قلب البطاقة بالبعد الثالث"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isFlipped ? "الوجه الخلفي (QR)" : "الوجه الأمامي"}</span>
        </button>

        {/* Auto Rotate */}
        <button
          type="button"
          onClick={onToggleAutoRotate}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            isAutoRotating
              ? "bg-secondary text-on-secondary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
          }`}
          title="دوران سينمائي مستمر"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? "animate-spin" : ""}`} />
          <span>{isAutoRotating ? "إيقاف الدوران" : "دوران تلقائي"}</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Toggle Glare Reflection */}
        <button
          type="button"
          onClick={onToggleGlare}
          className={`p-2 rounded-xl text-xs transition cursor-pointer ${
            enableGlare
              ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
          }`}
          title="انعكاس الإضاءة واللمعان"
          aria-label="تفعيل أو تعطيل لمعان الإضاءة"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        {/* Reset Camera/Tilt */}
        <button
          type="button"
          onClick={onResetView}
          className="p-2 rounded-xl text-xs bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition cursor-pointer"
          title="إعادة ضبط زاوية الرؤية"
          aria-label="إعادة ضبط زاوية الرؤية"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
