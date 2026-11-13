import React from "react";
import Link from "next/link";
import { Link2, ArrowLeft } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Link2 className="w-5 h-5 rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-gray-900 tracking-tight leading-none">
              AN LINKS
            </span>
            <span className="text-[10px] text-blue-600 font-medium tracking-wider">
              روابط البايو باحترافية
            </span>
          </div>
        </Link>

        {/* Navigation & CTAs */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3.5 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-sm hover:shadow transition active:scale-98"
          >
            <span>ابدأ مجاناً</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
