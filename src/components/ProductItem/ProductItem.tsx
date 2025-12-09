import { useState } from 'react';
import { Product } from '../../types/product';
import styles from './ProductItem.module.css';

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}

export const ProductItem = ({ product, isSelected, onToggle }: ProductItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`${styles.productItem} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.productMain}>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
          />
          <span className={styles.checkmark}></span>
        </label>
        
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className={styles.productImage}
        />
        
        <span className={styles.productName}>{product.name}</span>
        
        <div 
          className={styles.infoIcon}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span>?</span>
          
          {showTooltip && (
            <div className={styles.tooltip}>
              <div className={styles.tooltipHeader}>{product.name}</div>
              <div className={styles.tooltipContent}>
                <div className={styles.tooltipRow}>
                  <span className={styles.label}>Serving size:</span>
                  <span className={styles.value}>{product.servingSize}g</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.label}>Calories:</span>
                  <span className={styles.value}>{product.caloriesPerServing} kcal</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.label}>Fat:</span>
                  <span className={styles.value}>{product.fatPerServing}g</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.label}>Protein:</span>
                  <span className={styles.value}>{product.proteinPerServing}g</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.label}>Sugar:</span>
                  <span className={styles.value}>{product.sugarPerServing}g</span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.label}>Fiber:</span>
                  <span className={styles.value}>{product.fiberPerServing}g</span>
                </div>
                <div className={`${styles.tooltipRow} ${styles.priceRow}`}>
                  <span className={styles.label}>Price per serving:</span>
                  <span className={`${styles.value} ${styles.priceValue}`}>${product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




