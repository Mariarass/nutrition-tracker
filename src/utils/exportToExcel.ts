import * as XLSX from 'xlsx';
import { Product, SelectedProducts, NutritionTotals } from '../types/product';

export function exportToExcel(
  selectedProducts: SelectedProducts,
  products: Product[],
  totals: NutritionTotals,
  barWeight: number = 48
): void {
  const rows: (string | number)[][] = [
    ['Product', 'Amount (g)', 'Calories', 'Fat (g)', 'Protein (g)', 'Sugar (g)', 'Fiber (g)', 'Current price ($)', 'Best price ($)'],
  ];

  Object.entries(selectedProducts).forEach(([productId, grams]) => {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product || grams <= 0) return;
    const mult = grams / product.servingSize;
    rows.push([
      product.name,
      grams,
      Math.round(product.caloriesPerServing * mult * 100) / 100,
      Math.round(product.fatPerServing * mult * 100) / 100,
      Math.round(product.proteinPerServing * mult * 100) / 100,
      Math.round(product.sugarPerServing * mult * 100) / 100,
      Math.round((typeof product.dietaryFiberPerServing === 'number' ? product.dietaryFiberPerServing : typeof product.dietaryFiberPerServing === 'string' ? 0 : product.fiberPerServing) * mult * 100) / 100,
      Math.round(product.price * mult * 100) / 100,
      Math.round(product.bestPrice * mult * 100) / 100,
    ]);
  });

  rows.push([]);
  const barRatio = totals.totalWeight > 0 ? barWeight / totals.totalWeight : 0;
  rows.push([
    'TOTAL',
    Math.round(totals.totalWeight * 100) / 100,
    Math.round(totals.calories * 100) / 100,
    Math.round(totals.fat * 100) / 100,
    Math.round(totals.protein * 100) / 100,
    Math.round(totals.sugar * 100) / 100,
    Math.round(totals.fiber * 100) / 100,
    Math.round(totals.price * 100) / 100,
    Math.round(totals.totalBestPrice * 100) / 100,
  ]);
  rows.push([
    `Per 1 bar (${barWeight}g)`,
    barWeight,
    Math.round((totals.calories * barRatio) * 100) / 100,
    Math.round((totals.fat * barRatio) * 100) / 100,
    Math.round((totals.protein * barRatio) * 100) / 100,
    Math.round((totals.sugar * barRatio) * 100) / 100,
    Math.round((totals.fiber * barRatio) * 100) / 100,
    Math.round((totals.price * barRatio) * 100) / 100,
    Math.round((totals.totalBestPrice * barRatio) * 100) / 100,
  ]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Menu');
  const fileName = `nutrition-menu-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
