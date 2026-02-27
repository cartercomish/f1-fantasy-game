/**
 * Custom points scale for F1 fantasy drivers.
 * Positions 19–22 score 0.
 */
export const POSITION_POINTS: Record<number, number> = {
  1: 35, 2: 30, 3: 27, 4: 24, 5: 22, 6: 20, 7: 18, 8: 16, 9: 14,
  10: 12, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1,
  19: 0, 20: 0, 21: 0, 22: 0,
};

/** Convert finishing position to points. Returns 0 for DNF, DNS, DSQ, or positions outside 1–22. */
export function positionToPoints(position: number): number {
  if (position >= 1 && position <= 22) {
    return POSITION_POINTS[position] ?? 0;
  }
  return 0;
}
