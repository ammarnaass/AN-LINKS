import React from "react";

const PARTNERS = [
  { icon: "podcasts", name: "صوت" },
  { icon: "storefront", name: "متاجرنا" },
  { icon: "auto_awesome", name: "إلهام" },
  { icon: "rocket", name: "مدار تك" },
  { icon: "school", name: "أكاديمية نون" },
  { icon: "hub", name: "شبكة أثر" },
];

export function PartnersMarqueeSection() {
  return (
    <section className="w-full py-12 bg-surface-container-low/50 px-6 lg:px-12 border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <p className="text-sm text-on-surface-variant font-semibold tracking-wider text-center mb-8">
          يثق بنا نخبة من رواد الأعمال وصناع المحتوى والماركات الرائدة في العالم العربي
        </p>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 group px-4 py-2 rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[28px] transition-colors">
                {partner.icon}
              </span>
              <span className="text-lg font-bold tracking-tight text-on-surface-variant group-hover:text-on-surface transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

