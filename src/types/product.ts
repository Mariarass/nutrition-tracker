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
  /** Current price per serving ($) */
  price: number;
  /** Best (lowest) price per serving ($) */
  bestPrice: number;
  imageUrl: string;
  category: ProductCategory;
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
}

