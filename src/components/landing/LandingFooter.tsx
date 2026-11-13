import React from "react";
import Link from "next/link";
import { Link2, Heart } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Link2 className="w-4 h-4 rotate-45" />
            </div>
            <span className="font-bold text-gray-900">AN LINKS</span>
          </div>
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
            المنصة العربية الأولى المتخصصة في صفحات الروابط الشخصية وسرعة العرض الفائقة على أجهزة الجوّال.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
          <Link href="/register" className="hover:text-blue-600 transition">
            إنشاء حساب
          </Link>
          <Link href="/login" className="hover:text-blue-600 transition">
            تسجيل الدخول
          </Link>
          <Link href="/terms" className="hover:text-blue-600 transition">
            الشروط والأحكام
          </Link>
          <Link href="/privacy" className="hover:text-blue-600 transition">
            سياسة الخصوصية
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 text-center md:text-left flex items-center gap-1">
          <span>© {currentYear} AN LINKS. صنع بـ</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          <span>لصناع المحتوى العرب</span>
        </div>
      </div>
    </footer>
  );
}

