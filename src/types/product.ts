export type ProductCategory = 'nuts' | 'seeds' | 'fruits' | 'sweeteners' | 'other' | 'packaging';

export interface Product {
  id: number;
  name: string;
  servingSize: number;
  caloriesPerServing: number;
  fatPerServing: number;
  proteinPerServing: number;
  sugarPerServing: number;
  fiberPerServing: number;
  /** Dietary fiber per serving (for label); defaults to fiberPerServing if omitted. Can be "<1" for values less than 1g */
  dietaryFiberPerServing?: number | string;
  /** Current price per serving ($) */
  price: number;
  /** Best (lowest) price per serving ($) */
  bestPrice: number;
  imageUrl: string;
  category: ProductCategory;
  /** For Nutrition Facts label (per serving) */
  saturatedFatPerServing?: number;
  transFatPerServing?: number;
  cholesterolPerServing?: number;
  sodiumPerServing?: number;
  totalCarbohydratePerServing?: number;
  addedSugarsPerServing?: number;
  vitaminDPerServing?: number;
  calciumPerServing?: number;
  ironPerServing?: number;
  potassiumPerServing?: number;
  vitaminCPerServing?: number;
  magnesiumPerServing?: number;
  /** Allergen names for CONTAINS (e.g. "PEANUTS", "TREE NUTS") */
  allergens?: string[];
}

export interface SelectedProducts {
  [productId: number]: number;
}

export interface NutritionTotals {
  totalWeight: number;
  calories: number;
  fat: number;
  protein: number;
  sugar: number;
  fiber: number;
  /** Total cost at current prices */
  price: number;
  /** Total cost at best prices */
  totalBestPrice: number;
  /** For Nutrition Facts label */
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  totalCarbohydrate?: number;
  addedSugars?: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  vitaminC?: number;
  magnesium?: number;
}

