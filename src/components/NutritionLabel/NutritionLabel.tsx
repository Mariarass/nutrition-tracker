import { forwardRef } from 'react';
import { DAILY_VALUES, percentDV } from '../../utils/dailyValues';
import styles from './NutritionLabel.module.css';

export interface PerServingNutrients {
  calories: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  totalSugars: number;
  addedSugars: number;
  protein: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
  vitaminA?: number;
  vitaminC?: number;
  magnesium?: number;
}

interface NutritionLabelProps {
  perServing: PerServingNutrients;
  servingSizeGrams: number;
  servingsPerContainer: number;
  ingredients: string;
  contains: string;
}

const formatNutrient = (val: number) => Math.round(val);

/** Format dietary fiber: show "<1" when 0 < val < 1 */
const formatDietaryFiber = (val: number) =>
  val > 0 && val < 1 ? '<1' : String(Math.round(val));

/** FDA: Vitamin D (mcg): <0.5→0, 0.5–0.99→1, ≥1 round to nearest int */
const formatVitaminD = (val: number) => (val < 0.5 ? 0 : Math.round(val));

/** Calcium (mg): whole numbers as-is, decimals round to nearest int (21→21, 21.2→21, 21.94→22) */
const formatCalcium = (val: number) => (val % 1 === 0 ? val : Math.round(val));

/** FDA: Iron (mg): round to nearest 0.1 */
const formatIron = (val: number) => Math.round(val * 10) / 10;

/** Potassium (mg): whole numbers as-is, decimals round to nearest int (26→26, 26.233→26, 26.777→27) */
const formatPotassium = (val: number) => (val % 1 === 0 ? val : Math.round(val));

/** Vitamin C (mg): 1 decimal, truncate (6.679→6.6) */
const formatVitaminC = (val: number) => Math.floor(val * 10) / 10;

