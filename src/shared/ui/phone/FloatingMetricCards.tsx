import React from "react";
import { TrendingUp, ShieldCheck, ShoppingBag } from "lucide-react";
import { FloatingMetricCard } from "../FloatingMetricCard";

export function FloatingMetricCards() {
  return (
    <>
      {/* Top Right Floating Card: Live Revenue */}
      <FloatingMetricCard
        title="مبيعات فورية"
        value="+149 ر.س"
        delta="قبل قليل"
        deltaType="positive"
        icon={<ShoppingBag className="w-4 h-4" />}
        positionClasses="-top-6 -right-6 hidden sm:flex"
      />

      {/* Center Left Floating Card: Link Health */}
      <FloatingMetricCard
        title="حالة الروابط"
        value="100% نشطة"
        delta="مراقبة 24/7"
        deltaType="positive"
        icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
        positionClasses="top-1/3 -left-8 hidden sm:flex"
      />

      {/* Bottom Right Floating Card: Traffic Spark */}
      <FloatingMetricCard
        title="إجمالي الزيارات"
        value="+14,280"
        delta="+28.4%"
        deltaType="positive"
        icon={<TrendingUp className="w-4 h-4" />}
        positionClasses="-bottom-6 -right-8 hidden sm:flex"
      />
    </>
  );
}

