import React from "react";
import Link from "next/link";
import { Link2, Palette, BarChart3, Settings, ExternalLink, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-cairo" dir="rtl">
      {/* Top Navbar matching Stitch _4 */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1560px] mx-auto h-16 w-full px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo & Status Badge */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center ring-2 ring-primary/40 group-hover:scale-105 transition-transform">
                  <Link2 className="w-4 h-4 rotate-45" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest" />
              </div>
              <span className="font-bold text-lg text-on-surface tracking-tight">
                روابط | AN LINKS
              </span>
            </Link>
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

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs text-outline hover:text-red-400 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-surface-container transition"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 w-full max-w-[1560px] mx-auto px-4 sm:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
