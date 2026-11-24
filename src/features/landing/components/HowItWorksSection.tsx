import React from "react";

const STEPS = [
  {
    num: "1",
    numColor: "text-primary",
    hoverBg: "group-hover:bg-primary-container group-hover:text-on-primary-container",
    title: "اختر اسم رابطك الفريد",
    desc: "احجز اسم حسابك الخاص (anlinks.dev/yourname) في ثوانٍ معدودة قبل أن يسبقك إليه أحد، وبدون الحاجة لبطاقة دفع.",
    badgeIcon: "verified",
    badgeText: "حجز فوري ومجاني",
    badgeColor: "text-primary",
  },
  {
    num: "2",
    numColor: "text-secondary",
    hoverBg: "group-hover:bg-secondary-container group-hover:text-secondary-fixed",
    title: "رتّب وخصّص مظهرك",
    desc: "أضف روابطك، مقاطع الفيديو، قنواتك، وبوابات الدفع الخاصة بك عبر سحب وإفلات العناصر وتخصيص الألوان والخطوط.",
    badgeIcon: "drag_indicator",
    badgeText: "سحب وإفلات بديهي",
    badgeColor: "text-secondary",
  },
  {
    num: "3",
    numColor: "text-tertiary",
    hoverBg: "group-hover:bg-tertiary-container group-hover:text-on-tertiary",
    title: "شارك وتتبّع نموك",
    desc: "ضع الرابط في بايو حساباتك على انستغرام، تيك توك، ولينكد إن، وتابع تدفق زوارك ونمو أرباحك في لوحة تحليلات لحظية.",
    badgeIcon: "insights",
    badgeText: "إحصائيات مباشرة دقيقة",
    badgeColor: "text-tertiary",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-24 px-6 lg:px-12 bg-surface-container-lowest relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">
            سهولة لا تضاهى
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
            كيف تبدأ مع «روابط» في 3 خطوات بسيطة؟
          </h2>
          <p className="text-sm text-on-surface-variant max-w-lg">
            لا حاجة لأي خبرة برمجية أو تصميمية، صفحتك ستكون جاهزة للإطلاق في دقائق معدودة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="flex flex-col p-8 bg-surface-container-low rounded-xl relative group hover:bg-surface-container transition-colors shadow-sm border border-white/5"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-surface-container-high ${step.numColor} flex items-center justify-center text-2xl font-bold mb-6 ${step.hoverBg} transition-all`}
              >
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-3">{step.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
              <div className={`mt-6 flex items-center gap-2 ${step.badgeColor} text-xs font-semibold`}>
                <span className="material-symbols-outlined text-[18px]">{step.badgeIcon}</span>
                <span>{step.badgeText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
