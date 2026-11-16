import React from "react";
import { AppButton } from "@/shared/ui";
import { Plus } from "lucide-react";

export interface PlansCycleHeaderProps {
  cycle: "MONTHLY" | "YEARLY";
  onCycleChange: (cycle: "MONTHLY" | "YEARLY") => void;
  onCreateNew: () => void;
}

export function PlansCycleHeader({ cycle, onCycleChange, onCreateNew }: PlansCycleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30">
      <div>
        <h3 className="text-base font-bold text-on-surface">باقات الاشتراك والتسعير</h3>
        <p className="text-xs text-on-surface-variant">إدارة مستويات الاشتراك، الأسعار الشهرية والسنوية، والامتيازات الممنوحة للمستخدمين</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/30 text-xs font-semibold">
          <button type="button" onClick={() => onCycleChange("MONTHLY")} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${cycle === "MONTHLY" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"}`}>
            دفع شهري
          </button>
          <button type="button" onClick={() => onCycleChange("YEARLY")} className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${cycle === "YEARLY" ? "bg-primary text-on-primary shadow-xs" : "text-on-surface-variant hover:text-on-surface"}`}>
            دفع سنوي (توفير)
          </button>
        </div>

        <AppButton variant="primary" size="sm" onClick={onCreateNew} leftIcon={<Plus className="w-4 h-4" />}>
          إضافة باقة جديدة
        </AppButton>
      </div>
    </div>
  );
}
