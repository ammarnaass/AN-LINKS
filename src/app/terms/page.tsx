import React from "react";
import { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { ShieldCheck, FileText, Scale, AlertTriangle, CreditCard, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "شروط الاستخدام والخدمة | AN LINKS",
  description: "الشروط والضوابط المنظمة لاستخدام منصة AN LINKS وسياسات الاشتراكات وحوكمة المحتوى.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-cairo" dir="rtl">
      <LandingHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 space-y-10">
        {/* Page Title */}
        <div className="text-center space-y-3 pb-8 border-b border-outline-variant/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>اتفاقية الاستخدام القانونية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            شروط وأحكام استخدام AN LINKS
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">
            آخر تحديث: 24 نوفمبر 2026. يرجى قراءة هذه الشروط بعناية قبل استخدام منصة AN LINKS أو إنشاء حسابك.
          </p>
        </div>

        {/* Section 1: Introduction */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <FileText className="w-5 h-5" />
            <h2>1. مقدمة وقبول الشروط</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            تشكل هذه الاتفاقية عقداً ملزماً قانوناً بينك وبين منصة <strong>AN LINKS</strong> (المشار إليها بـ &ldquo;المنصة&rdquo; أو &ldquo;نحن&rdquo;). باستخدامك للمنصة، فإنك تقر وتوافق صراحة على الالتزام بجميع بنود هذه الاتفاقية وسياسة الخصوصية المعمول بها. إذا كنت لا توافق على هذه الشروط، يرجى الامتناع عن استخدام خدماتنا.
          </p>
        </section>

        {/* Section 2: Account Responsibilities */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <ShieldCheck className="w-5 h-5" />
            <h2>2. إنشاء الحساب ومسؤولية الأمان</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            عند إنشاء حساب في المنصة، يتعين عليك تقديم معلومات صحيحة ودقيقة، بما في ذلك البريد الإلكتروني واسم المستخدم. أنت وحدك المسؤول عن الحفاظ على سرية كلمة المرور وتأمين حسابك، وتتحمل كامل المسؤولية عن أي نشاط يتم تحت حسابك. يحق للمنصة إيقاف أو حذف أي حساب ينتحل شخصية أخرى أو يقدم بيانات مضللة.
          </p>
        </section>

        {/* Section 3: Acceptable Use & Prohibited Content */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <AlertTriangle className="w-5 h-5" />
            <h2>3. المحتوى المحظور وسياسة الاستخدام العادل</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            يحظر حظراً باتاً استخدام صفحات وروابط AN LINKS في أي من الأنشطة التالية:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-on-surface-variant pr-2">
            <li>نشر روابط تصيد احتيالي (Phishing) أو برمجيات خبيثة أو فيروسات.</li>
            <li>الترويج للأنشطة غير القانونية أو المقامرة أو المواد المحظورة شرعاً ونظاماً.</li>
            <li>المحتوى الإباحي، أو المحتوى المحرض على العنف أو الكراهية والإرهاب.</li>
            <li>انتهاك حقوق الملكية الفكرية أو العلامات التجارية للغير دون ترخيص.</li>
            <li>استخدام أدوات آلية أو برامج روبوتية لتوليد نقرات وهمية أو التلاعب بالإحصاءات.</li>
          </ul>
          <p className="text-xs text-on-surface-variant/80 bg-surface-container p-3 rounded-xl border border-outline-variant/30">
            تحتفظ إدارة المنصة بالحق في إزالة أي رابط أو حظر أي حساب ينتهك هذه المعايير فوراً ودون إشعار مسبق.
          </p>
        </section>

        {/* Section 4: Subscriptions & Payments */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <CreditCard className="w-5 h-5" />
            <h2>4. الاشتراكات والدفع والتجديد</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            توفر المنصة باقات مجانية ومدفوعة (Pro, Creator). تتم معالجة المدفوعات عبر بوابات معتمدة وآمنة (مثل مدى، Apple Pay، وStripe). يتم تجديد الاشتراكات الدورية تلقائياً ما لم يتم إلغاء التجديد قبل انتهاء الدورة الحالية من صفحة الإعدادات. جميع المبالغ المدفوعة غير قابلة للاسترداد بعد انقضاء 7 أيام من تاريخ الدفع إلا إذا تعطلت الخدمة تعطلاً دائماً.
          </p>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Scale className="w-5 h-5" />
            <h2>5. إخلاء المسؤولية وحدودها</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            يتم توفير خدمات المنصة &ldquo;كما هي&rdquo; دون أي ضمانات صريحة أو ضمنية بالاستمرار دون انقطاع. لا تتحمل AN LINKS أي مسؤولية عن محتوى المواقع الخارجية التي تشير إليها روابط المستخدمين، أو أي خسائر ناتجة عن قرارات زوار صفحات الروابط.
          </p>
        </section>

        {/* Section 6: Contact & Jurisdiction */}
        <section className="space-y-3 pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Mail className="w-5 h-5" />
            <h2>6. التواصل والنزاعات القانونية</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            تخضع هذه الشروط وتفسر وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية. لأي استفسارات قانونية أو للإبلاغ عن انتهاكات، يرجى التواصل مع فريقنا القانوني عبر البريد:{" "}
            <a href="mailto:legal@anlinks.dev" className="text-primary font-mono underline" dir="ltr">
              legal@anlinks.dev
            </a>
          </p>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
