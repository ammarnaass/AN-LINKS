import React from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest pt-16 pb-12 px-4 sm:px-8 text-on-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
                <Link2 className="w-4 h-4 rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-on-surface leading-none">روابط | Rawabet</span>
                <span className="text-[10px] text-primary tracking-widest font-mono uppercase mt-0.5">ARABIC BIO LINK</span>
              </div>
            </Link>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              المنصة الأولى عربياً لتصميم وإدارة صفحات البايو الذكية بنظام بينتو المضيء، تمنح صناع المحتوى واجهة تفاعلية متطورة لإبراز جميع مشاريعهم في رابط واحد مميز.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-on-surface">المنتج</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><Link href="/features" className="hover:text-primary transition-colors">المميزات التقنية</Link></li>
              <li><Link href="/#templates" className="hover:text-primary transition-colors">معرض القوالب</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">الأسعار والخطط</Link></li>
              <li><Link href="/features" className="hover:text-primary transition-colors">فاحص الروابط (Link Sentinel)</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-on-surface">المصادر</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><Link href="/#reviews" className="hover:text-primary transition-colors">آراء العملاء</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">دليل البدء السريع</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">مقارنة الباقات</Link></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-on-surface">الشركة</h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li><Link href="/terms" className="hover:text-primary transition-colors">شروط الاستخدام</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">تسجيل الدخول</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">إنشاء حساب جديد</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>© {currentYear} منصة روابط (Rawabet). جميع الحقوق محفوظة لرواد المحتوى العربي.</p>
          <div className="flex items-center gap-2 text-primary font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>جميع الأنظمة تعمل بكفاءة 99.9%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
