import React from "react";
import Link from "next/link";
import { Link2, Heart } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest py-14 px-4 sm:px-8 text-on-surface">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
              <Link2 className="w-4 h-4 rotate-45" />
            </div>
            <span className="font-bold text-base text-on-surface">روابط | Rawabet (AN LINKS)</span>
          </div>
          <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
            المنصة العربية الأولى المتخصصة في صفحات الروابط الذكية بتصميم بانتو متطور وأداء فائق.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-on-surface-variant">
          <Link href="/register" className="hover:text-primary transition-colors">
            إنشاء حساب
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            الشروط والأحكام
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            سياسة الخصوصية
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-outline text-center md:text-left flex items-center gap-1.5">
          <span>© {currentYear} جميع الحقوق محفوظة. صُنع بـ</span>
          <Heart className="w-3.5 h-3.5 text-primary fill-current" />
          <span>لصناع المحتوى العرب</span>
        </div>
      </div>
    </footer>
  );
}

