import { useState } from 'react';
import { NutritionTotals, Product, SelectedProducts } from '../../types/product';
import { exportToExcel } from '../../utils/exportToExcel';
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

  const formatNumber = (num: number, decimals: number = 2): string => {
    const fixed = num.toFixed(decimals);
    return parseFloat(fixed).toString();
  };

  const exactBars = totals.totalWeight > 0 ? totals.totalWeight / barWeight : 0;
  const wholeBars = Math.floor(exactBars);
  const remainder = totals.totalWeight - (wholeBars * barWeight);
  const barRatio = barWeight / totals.totalWeight || 0;

  const perBar = {
    calories: totals.calories * barRatio,
    fat: totals.fat * barRatio,
    protein: totals.protein * barRatio,
    sugar: totals.sugar * barRatio,
    fiber: totals.fiber * barRatio,
    price: totals.price * barRatio,
    bestPrice: totals.totalBestPrice * barRatio,
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
    </div>
  );
};