export const NutritionLabel = forwardRef<HTMLDivElement, NutritionLabelProps>(
  ({ perServing, servingSizeGrams, servingsPerContainer, ingredients, contains }, ref) => {
    const dv = (val: number, refVal: number) => percentDV(val, refVal);

    return (
      <div ref={ref} className={styles.label}>
        <div className={styles.factsTitle}>Nutrition Facts</div>


        <div className={styles.servingsRow}>
          3.5 serving{servingsPerContainer !== 1 ? 's' : ''} per container
        </div>
        <div className={styles.servingSizeRow}>
          <span className={styles.servingSizeLabel}>Serving size</span>
          <span className={styles.servingSizeValue}> 3 balls ({servingSizeGrams}g)</span>
        </div>
        <div className={styles.veryThickLine} />
        <div className={styles.amountPerServing}>Amount per serving</div>
        <div className={styles.caloriesRow}>
          <span className={styles.caloriesLabel}>Calories</span>
          <span className={styles.caloriesValue}>{Math.round(perServing.calories)}</span>
        </div>

        <div className={styles.mediumLine2} />

        <div className={styles.dvHeader}>
          <span>% Daily Value*</span>
        </div>

        <div className={styles.nutrientRow}>
          <span><strong>Total Fat</strong> {formatNutrient(perServing.totalFat)}g</span>
          <span>{dv(perServing.totalFat, DAILY_VALUES.totalFat)}%</span>
        </div>
        <div className={styles.nutrientRowIndent}>
          <span>Saturated Fat {formatNutrient(perServing.saturatedFat)}g</span>
          <span>{dv(perServing.saturatedFat, DAILY_VALUES.saturatedFat)}%</span>
        </div>
        <div className={styles.nutrientRowIndentTrans}>
          <span><span style={{ fontStyle: 'italic' }}>Trans</span> Fat {formatNutrient(perServing.transFat)}g</span>
        </div>

        <div className={styles.nutrientRow}>
          <span><strong>Cholesterol</strong> {formatNutrient(perServing.cholesterol)}mg</span>
          <span>{dv(perServing.cholesterol, DAILY_VALUES.cholesterol)}%</span>
        </div>

        <div className={styles.nutrientRow}>
          <span><strong>Sodium</strong> {formatNutrient(perServing.sodium)}mg</span>
          <span>{dv(perServing.sodium, DAILY_VALUES.sodium)}%</span>
        </div>

        <div className={styles.nutrientRow}>
          <span><strong>Total Carbohydrate</strong> <span style={{ fontWeight: '300' }}>{formatNutrient(perServing.totalCarbohydrate)}g</span></span>
          <span>{dv(perServing.totalCarbohydrate, DAILY_VALUES.totalCarbohydrate)}%</span>
        </div>
        <div className={styles.nutrientRowIndent}>
          <span>Dietary Fiber {formatDietaryFiber(perServing.dietaryFiber)}g</span>
          <span>{perServing.dietaryFiber >= 1 ? dv(perServing.dietaryFiber, DAILY_VALUES.dietaryFiber) : 0}%</span>
        </div>
        <div className={styles.nutrientRowIndentNoDv}>
          <span>Total Sugars {formatNutrient(perServing.totalSugars)}g</span>
        </div>
        <div className={styles.nutrientRowIndent2}>
          <span>Added Sugars {formatNutrient(perServing.addedSugars)}g</span>
          <span>{dv(perServing.addedSugars, DAILY_VALUES.addedSugars)}%</span>
        </div>

        <div className={`${styles.nutrientRow} ${styles.nutrientRowNoBorder}`}>
          <span><strong>Protein</strong> <span style={{ fontWeight: '300' }}>{formatNutrient(perServing.protein)}g</span></span>
        </div>

        <div className={styles.mediumLine} />

        <div className={styles.nutrientRowVitamins}>
          <span>Vitamin D {formatVitaminD(perServing.vitaminD)}mcg</span>
          <span>{dv(formatVitaminD(perServing.vitaminD), DAILY_VALUES.vitaminD)}%</span>
        </div>
        <div className={styles.nutrientRowVitamins}>
          <span>Calcium {formatCalcium(perServing.calcium)}mg</span>
          <span>{dv(formatCalcium(perServing.calcium), DAILY_VALUES.calcium)}%</span>
        </div>
        <div className={styles.nutrientRowVitamins}>
          <span>Iron {formatIron(perServing.iron)}mg</span>
          <span>{dv(formatIron(perServing.iron), DAILY_VALUES.iron)}%</span>
        </div>
        <div className={styles.nutrientRowVitamins} style={!(perServing.vitaminC ?? 0) && !(perServing.magnesium ?? 0) ? { borderBottom: 'none' } : undefined}>
          <span>Potassium {formatPotassium(perServing.potassium)}mg</span>
          <span>{dv(formatPotassium(perServing.potassium), DAILY_VALUES.potassium)}%</span>
        </div>
        {(perServing.vitaminC ?? 0) > 0 && (
          <div className={styles.nutrientRowVitamins} style={!(perServing.magnesium ?? 0) ? { borderBottom: 'none' } : undefined}>
            <span>Vitamin C {formatVitaminC(perServing.vitaminC ?? 0)}mg</span>
            <span>{dv(formatVitaminC(perServing.vitaminC ?? 0), DAILY_VALUES.vitaminC)}%</span>
          </div>
        )}
        {(perServing.magnesium ?? 0) > 0 && (
          <div className={styles.nutrientRowVitamins} style={{ borderBottom: 'none' }}>
            <span>Magnesium {formatNutrient(perServing.magnesium ?? 0)}mg</span>
            <span>{dv(perServing.magnesium ?? 0, DAILY_VALUES.magnesium)}%</span>
          </div>
        )}
        {/* <div className={styles.nutrientRowVitamins} style={{ borderBottom: 'none' }}>
          <span>Vitamin A {formatNutrient(perServing.vitaminA ?? 0)}mcg</span>
          <span>{dv(perServing.vitaminA ?? 0, DAILY_VALUES.vitaminA)}%</span>
        </div> */}

        <div className={styles.mediumLine} />

        <div className={styles.footer}>
          * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </div>

        {/* INGREDIENTS & CONTAINS - at bottom */}
        {(ingredients || contains) && (
          <div className={styles.bottomBlock}>
            {ingredients && (
              <div className={styles.ingredients}>
                <span className={styles.ingredientsTitle}>INGREDIENTS: </span>
                <span className={styles.ingredientsText}>{ingredients}</span>
              </div>
            )}
            {contains && (
              <div className={styles.contains}>CONTAINS: {contains}</div>
            )}
          </div>
        )}
        <div className={styles.disclaimer}>
          Nutrition information is based on ingredients used, not laboratory tested.
        </div>
        <div className={styles.disclaimer}>
          Produced in a kitchen that creates ingredients with peanuts.
        </div>
      </div>
    );
  }
);

NutritionLabel.displayName = 'NutritionLabel';
