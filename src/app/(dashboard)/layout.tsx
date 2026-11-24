import React from "react";
import Link from "next/link";
import { Link2, Palette, BarChart3, Settings } from "lucide-react";
import { PreviewProvider } from "@/features/dashboard";
import { UserNavDropdown } from "@/features/auth";
import { ThemeToggle, BrandLogo } from "@/shared/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-cairo" dir="rtl">
      {/* Top Navbar matching Stitch _4 */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1560px] mx-auto h-16 w-full px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo & Status Badge */}
          <div className="flex items-center gap-4">
            <BrandLogo href="/dashboard" variant="minimal" size="sm" />
          </div>

          {/* Central Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-xs font-semibold">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg transition-all text-on-surface hover:text-primary hover:bg-surface-container flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>الروابط</span>
            </Link>
            <Link
              href="/dashboard/appearance"
              className="px-3.5 py-1.5 rounded-lg transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>المظهر</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="px-3.5 py-1.5 rounded-lg transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>التحليلات</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-3.5 py-1.5 rounded-lg transition-all text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>الإعدادات</span>
            </Link>
          </nav>

          {/* Right Action Tools: ThemeToggle and UserNavDropdown */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNavDropdown />
          </div>
        </div>
      </header>

      {/* Main Workspace with Live Preview Context */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-8 py-6">
        <PreviewProvider>
          {children}
        </PreviewProvider>
      </main>
    </div>
  );
}
