import { Product, SelectedProducts as SelectedProductsType } from '../../types/product';
import styles from './SelectedProducts.module.css';

interface SelectedProductsProps {
  selectedProducts: SelectedProductsType;
  products: Product[];
  onAmountChange: (productId: number, amount: number) => void;
  onRemove: (productId: number) => void;
}

export const SelectedProducts = ({ selectedProducts, products, onAmountChange, onRemove }: SelectedProductsProps) => {
  const selectedIds = Object.keys(selectedProducts);

  return (
    <div className={styles.selectedProducts}>
      {selectedIds.map(id => {
        const product = products.find(p => p.id === parseInt(id));
        const currentAmount = selectedProducts[parseInt(id)];
        
        if (!product) return null;
        
        return (
          <div key={id} className={styles.selectedProductRow}>
            <button 
              className={styles.removeButton}
              onClick={() => onRemove(parseInt(id))}
              title="Remove product"
            >
              ✕
            </button>
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <span className={styles.productName}>{product.name}</span>
              <span className={styles.servingHint}>1 serving = {product.servingSize}g</span>
            </div>
            <div className={styles.amountInputContainer}>
              <input
                type="number"
                min="0"
                step="1"
                value={currentAmount}
                onChange={(e) => onAmountChange(parseInt(id), parseFloat(e.target.value) || 0)}
                className={styles.amountInput}
              />
              <span className={styles.unit}>g</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
