import React from "react";

function FeaturesHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          المميزات الحصرية
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface">
          صُممت بعناية لتتفوق على كافة منصات الروابط التقليدية
        </h2>
      </div>
      <p className="text-sm text-on-surface-variant max-w-md">
        كل ما يحتاجه المحترف الرقمي العربي للتحكم في زواره، بيع خدماته ومنتجاته، وحماية علامته التجارية دون أي مجهود برمجي.
      </p>
    </div>
  );
}

function BrokenLinkCard() {
  return (
    <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="flex flex-col gap-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">link_off</span>
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-on-surface">فحص الروابط الذاتي الذكي</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold">حصري</span>
        </div>
        <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
          لا تفقد أي مبيعة أو زائر بسبب رابط منتهي أو فيديو محذوف. روبوت روابط يفحص جميع وجهاتك على مدار الساعة ويرسل لك تنبيهاً فورياً عبر واتساب عند تعطل أي رابط.
        </p>
      </div>

      <div className="mt-8 z-10 bg-surface-container-high/90 rounded-xl p-4 flex items-center justify-between gap-4 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">chat</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">تنبيه واتساب من روابط:</span>
            <span className="text-xs text-on-surface-variant">رابط العرض الترويجي عاد بكود 404 - تم إيقافه تلقائياً لمنع إهدار النقرات.</span>
          </div>
        </div>
        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-bold">
          نشط الآن
        </span>
      </div>
    </div>
  );
}

function ArabicTypographyCard() {
  const fonts = ["IBM Plex Sans", "خط الجزيرة", "خط القاهرة الحديث", "+ خيارات غير محدودة"];
  return (
    <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary-container/15 rounded-full blur-[70px] pointer-events-none" />
      <div className="flex flex-col gap-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">palette</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">محرر بصري يعشق العربية</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          اختر من بين أكثر من 30 خطاً عربياً أصيلاً، تأثيرات زجاجية ثلاثية الأبعاد، وتدرجات إضاءة نيون تعكس هوية علامتك باحترافية كاملة.
        </p>
      </div>
      <div className="mt-8 z-10 flex flex-wrap gap-2.5">
        {fonts.map((f, i) => (
          <span
            key={f}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              i === 3 ? "bg-secondary-container/40 text-secondary" : "bg-surface-container-high text-on-surface hover:text-primary"
            }`}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnalyticsCard() {
  return (
    <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">query_stats</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">تحليلات دقيقة ولحظية</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          تعرف على مصادر حركة المرور، الدول، أنواع الأجهزة، وأوقات الذروة مع دعم لربط Meta Pixel و Google Analytics.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-2 bg-surface-container-high/60 p-4 rounded-xl border border-white/5">
        <div className="flex justify-between items-center text-on-surface-variant text-xs">
          <span>نسبة النقر للظهور (CTR)</span>
          <span className="text-tertiary font-bold font-mono">18.4%</span>
        </div>
        <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex">
          <div className="bg-primary h-full w-[65%] rounded-full" />
          <div className="bg-tertiary h-full w-[25%]" />
        </div>
        <div className="flex justify-between text-outline text-[11px] font-mono mt-1">
          <span>انستغرام 65%</span>
          <span>تيك توك 25%</span>
          <span>أخرى 10%</span>
        </div>
      </div>
    </div>
  );
}

function InstantCommerceCard() {
  return (
    <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">payments</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">بيع المنتجات وجمع الدفعات</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          قم ببيع ملفات PDF، الاستشارات الصوتية، وخدماتك مباشرة من البايو مع دعم وسائل الدفع المحلية (مدى، Apple Pay، والبطاقات).
        </p>
      </div>
      <div className="mt-8 flex items-center gap-3 p-3 bg-surface-container-high/60 rounded-xl border border-white/5">
        <span className="material-symbols-outlined text-primary text-[24px]">contactless</span>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-on-surface">دفع فوري بنقرة واحدة</span>
          <span className="text-[11px] text-on-surface-variant">بدون تحويل الزائر لمواقع معقدة</span>
        </div>
      </div>
    </div>
  );
}

function DynamicQrCard() {
  return (
    <div className="lg:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-all duration-300 shadow-md border border-white/5">
      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">رمز QR ديناميكي مخصص</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          أنشئ وطبّع رمز استجابة سريعة يحمل شعارك وألوانك للطباعة على كروت العمل، العبوات، والملصقات مع إمكانية تحديث الوجهة لاحقاً.
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between p-3 bg-surface-container-high/60 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-surface-container-lowest p-1.5 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[36px]">qr_code</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">دقة عالية جاهزة للطباعة</span>
            <span className="text-[11px] text-on-surface-variant">صيغ SVG, PNG الفائقة</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-primary text-[20px]">download</span>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 px-6 lg:px-12 bg-surface-container-lowest relative">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <FeaturesHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          <BrokenLinkCard />
          <ArabicTypographyCard />
          <AnalyticsCard />
          <InstantCommerceCard />
          <DynamicQrCard />
        </div>
      </div>
    </section>
  );
}
