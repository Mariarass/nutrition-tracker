import { useState, useMemo, useRef } from 'react';
import { products, categoryLabels } from './data/products';
import { ProductItem } from './components/ProductItem';
import { SelectedProducts } from './components/SelectedProducts';
import { NutritionSummary } from './components/NutritionSummary';
import { CompareModal } from './components/CompareModal';
import { SelectedProducts as SelectedProductsType, NutritionTotals, ProductCategory } from './types/product';
import styles from './App.module.css';

const allCategories: ProductCategory[] = ['nuts', 'seeds', 'fruits', 'sweeteners', 'other'];

function App() {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProductsType>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const selectedSectionRef = useRef<HTMLElement>(null);

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category if any selected
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategories]);

  const handleToggleProduct = (productId: number): void => {
    setSelectedProducts(prev => {
      if (prev[productId]) {
        const newSelected = { ...prev };
        delete newSelected[productId];
        return newSelected;
      } else {
        const product = products.find(p => p.id === productId);
        if (!product) return prev;
        return { ...prev, [productId]: product.servingSize };
      }
    });
  };

  const handleAmountChange = (productId: number, amount: number): void => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: amount
    }));
  };

  const handleRemoveProduct = (productId: number): void => {
    setSelectedProducts(prev => {
      const newSelected = { ...prev };
      delete newSelected[productId];
      return newSelected;
    });
  };

  const handleClearAll = (): void => {
    setSelectedProducts({});
  };

  const scrollToSelected = (): void => {
    if (selectedSectionRef.current) {
      selectedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const calculateTotals = (): NutritionTotals => {
    const totals: NutritionTotals = {
      totalWeight: 0,
      calories: 0,
      fat: 0,
      protein: 0,
      sugar: 0,
      fiber: 0,
      price: 0
    };

    Object.entries(selectedProducts).forEach(([productId, grams]) => {
      const product = products.find(p => p.id === parseInt(productId));
      if (product && grams > 0) {
        const multiplier = grams / product.servingSize;
        totals.totalWeight += grams;
        totals.calories += product.caloriesPerServing * multiplier;
        totals.fat += product.fatPerServing * multiplier;
        totals.protein += product.proteinPerServing * multiplier;
        totals.sugar += product.sugarPerServing * multiplier;
        totals.fiber += product.fiberPerServing * multiplier;
        totals.price += product.price * multiplier;
      }
    });

    return totals;
  };

  const totals = calculateTotals();
  const hasSelectedProducts = Object.keys(selectedProducts).length > 0;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nutrition Tracker</h1>
        <p className={styles.subtitle}>Creat your own healthy snack bar</p>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>🍽️ Available Products</h2>
          <div className={styles.filtersContainer}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            <div className={styles.categoryFilters}>
              {allCategories.map(category => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${selectedCategories.includes(category) ? styles.categoryActive : ''}`}
                  onClick={() => toggleCategory(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
              {selectedCategories.length > 0 && (
                <button
                  className={styles.clearFilters}
                  onClick={() => setSelectedCategories([])}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductItem
                key={product.id}
                product={product}
                isSelected={!!selectedProducts[product.id]}
                onToggle={() => handleToggleProduct(product.id)}
              />
            ))}
            {filteredProducts.length === 0 && (
              <p className={styles.noResults}>No products found</p>
            )}
          </div>
        </section>

        {hasSelectedProducts && (
          <section ref={selectedSectionRef} className={styles.selectedSection}>
            <div className={styles.selectedHeader}>
              <h2 className={styles.sectionTitle}>✅ Selected Products</h2>
              {Object.keys(selectedProducts).length >= 2 && (
                <button 
                  className={styles.compareButton}
                  onClick={() => setIsCompareModalOpen(true)}
                >
                  📊 Compare
                </button>
              )}
            </div>
            <SelectedProducts
              selectedProducts={selectedProducts}
              products={products}
              onAmountChange={handleAmountChange}
              onRemove={handleRemoveProduct}
            />
            <NutritionSummary totals={totals} />
          </section>
        )}

        <CompareModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          selectedProducts={selectedProducts}
          products={products}
        />
      </main>

      {hasSelectedProducts && (
        <div className={styles.fixedButtons}>
          <button 
            className={styles.scrollToSelectedButton}
            onClick={scrollToSelected}
            title="Scroll to selected products"
          >
            Scroll to nutrition
          </button>
          <button 
            className={styles.clearSelectedButton}
            onClick={handleClearAll}
            title="Clear selected products"
          >
            Clear selected
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

