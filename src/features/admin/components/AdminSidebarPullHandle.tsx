"use client";

import React, { useRef } from "react";
import { ChevronLeft } from "lucide-react";

export interface AdminSidebarPullHandleProps {
  isOpen: boolean;
  onOpen: () => void;
  className?: string;
}

/**
 * Mobile edge pull handle component for the admin sidebar drawer.
 * Positioned on the right screen edge (RTL) for single-hand mobile gestures.
 * Auto-hides when the mobile sidebar drawer is open or on desktop screens (lg:hidden).
 */
export function AdminSidebarPullHandle({
  isOpen,
  onOpen,
  className = "",
}: AdminSidebarPullHandleProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // If mobile drawer is already open, auto-hide the pull handle to prevent visual obstruction
  if (isOpen) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      onOpen();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches && e.changedTouches[0];
    if (!touch) {
      touchStartRef.current = null;
      return;
    }

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Axis constraint: ignore predominantly vertical scrolling gestures
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    // RTL swipe detection (swiping from right edge inwards to the left)
    if (deltaX < -25) {
      onOpen();
    }
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
  };

  const baseClasses =
    "fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden flex items-center justify-center w-6 h-14 bg-primary text-on-primary rounded-l-xl shadow-lg border-l border-y border-outline-variant/30 cursor-pointer select-none transition-all active:scale-95 hover:w-7";

  const resolvedClassName = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="فتح القائمة الجانبية"
      title="فتح القائمة الجانبية"
      className={resolvedClassName}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <ChevronLeft className="w-4 h-4 text-on-primary" aria-hidden="true" />
    </div>
  );
}

export default AdminSidebarPullHandle;

