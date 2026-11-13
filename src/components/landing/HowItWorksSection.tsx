import React from "react";
import Link from "next/link";
import { UserPlus, Sliders, Share2, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserPlus,
    title: "احجز اسمك الفريد",
    description: "سجّل بريدك الإلكتروني واختر معرّفك الشخصي مجاناً في أقل من دقيقة.",
  },
  {
    step: "02",
    icon: Sliders,
    title: "أضف روابطك وخصّص مظهرك",
    description: "رتّب قنواتك، متجرك، ومواقعك، واختر القالب والألوان التي تعبّر عن هويتك.",
  },
  {
    step: "03",
    icon: Share2,
    title: "انشر رابطك في البايو",
    description: "انسخ رابط صفحتك الموحد وضعه في حساباتك على إنستغرام، تيك توك، وغيرها.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs sm:text-sm font-bold text-blue-600 uppercase tracking-wider">
            سهولة الانطلاق
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            ابدأ في 3 خطوات بسيطة
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            لا تحتاج لأي خبرة برمجية أو إعدادات معقدة. صفحتك جاهزة للنشر خلال دقائق.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-gray-50/70 border border-gray-100 flex flex-col justify-between space-y-6 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-gray-200">
                      {step.step}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-gray-900">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center space-y-6 shadow-xl shadow-blue-500/10">
          <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
            جاهز لتوحيد روابطك والظهور بمظهر أكثر احترافية؟
          </h4>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            انضم الآن إلى صانعي المحتوى والمتاجر الذين يعتمدون على AN LINKS لزيادة وصولهم وتحويل زوارهم.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-600 font-bold text-sm shadow-md hover:bg-blue-50 transition active:scale-98"
            >
              <span>أنشئ صفحتك الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

