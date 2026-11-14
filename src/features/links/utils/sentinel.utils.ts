export function formatSentinelStatus(
  activeCount: number,
  totalCount: number,
  avgResponseMs: number = 72
): string {
  return `${activeCount}/${totalCount} روابط تعمل بسرعة استجابة ${avgResponseMs}ms`;
}
