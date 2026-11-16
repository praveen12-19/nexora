import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';

export const Collections: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCouplesProducts() {
      setIsLoading(true);
      try {
        // Query products for couples collection
        const list = await productService.getProducts();
        const couplesList = list.filter(
          (p) =>
            p.gender === 'couples' ||
            p.gender === 'unisex' ||
            p.category.toLowerCase().includes('couple') ||
            p.name.toLowerCase().includes('couple')
        );
        setProducts(couplesList);
      } catch (err) {
        console.error('Failed to load couples collection products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCouplesProducts();
  }, []);

  // If loading or no products yet, keep it completely clean and empty as requested
  if (isLoading || products.length === 0) {
    return <div className="min-h-[70vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[70vh]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
          />
        ))}
      </div>
    </div>
  );
};
