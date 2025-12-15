import { Product, SelectedProducts } from '../../types/product';
import styles from './CompareModal.module.css';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: SelectedProducts;
  products: Product[];
}

interface NutrientRow {
  key: string;
  label: string;
  icon: string;
  unit: string;
  higherIsBetter: boolean;
}

const nutrients: NutrientRow[] = [
  { key: 'calories', label: 'Calories', icon: '🔥', unit: 'kcal', higherIsBetter: false },
  { key: 'protein', label: 'Protein', icon: '💪', unit: 'g', higherIsBetter: true },
  { key: 'fat', label: 'Fat', icon: '🥑', unit: 'g', higherIsBetter: false },
  { key: 'sugar', label: 'Sugar', icon: '🍬', unit: 'g', higherIsBetter: false },
  { key: 'fiber', label: 'Fiber', icon: '🌾', unit: 'g', higherIsBetter: true },
  { key: 'price', label: 'Price', icon: '💰', unit: '$', higherIsBetter: false },
];

export const CompareModal = ({ isOpen, onClose, selectedProducts, products }: CompareModalProps) => {
  if (!isOpen) return null;

  const selectedIds = Object.keys(selectedProducts).map(id => parseInt(id));
  const selectedProductsList = selectedIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined);


  const getPer30g = (product: Product, nutrient: string): number => {
    const servingSize = product.servingSize;
    const multiplier = 30 / servingSize;
    
    switch (nutrient) {
      case 'calories': return product.caloriesPerServing * multiplier;
      case 'protein': return product.proteinPerServing * multiplier;
      case 'fat': return product.fatPerServing * multiplier;
      case 'sugar': return product.sugarPerServing * multiplier;
      case 'fiber': return product.fiberPerServing * multiplier;
      case 'price': return product.price * multiplier;
      default: return 0;
    }
  };

  const getMinMax = (nutrient: string): { min: number; max: number } => {
    const values = selectedProductsList.map(p => getPer30g(p, nutrient));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const getCellClass = (value: number, nutrient: NutrientRow): string => {
    const { min, max } = getMinMax(nutrient.key);
    

    const epsilon = 0.0001;
    const isMin = Math.abs(value - min) < epsilon;
    const isMax = Math.abs(value - max) < epsilon;
    
    if (Math.abs(min - max) < epsilon) return '';
    
    if (nutrient.higherIsBetter) {
      
      if (isMax) return styles.best;
      if (isMin) return styles.worst;
    } else {
    
      if (isMin) return styles.best;
      if (isMax) return styles.worst;
    }
    
    return '';
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === '$') return `$${value.toFixed(2)}`;
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📊 Compare Products</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        <p className={styles.subtitle}>Values per 30g for fair comparison</p>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.nutrientHeader}>Nutrient</th>
                {selectedProductsList.map(product => (
                  <th key={product.id} className={styles.productHeader}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <span className={styles.productName}>{product.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nutrients.map(nutrient => (
                <tr key={nutrient.key}>
                  <td className={styles.nutrientCell}>
                    <span className={styles.nutrientIcon}>{nutrient.icon}</span>
                    <span>{nutrient.label}</span>
                  </td>
                  {selectedProductsList.map(product => {
                    const value = getPer30g(product, nutrient.key);
                    return (
                      <td 
                        key={product.id} 
                        className={`${styles.valueCell} ${getCellClass(value, nutrient)}`}
                      >
                        {formatValue(value, nutrient.unit)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.best}`}></span>
            <span>Best value</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.worst}`}></span>
            <span>Worst value</span>
          </div>
        </div>
      </div>
    </div>
  );
};

