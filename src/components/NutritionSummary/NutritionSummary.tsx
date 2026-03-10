import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { NutritionTotals, Product, SelectedProducts } from '../../types/product';
import { exportToExcel } from '../../utils/exportToExcel';
import { NutritionLabel, type PerServingNutrients } from '../NutritionLabel';
import styles from './NutritionSummary.module.css';

interface NutritionSummaryProps {
  totals: NutritionTotals;
  selectedProducts: SelectedProducts;
  products: Product[];
  packagingProducts: Product[];
  includeContainerInCost: boolean;
  includeStickersInCost: boolean;
  onIncludeContainerChange: (value: boolean) => void;
  onIncludeStickersChange: (value: boolean) => void;
}

export const NutritionSummary = ({
  totals,
  selectedProducts,
  products,
  packagingProducts,
  includeContainerInCost,
  includeStickersInCost,
  onIncludeContainerChange,
  onIncludeStickersChange,
}: NutritionSummaryProps) => {
  const [barWeight, setBarWeight] = useState<number>(48);
  const [servingsPerContainer, setServingsPerContainer] = useState<number | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const formatNumber = (num: number, decimals: number = 2): string => {
    const fixed = num.toFixed(decimals);
    return parseFloat(fixed).toString();
  };

  const exactBars = totals.totalWeight > 0 ? totals.totalWeight / barWeight : 0;
  const wholeBars = Math.floor(exactBars);
  const remainder = totals.totalWeight - (wholeBars * barWeight);
  const barRatio = barWeight / totals.totalWeight || 0;
  const displayServings = servingsPerContainer ?? Math.max(1, Math.round(exactBars * 10) / 10);

  const perBar = {
    calories: totals.calories * barRatio,
    fat: totals.fat * barRatio,
    protein: totals.protein * barRatio,
    sugar: totals.sugar * barRatio,
    fiber: totals.fiber * barRatio,
    price: totals.price * barRatio,
    bestPrice: totals.totalBestPrice * barRatio,
  };

  const perServingForLabel: PerServingNutrients = (() => {
    const fat = totals.fat * barRatio;
    const carb = ((totals.totalCarbohydrate ?? totals.sugar + totals.fiber) * barRatio);
    const protein = totals.protein * barRatio;
    const fiber = totals.fiber * barRatio;
    const totalSugars = totals.sugar * barRatio;
    const addedSugars = (totals.addedSugars ?? 0) * barRatio;
    const potassiumRaw = (totals.potassium ?? 0) * barRatio;
    const potassiumRounded = potassiumRaw % 1 === 0 ? potassiumRaw : Math.round(potassiumRaw);
    return {
      calories: totals.calories * barRatio,
      totalFat: fat,
      saturatedFat: (totals.saturatedFat ?? 0) * barRatio,
      transFat: (totals.transFat ?? 0) * barRatio,
      cholesterol: (totals.cholesterol ?? 0) * barRatio,
      sodium: (totals.sodium ?? 0) * barRatio,
      totalCarbohydrate: carb,
      dietaryFiber: fiber,
      totalSugars: totalSugars,
      addedSugars,
      protein,
      vitaminD: (totals.vitaminD ?? 0) * barRatio,
      calcium: (totals.calcium ?? 0) * barRatio,
      iron: (totals.iron ?? 0) * barRatio,
      potassium: potassiumRounded,
      vitaminC: (totals.vitaminC ?? 0) * barRatio,
      magnesium: (totals.magnesium ?? 0) * barRatio,
    };
  })();

  const ingredientNames = Object.entries(selectedProducts)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => products.find((p) => p.id === parseInt(id))?.name)
    .filter(Boolean) as string[];
  const ingredientsText = ingredientNames.join(', ').toUpperCase();
  const allergensSet = new Set<string>();
  Object.keys(selectedProducts).forEach((id) => {
    const p = products.find((pr) => pr.id === parseInt(id));
    p?.allergens?.forEach((a) => allergensSet.add(a));
  });
  const containsText = Array.from(allergensSet).join(', ');

  const handleDownloadLabelPNG = async () => {
    if (!labelRef.current) return;
    const canvas = await html2canvas(labelRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = `nutrition-label-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={styles.nutritionSummary}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>📊 Nutrition Total</h3>
        <button
          type="button"
          className={styles.exportButton}
          onClick={() => exportToExcel(selectedProducts, products, totals, barWeight)}
        >
          📥 Export to Excel
        </button>
      </div>

      {/* Container & Stickers */}
      {packagingProducts.length > 0 && (
        <div className={styles.packagingSection}>
          <h4 className={styles.packagingTitle}>📦 Container & Stickers</h4>
          <div className={styles.packagingList}>
            {packagingProducts.map((p) => {
              const isContainer = p.name === 'Container';
              const isStickers = p.name === 'Stickers';
              const checked = isContainer ? includeContainerInCost : includeStickersInCost;
              const onChange = isContainer ? onIncludeContainerChange : onIncludeStickersChange;
              return (
                <label key={p.id} className={styles.packagingItem}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className={styles.packagingCheckbox}
                  />
                  <img src={p.imageUrl} alt={p.name} className={styles.packagingImage} />
                  <span className={styles.packagingName}>{p.name}</span>
                  <span className={styles.packagingPrices}>
                    ${p.price.toFixed(2)} <span className={styles.packagingBest}>(best: ${p.bestPrice.toFixed(2)})</span>
                  </span>
                  <span className={styles.packagingLabel}>Include in cost</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.totalWeight}`}>
          <div className={styles.cardIcon}>⚖️</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{formatNumber(totals.totalWeight)}g</span>
            <span className={styles.cardLabel}>Total Weight</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.calories}`}>
          <div className={styles.cardIcon}>🔥</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{formatNumber(totals.calories)}</span>
            <span className={styles.cardLabel}>Calories (kcal)</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.protein}`}>
          <div className={styles.cardIcon}>💪</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{formatNumber(totals.protein)}g</span>
            <span className={styles.cardLabel}>Protein</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.fat}`}>
          <div className={styles.cardIcon}>🥑</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{formatNumber(totals.fat)}g</span>
            <span className={styles.cardLabel}>Fat</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.sugar}`}>
          <div className={styles.cardIcon}>🍬</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{formatNumber(totals.sugar)}g</span>
            <span className={styles.cardLabel}>Sugar</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.fiber}`}>
          <div className={styles.cardIcon}>🌾</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{formatNumber(totals.fiber)}g</span>
            <span className={styles.cardLabel}>Fiber</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.price}`}>
          <div className={styles.cardIcon}>💰</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>${totals.price.toFixed(2)}</span>
            <span className={styles.cardLabel}>Total (current price)</span>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.bestPrice}`}>
          <div className={styles.cardIcon}>🏷️</div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>${totals.totalBestPrice.toFixed(2)}</span>
            <span className={styles.cardLabel}>Total (best price)</span>
          </div>
        </div>
      </div>

      {/* Bar Calculator */}
      <div className={styles.barCalculator}>
        <h3 className={styles.title}>🍫 Bar Calculator</h3>
        
        <div className={styles.barInputRow}>
          <label className={styles.barLabel}>Weight per bar:</label>
          <div className={styles.barInputContainer}>
            <input
              type="number"
              min="1"
              value={barWeight}
              onChange={(e) => setBarWeight(parseFloat(e.target.value) || 1)}
              className={styles.barInput}
            />
            <span className={styles.barUnit}>g</span>
          </div>
        </div>
        <div className={styles.barInputRow}>
          <label className={styles.barLabel}>Servings per container:</label>
          <div className={styles.barInputContainer}>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={servingsPerContainer ?? (exactBars || '')}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setServingsPerContainer(e.target.value === '' || isNaN(v) ? null : v);
              }}
              placeholder={totals.totalWeight > 0 ? exactBars.toFixed(1) : '—'}
              className={styles.barInput}
            />
          </div>
        </div>

        <div className={styles.barResult}>
          <div className={styles.barCountCard}>
            <span className={styles.barCountValue}>{exactBars.toFixed(2)}</span>
            <span className={styles.barCountLabel}>bars total</span>
          </div>
          <div className={styles.barDetailsCard}>
            <div className={styles.barDetail}>
              <span className={styles.barDetailValue}>{wholeBars}</span>
              <span className={styles.barDetailLabel}>whole bars</span>
            </div>
          
          </div>
        </div>

        {exactBars > 0 && (
          <>
            <h4 className={styles.perBarTitle}>Nutrition per 1 bar ({barWeight}g):</h4>
            <div className={styles.perBarGrid}>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>🔥</span>
                <span className={styles.perBarValue}>{formatNumber(perBar.calories, 4)}</span>
                <span className={styles.perBarLabel}>kcal</span>
              </div>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>💪</span>
                <span className={styles.perBarValue}>{formatNumber(perBar.protein, 4)}g</span>
                <span className={styles.perBarLabel}>protein</span>
              </div>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>🥑</span>
                <span className={styles.perBarValue}>{formatNumber(perBar.fat, 4)}g</span>
                <span className={styles.perBarLabel}>fat</span>
              </div>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>🍬</span>
                <span className={styles.perBarValue}>{formatNumber(perBar.sugar, 4)}g</span>
                <span className={styles.perBarLabel}>sugar</span>
              </div>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>🌾</span>
                <span className={styles.perBarValue}>{formatNumber(perBar.fiber, 4)}g</span>
                <span className={styles.perBarLabel}>fiber</span>
              </div>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>💰</span>
                <span className={styles.perBarValue}>${formatNumber(perBar.price, 4)}</span>
                <span className={styles.perBarLabel}>price (current)</span>
              </div>
              <div className={styles.perBarItem}>
                <span className={styles.perBarIcon}>🏷️</span>
                <span className={styles.perBarValue}>${formatNumber(perBar.bestPrice, 4)}</span>
                <span className={styles.perBarLabel}>price (best)</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Nutrition Label preview & Download PNG */}
      {totals.totalWeight > 0 && (
        <div className={styles.labelSection}>
          <h3 className={styles.title}>🏷️ Nutrition Label</h3>
          <div className={styles.labelPreviewRow}>
            <NutritionLabel
              ref={labelRef}
              perServing={perServingForLabel}
              servingSizeGrams={barWeight}
              servingsPerContainer={displayServings}
              ingredients={ingredientsText}
              contains={containsText}
            />
            <div className={styles.labelActions}>
              <button
                type="button"
                className={styles.downloadPngButton}
                onClick={handleDownloadLabelPNG}
              >
                📥 Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

