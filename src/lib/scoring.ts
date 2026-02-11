/**
 * Custom points scale for F1 fantasy.
 * Position 1–22 maps to: 25, 22, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
 */
export const POSITION_POINTS: Record<number, number> = {
  1: 25, 2: 22, 3: 20, 4: 19, 5: 18, 6: 17, 7: 16, 8: 15, 9: 14,
  10: 13, 11: 12, 12: 11, 13: 10, 14: 9, 15: 8, 16: 7, 17: 6, 18: 5,
  19: 4, 20: 3, 21: 2, 22: 1,
};

/** Convert finishing position to points. Returns 0 for DNF, DNS, DSQ, or positions outside 1–22. */
export function positionToPoints(position: number): number {
  if (position >= 1 && position <= 22) {
    return POSITION_POINTS[position] ?? 0;
  }
  return 0;
}
