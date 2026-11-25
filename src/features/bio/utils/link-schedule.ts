/**
 * Evaluates whether a link is visible/accessible at the current timestamp
 * given optional scheduledStart and scheduledEnd bounds.
 */
export function isLinkWithinSchedule(
  link: {
    scheduledStart?: Date | string | null;
    scheduledEnd?: Date | string | null;
  },
  now: Date = new Date()
): boolean {
  const nowMs = now.getTime();
  if (link.scheduledStart) {
    const startMs = new Date(link.scheduledStart).getTime();
    if (!Number.isNaN(startMs) && nowMs < startMs) {
      return false;
    }
  }
  if (link.scheduledEnd) {
    const endMs = new Date(link.scheduledEnd).getTime();
    if (!Number.isNaN(endMs) && nowMs > endMs) {
      return false;
    }
  }
  return true;
}
