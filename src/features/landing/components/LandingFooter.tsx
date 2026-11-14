import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-16 pb-12 border-t border-outline-variant/15 text-on-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">link</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-on-surface tracking-tight leading-tight">روابط</span>
                <span className="text-[11px] text-primary uppercase tracking-widest font-semibold font-mono">Rawabet</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
              المنصة الأولى المخصصة للمبدعين ورواد الأعمال وصناع المحتوى العرب لبناء واجهات روابط بانتو عصرية وتجارب رقمية استثنائية.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <span className="text-xs font-semibold text-on-surface">انضم إلى النشرة البريدية الحصرية</span>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-xs placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container"
                  placeholder="أدخل بريدك الإلكتروني..."
                  type="email"
                />
                <button
                  className="bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  type="button"
                >
                  اشتراك
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface">المنتج</span>
            <nav className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a className="hover:text-on-surface transition-colors" href="#features">المميزات الرئيسية</a>
              <a className="hover:text-on-surface transition-colors" href="#live-demos">قوالب بانتو التفاعلية</a>
              <a className="hover:text-on-surface transition-colors" href="#pricing">الخطط والأسعار</a>
              <Link className="hover:text-on-surface transition-colors" href="/pricing">النطاقات المخصصة</Link>
              <Link className="hover:text-on-surface transition-colors" href="/features">تحليلات الزوار المتقدمة</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface">المصادر والدعم</span>
            <nav className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <a className="hover:text-on-surface transition-colors" href="#faq">مركز المساعدة والأسئلة</a>
              <Link className="hover:text-on-surface transition-colors" href="/features">مدونة صناع المحتوى</Link>
              <Link className="hover:text-on-surface transition-colors" href="/features">أدلة نمو العلامة الشخصية</Link>
              <Link className="hover:text-on-surface transition-colors" href="/features">المطورين وAPI</Link>
              <Link className="hover:text-on-surface transition-colors" href="/pricing">تواصل معنا</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-on-surface">قانوني وشبكاتنا</span>
            <nav className="flex flex-col gap-2 text-xs text-on-surface-variant">
              <Link className="hover:text-on-surface transition-colors" href="/privacy">سياسة الخصوصية</Link>
              <Link className="hover:text-on-surface transition-colors" href="/terms">شروط الاستخدام</Link>
              <Link className="hover:text-on-surface transition-colors" href="/security">الأمان والموثوقية</Link>
            </nav>
            <div className="flex items-center gap-3 mt-4">
              <a aria-label="Community" className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </a>
              <a aria-label="Global Web" className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </a>
              <a aria-label="Feed" className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-[18px]">rss_feed</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p className="text-outline">© 2025 منصة روابط (Rawabet). جميع الحقوق محفوظة لرواد العالم الرقمي العربي.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span>جميع الأنظمة والخدمات تعمل بكفاءة تامة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
