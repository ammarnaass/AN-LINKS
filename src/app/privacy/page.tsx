import React from "react";
import { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة الخصوصية وحماية البيانات | AN LINKS",
  description: "سياسة حماية البيانات الشخصية والخصوصية المتبعة في منصة AN LINKS وفقاً لنظام حماية البيانات الشخصية (PDPL).",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-cairo" dir="rtl">
      <LandingHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 space-y-10">
        {/* Title */}
        <div className="text-center space-y-3 pb-8 border-b border-outline-variant/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>نظام حماية البيانات الشخصية (PDPL)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            سياسة الخصوصية وحماية البيانات
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">
            آخر تحديث: 24 نوفمبر 2026. خصوصيتك وسرية بياناتك أولويتنا القصوى في AN LINKS.
          </p>
        </div>

        {/* Section 1: Data Collection */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Database className="w-5 h-5" />
            <h2>1. البيانات التي نجمعها</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            عند استخدامك لمنصة AN LINKS، نقوم بجمع الأنواع التالية من البيانات:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-on-surface-variant pr-2">
            <li><strong>بيانات الحساب:</strong> البريد الإلكتروني، اسم المستخدم، اسم العرض، والصورة الرمزية.</li>
            <li><strong>بيانات الملف الشخصي والروابط:</strong> عناوين الروابط، النصوص، أيقونات شبكات التواصل، ومكان الإقامة الاختياري.</li>
            <li><strong>بيانات التحليلات وحركة المرور:</strong> عدد النقرات والزيارات، نوع الجهاز (هاتف/كمبيوتر)، المتصفح، والدولة التقريبية دون حفظ عنوان IP الكامل لضمان الخصوصية.</li>
            <li><strong>بيانات الدفع:</strong> تتم معالجة بيانات البطاقات الائتمانية عبر مزودي دفع معتمدين (PCI-DSS) ولا نقوم بتخزين أرقام بطاقاتك البنكية في خوادمنا نهائياً.</li>
          </ul>
        </section>

        {/* Section 2: How We Use Data */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Eye className="w-5 h-5" />
            <h2>2. كيفية استخدام البيانات</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            نستخدم البيانات للأغراض التالية فقط:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-on-surface-variant pr-2">
            <li>عرض وتشغيل صفحة الروابط العامة الخاصة بك وتوجيه الزوار بكفاءة وسرعة.</li>
            <li>تزويدك بلوحة تحليلات وإحصاءات دقيقة عن أداء روابطك وتفاعل جمهورك.</li>
            <li>إدارة اشتراكاتك وتقديم الدعم الفني وحماية الحسابات من الاختراق والاحتيال.</li>
            <li>تحسين أداء خوادم المنصة وتطوير ميزات جديدة تلبي احتياجات المستخدمين.</li>
          </ul>
        </section>

        {/* Section 3: Data Security */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Lock className="w-5 h-5" />
            <h2>3. حماية وتشفير البيانات</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            نطبق أعلى المعايير الأمنية لحماية بياناتك:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-on-surface-variant pr-2">
            <li>تشفير كلمات المرور باستخدام خوارزميات التجزئة الأحادية المتقدمة (bcrypt).</li>
            <li>تشفير المفاتيح والبيانات الحساسة باستخدام معيار التشفير العسكري (AES-256-GCM).</li>
            <li>استخدام اتصالات مشفرة بالكامل عبر بروتوكول HTTPS/TLS لجميع صفحات المنصة ومسارات الـ API.</li>
            <li>اقتطاع وتعتيم عناوين الـ IP في سجلات البلاغات والإحصاءات لحماية هوية الزوار.</li>
          </ul>
        </section>

        {/* Section 4: User Rights */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <UserCheck className="w-5 h-5" />
            <h2>4. حقوقك في إدارة بياناتك الشخصية</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            وفقاً لنظام حماية البيانات الشخصية ولائحة GDPR، يحق لك في أي وقت:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-on-surface-variant pr-2">
            <li>الوصول إلى كامل بياناتك وتعديلها من خلال صفحة الإعدادات.</li>
            <li>طلب تصدير نسخة من بياناتك وروابطك المخزنة لدينا.</li>
            <li>طلب حذف حسابك وكافة البيانات المرتبطة به نهائياً من قاعدة البيانات.</li>
          </ul>
        </section>

        {/* Section 5: Contact */}
        <section className="space-y-3 pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Mail className="w-5 h-5" />
            <h2>5. مسؤول حماية البيانات والتواصل</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            لأي استفسارات أو لممارسة حقوقك المتعلقة ببياناتك الشخصية، يرجى التواصل مع مسؤول الخصوصية عبر:{" "}
            <a href="mailto:privacy@anlinks.dev" className="text-primary font-mono underline" dir="ltr">
              privacy@anlinks.dev
            </a>
          </p>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
