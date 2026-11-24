import React from "react";
import { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { ShieldCheck, Key, Server, Lock, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "الأمان والموثوقية | AN LINKS",
  description: "معايير الأمان المتقدمة، التشفير، وحماية البنية التحتية لمنصة AN LINKS.",
};

export default function SecurityPage() {
  const securityPillars = [
    {
      title: "التشفير التام للبيانات (AES-256-GCM)",
      desc: "تُشفر كافة المفاتيح الحساسة وبوابات الدفع والمعلومات السرية باستخدام خوارزميات التشفير المتقدمة ذات المصادقة المضمنة.",
      icon: <Key className="w-5 h-5 text-primary" />,
    },
    {
      title: "التحقق الثنائي وتأمين الجلسات (2FA)",
      desc: "حماية متقدمة للحسابات تدعم تطبيقات المصادقة (Google Authenticator, 1Password) مع إدارة تفصيلية للجلسات والأجهزة النشطة.",
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: "بنية تحتية موثوقة ومحمية من DDoS",
      desc: "حماية سحابية متقدمة من هجمات الحرمان من الخدمة مع جدران حماية ذكية لتصفية حركة المرور الروبوتية والتصيد الاحتيالي.",
      icon: <Server className="w-5 h-5 text-blue-400" />,
    },
    {
      title: "فحص ومراقبة الروابط على مدار الساعة",
      desc: "نظام آلي متكامل لفحص الروابط المشبوهة وحظر مواقع الاحتيال وحماية سمعة النطاق وحسابات المستخدمين.",
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-cairo" dir="rtl">
      <LandingHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-12 space-y-10">
        <div className="text-center space-y-3 pb-8 border-b border-outline-variant/30">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>معايير أمان موثوقة عالمياً</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            الأمان والموثوقية في AN LINKS
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl mx-auto">
            نلتزم بتوفير أعلى مستويات الأمان وحماية الخصوصية لكل رابط وحساب ومستخدم على منصتنا.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPillars.map((p, i) => (
            <div key={i} className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="font-bold text-base text-on-surface">{p.title}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-primary/20 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <CheckCircle2 className="w-5 h-5" />
            <h3>الامتثال والمعايير الدولية</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            تتوافق منصة AN LINKS مع متطلبات نظام حماية البيانات الشخصية (PDPL) بالمملكة العربية السعودية، واللائحة العامة لحماية البيانات (GDPR) بالاتحاد الأوروبي، ومعايير أمان بيانات بطاقات الدفع PCI-DSS عبر مزودي بوابات الدفع المعتمدين.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
