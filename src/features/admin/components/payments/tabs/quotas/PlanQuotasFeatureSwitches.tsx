import React from "react";
import { AdminPlanQuotaConfig } from "../../../../types/admin.types";
import { Globe, EyeOff, Palette, BarChart2, Headphones, Code, Calendar, Webhook, Sparkles } from "lucide-react";

export interface PlanQuotasFeatureSwitchesProps {
  quotas: AdminPlanQuotaConfig;
  onToggle: (key: keyof AdminPlanQuotaConfig) => void;
}

const FEATURES: Array<{
  key: keyof AdminPlanQuotaConfig;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  { key: "allowCustomDomain", title: "ربط نطاق خاص (Custom Domain)", description: "إمكانية توجيه دومين مخصص مثل yourname.com", icon: <Globe className="w-4 h-4" /> },
  { key: "allowRemoveBranding", title: "إزالة شعار المنصة (Remove Branding)", description: 'إخفاء علامة "Made with AN LINKS" من أسفل الصفحة', icon: <EyeOff className="w-4 h-4" /> },
  { key: "allowAdvancedThemes", title: "قوالب وثيمات حصرية (Advanced Themes)", description: "إتاحة ثيمات الزجاج والنيون والقوالب الحركية ثلاثية الأبعاد", icon: <Palette className="w-4 h-4" /> },
  { key: "allowDetailedAnalytics", title: "تحليلات تفصيلية جغرافية (Detailed Analytics)", description: "خريطة الزوار، مصادر الزيارات ونوع الأجهزة والمتصفحات", icon: <BarChart2 className="w-4 h-4" /> },
  { key: "allowPrioritySupport", title: "أولوية الدعم الفني (VIP Priority Support)", description: "رد سريع خلال ساعة ومسار تذاكر مباشر", icon: <Headphones className="w-4 h-4" /> },
  { key: "customCssAllowed", title: "تخصيص كامل بأكواد CSS (Custom CSS)", description: "إمكانية حقن أكواد CSS مخصصة لتنسيق الصفحة", icon: <Code className="w-4 h-4" /> },
  { key: "allowAppointments", title: "حجز الاستشارات والمواعيد (Appointments)", description: "إتاحة بيع جلسات استشارية ومواعيد تقويمية مجدولة", icon: <Calendar className="w-4 h-4" /> },
  { key: "allowOutgoingWebhooks", title: "خطافات الويب (Outgoing Webhooks)", description: "تصدير المبيعات والمشتركين لـ Zapier و Make", icon: <Webhook className="w-4 h-4" /> },
  { key: "allowAiCopilot", title: "مساعد الذكاء الاصطناعي (AI Copilot)", description: "توليد النبذة التعريفية وعناوين الروابط آلياً", icon: <Sparkles className="w-4 h-4" /> },
];

export function PlanQuotasFeatureSwitches({
  quotas,
  onToggle,
}: PlanQuotasFeatureSwitchesProps) {
  return (
    <div className="space-y-3">
      <h5 className="font-bold text-xs text-on-surface">الميزات والصلاحيات المتقدمة:</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FEATURES.map((item) => {
          const isEnabled = Boolean(quotas[item.key]);
          return (
            <div key={item.key} className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <div>
                  <span className="block text-xs font-bold text-on-surface">{item.title}</span>
                  <span className="text-[11px] text-on-surface-variant">{item.description}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggle(item.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface text-on-surface-variant border border-outline-variant/30"
                }`}
              >
                {isEnabled ? "مفعل" : "معطل"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
