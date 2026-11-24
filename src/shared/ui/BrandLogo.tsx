import React from "react";
import Link from "next/link";

export interface BrandLogoProps {
  variant?: "full" | "icon" | "minimal";
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
  href?: string | null;
}

export function BrandLogo({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = true,
  href = "/",
}: BrandLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
  }[size];

  const emblemSvgSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const titleSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Stylized Brand Emblem */}
      <div
        className={`${iconDimensions} bg-surface-container-high border border-outline-variant/30 flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all shrink-0`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />
        <svg
          viewBox="0 0 32 32"
          className={`${emblemSvgSize} text-primary relative z-10 transition-transform group-hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 8 23 L 13 9 C 13.5 7.5, 15.5 7.5, 16 9 L 19 18"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 15 17 L 18 23 C 18.5 24, 19.5 24, 20 23 L 24 9"
            stroke="#34d399"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 10 17 L 22 17"
            stroke="#6ee7b7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="13" cy="9" r="1.5" fill="#ffffff" />
          <circle cx="24" cy="9" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Text */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`${titleSize} font-black text-on-surface tracking-tight group-hover:text-primary transition-colors`}
            >
              AN
            </span>
            <span
              className={`${titleSize} font-black text-primary tracking-tight`}
            >
              LINKS
            </span>
          </div>
          {showSubtitle && variant === "full" && (
            <span className="text-[10px] text-primary/80 uppercase tracking-widest font-bold font-mono mt-0.5">
              Smart Bio Platform
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="AN LINKS" className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
