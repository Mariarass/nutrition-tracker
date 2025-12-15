import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../../types/product';
import styles from './ProductItem.module.css';

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}

export const ProductItem = ({ product, isSelected, onToggle }: ProductItemProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const iconRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [tooltipRoot, setTooltipRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById('tooltip-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'tooltip-root';
      document.body.appendChild(root);
    }
    setTooltipRoot(root);
  }, []);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 12,
        left: rect.right - 280, 
      });
    }

    setShowTooltip((prev) => !prev);
  };


  useEffect(() => {
    if (!showTooltip) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTooltip]);


  const updatePosition = () => {
    if (!iconRef.current) return;
  
    const rect = iconRef.current.getBoundingClientRect();
  
    setPosition({
      top: rect.bottom + 12,
      left: rect.right - 280,
    });
  };

  useEffect(() => {
    if (!showTooltip) return;
  
    updatePosition();
  
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
  
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showTooltip]);
  

  return (
    <>
      <div className={`${styles.productItem} ${isSelected ? styles.selected : ''}`}>
        <div className={styles.productMain}>
          <label className={styles.checkboxContainer}>
            <input type="checkbox" checked={isSelected} onChange={onToggle} />
            <span className={styles.checkmark} />
          </label>

          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
          />

          <span className={styles.productName}>{product.name}</span>

          <div
            ref={iconRef}
            className={`${styles.infoIcon} ${showTooltip ? styles.infoIconActive : ''}`}
            onClick={handleInfoClick}
          >
            <span>?</span>
          </div>
        </div>
      </div>

      {showTooltip && tooltipRoot &&
        createPortal(
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              zIndex: 10000,
            }}
          >
            <div className={styles.tooltipHeader}>{product.name}</div>

            <div className={styles.tooltipContent}>
              <Row label="Serving size" value={`${product.servingSize} g`} />
              <Row label="Calories" value={`${product.caloriesPerServing} kcal`} />
              <Row label="Fat" value={`${product.fatPerServing} g`} />
              <Row label="Protein" value={`${product.proteinPerServing} g`} />
              <Row label="Sugar" value={`${product.sugarPerServing} g`} />
              <Row label="Fiber" value={`${product.fiberPerServing} g`} />

              <div className={`${styles.tooltipRow} ${styles.priceRow}`}>
                <span className={styles.label}>Price per serving:</span>
                <span className={styles.priceValue}>
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>,
          tooltipRoot
        )}
    </>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.tooltipRow}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{value}</span>
  </div>
);
