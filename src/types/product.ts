export type ProductCategory = 'nuts' | 'seeds' | 'fruits' | 'sweeteners' | 'other';

export interface Product {
  id: number;
  name: string;
  servingSize: number;
  caloriesPerServing: number;
  fatPerServing: number;
  proteinPerServing: number;
  sugarPerServing: number;
  fiberPerServing: number;
  price: number;
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
  price: number;
}

