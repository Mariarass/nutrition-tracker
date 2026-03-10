/** Reference daily values for 2,000 cal diet (for % DV on label) */
export const DAILY_VALUES = {
  totalFat: 78,
  saturatedFat: 20,
  cholesterol: 300,
  sodium: 2300,
  totalCarbohydrate: 275,
  dietaryFiber: 28,
  addedSugars: 50,
  protein: 50, // no % DV shown
  vitaminD: 20,
  calcium: 1300,
  iron: 18,
  potassium: 4700,
  vitaminA: 900,
  vitaminC: 90,
  magnesium: 420,
} as const;

export function percentDV(value: number, ref: number): number {
  if (ref <= 0) return 0;
  return Math.round((value / ref) * 100);
}
