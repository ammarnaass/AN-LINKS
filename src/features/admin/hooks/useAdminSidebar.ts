"use client";

import { useState, useEffect, useCallback } from "react";

export const ADMIN_SIDEBAR_STORAGE_KEY = "admin_sidebar_collapsed";

export interface UseAdminSidebarReturn {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

/**
 * Safely reads the persisted sidebar collapsed state from localStorage.
 */
export function getStoredSidebarCollapsed(): boolean {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY);
      return saved === "true";
    }
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY);
      return saved === "true";
    }
  } catch {
    // Gracefully handle disabled localStorage (private browsing)
  }
  return false;
}

/**
 * Safely writes the sidebar collapsed state to localStorage.
 */
export function setStoredSidebarCollapsed(collapsed: boolean): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(ADMIN_SIDEBAR_STORAGE_KEY, String(collapsed));
    } else if (typeof localStorage !== "undefined") {
      localStorage.setItem(ADMIN_SIDEBAR_STORAGE_KEY, String(collapsed));
    }
  } catch {
    // Gracefully handle disabled or quota-exceeded localStorage
  }
}

/**
 * Responsive Admin Sidebar State Hook
 * Manages desktop rail collapsed state (persisted) and mobile slide-over drawer state.
 * Fully safe for Next.js SSR & React 19 hydration.
 */
export function useAdminSidebar(): UseAdminSidebarReturn {
  // Deterministic initial states for SSR hydration safety
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Read saved preference from localStorage ONLY inside useEffect after mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY);
        if (saved !== null) {
          setIsCollapsed(saved === "true");
        }
      } else if (typeof localStorage !== "undefined") {
        const saved = localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY);
        if (saved !== null) {
          setIsCollapsed(saved === "true");
        }
      }
    } catch {
      // Gracefully handle disabled localStorage (private browsing)
    }
  }, []);

  // Auto-close mobile drawer when window resizes to desktop breakpoint (>= 1024px)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      setStoredSidebarCollapsed(next);
      return next;
    });
  }, []);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    openMobile,
    closeMobile,
    toggleMobile,
  };
}

export default useAdminSidebar;

