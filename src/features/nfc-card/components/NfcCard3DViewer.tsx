"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { NfcCardConfigDTO, NFC_CARD_MATERIALS, NFC_CARD_SHAPES } from "../types/nfc.types";
import { generateCode128Svg } from "../utils/code128";
import { CardFrontFace } from "./CardFrontFace";
import { CardBackFace } from "./CardBackFace";
import { NfcCard3DControls } from "./NfcCard3DControls";

interface NfcCard3DViewerProps {
  card: NfcCardConfigDTO;
  liveQrSvg?: string;
}

export function NfcCard3DViewer({ card, liveQrSvg }: NfcCard3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [enableGlare, setEnableGlare] = useState(true);

  const material = useMemo(
    () => NFC_CARD_MATERIALS.find((m) => m.key === card.material) || NFC_CARD_MATERIALS[0],
    [card.material]
  );
  const shape = useMemo(
    () => NFC_CARD_SHAPES.find((s) => s.key === card.cardShape) || NFC_CARD_SHAPES[0],
    [card.cardShape]
  );
  const isVertical = card.orientation === "vertical";
  const isCustom = card.material === "custom";

  const barcodeSvg = useMemo(
    () =>
      generateCode128Svg(card.barcodeValue || `AN-${card.username.toUpperCase()}`, {
        fgColor: "#0f172a",
        bgColor: "#ffffff",
        height: 36,
        showText: true,
      }),
    [card.barcodeValue, card.username]
  );

  const qrMarkup = liveQrSvg || card.qrSvgMarkup;

  // Auto rotation loop
  useEffect(() => {
    if (!isAutoRotating) return;
    let animId: number;
    let currentY = rotateY;

    const animate = () => {
      currentY = (currentY + 0.7) % 360;
      setRotateY(currentY);
      setRotateX(Math.sin((currentY * Math.PI) / 180) * 8);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating, rotateY]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isAutoRotating || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xNorm = x / rect.width;
      const yNorm = y / rect.height;

      const rX = (0.5 - yNorm) * 26;
      const rY = (xNorm - 0.5) * 26;

      setRotateX(rX);
      setRotateY(rY);
      setGlare({ x: xNorm * 100, y: yNorm * 100, opacity: 1 });
    },
    [isAutoRotating]
  );

  const handlePointerLeave = useCallback(() => {
    if (isAutoRotating) return;
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, [isAutoRotating]);

  const handleReset = useCallback(() => {
    setIsAutoRotating(false);
    setIsFlipped(false);
    setRotateX(0);
    setRotateY(0);
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  const totalRotateY = isFlipped ? rotateY + 180 : rotateY;

  return (
    <div className="space-y-4">
      <NfcCard3DControls
        isAutoRotating={isAutoRotating}
        isFlipped={isFlipped}
        enableGlare={enableGlare}
        onToggleAutoRotate={() => setIsAutoRotating((v) => !v)}
        onToggleFlip={() => setIsFlipped((v) => !v)}
        onToggleGlare={() => setEnableGlare((v) => !v)}
        onResetView={handleReset}
      />

      <div
        className="flex items-center justify-center p-6 sm:p-10 rounded-3xl bg-surface-container-lowest/80 border border-outline-variant/20 overflow-hidden min-h-[360px]"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`relative cursor-grab active:cursor-grabbing select-none transition-transform ${
            isAutoRotating ? "duration-75" : "duration-200 ease-out"
          } ${isVertical ? "w-[265px] aspect-[1/1.586]" : "w-full max-w-[420px] aspect-[1.586/1]"}`}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${totalRotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Card Physical Edge Shadow / Thickness Bevel */}
          <div
            className={`absolute inset-0 ${shape.radiusClass} pointer-events-none transition-shadow`}
            style={{
              boxShadow: `0 25px 50px -12px ${card.accentColor}30, 0 15px 30px -10px rgba(0,0,0,0.45)`,
              transform: "translateZ(-2px)",
            }}
          />

          {/* FRONT FACE */}
          <div
            className={`absolute inset-0 ${shape.radiusClass} border shadow-xl overflow-hidden flex flex-col justify-between ${
              material.bgClass
            } ${material.textClass} ${material.borderClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
              ...(isCustom
                ? { backgroundColor: card.customBgColor, color: card.customTextColor }
                : {}),
            }}
          >
            <CardFrontFace card={card} material={material} isVertical={isVertical} />

            {/* Dynamic Specular Glare Reflection */}
            {enableGlare && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)`,
                }}
              />
            )}
          </div>

          {/* BACK FACE */}
          <div
            className={`absolute inset-0 ${shape.radiusClass} border shadow-xl overflow-hidden flex flex-col justify-between ${
              material.bgClass
            } ${material.textClass} ${material.borderClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              ...(isCustom
                ? { backgroundColor: card.customBgColor, color: card.customTextColor }
                : {}),
            }}
          >
            <CardBackFace
              card={card}
              material={material}
              qrMarkup={qrMarkup}
              barcodeSvg={barcodeSvg}
              isVertical={isVertical}
            />

            {/* Back Dynamic Glare */}
            {enableGlare && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(circle at ${100 - glare.x}% ${glare.y}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 35%, transparent 65%)`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
