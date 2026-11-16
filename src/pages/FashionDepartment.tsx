import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';

interface FashionDepartmentProps {
  gender: 'men' | 'women';
}

export const FashionDepartment: React.FC<FashionDepartmentProps> = ({ gender }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const list = await productService.getProducts({ gender });
        setProducts(list);
      } catch (err) {
        console.error(`Failed to load ${gender} products:`, err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [gender]);

  // If loading or no products yet, leave the page completely empty as requested
  if (isLoading || products.length === 0) {
    return <div className="min-h-[70vh]" />;
  }

  // When products are added by admin, display them in a clean modern grid
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[70vh]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};
