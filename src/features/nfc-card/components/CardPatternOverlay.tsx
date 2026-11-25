"use client";

import React from "react";

interface CardPatternOverlayProps {
  pattern: string;
  accent: string;
}

export function CardPatternOverlay({ pattern, accent }: CardPatternOverlayProps) {
  if (pattern === "none") return null;

  if (pattern === "grid") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(to right, ${accent}55 1px, transparent 1px), linear-gradient(to bottom, ${accent}55 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />
    );
  }

  if (pattern === "waves") {
    return (
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 170 Q110 110 210 165 T400 140 L400 250 L0 250 Z" fill={accent} />
        <path d="M0 205 Q140 155 260 195 T400 180 L400 250 L0 250 Z" fill={accent} opacity="0.6" />
      </svg>
    );
  }

  return (
    <div
      className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-25 blur-2xl"
      style={{ backgroundColor: accent }}
    />
  );
}
