export * from "@/features/links";
export * from "@/features/settings";

export function calculateQuickMetrics(totalViews: number, totalClicks: number) {
  const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  return {
    totalViews,
    totalClicks,
    ctrPercentage: `${ctr.toFixed(1)}%`,
  };
}
