import React from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyMessage = 'No products match your current filters.',
}) => {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-2xl border border-nexora-border/80 shadow-xs max-w-lg mx-auto space-y-3">
        <div className="w-14 h-14 rounded-full bg-nexora-beige flex items-center justify-center mx-auto text-nexora-charcoal">
          <ShoppingBag className="w-6 h-6 text-nexora-charcoal" />
        </div>
        <h3 className="font-serif text-lg font-bold text-nexora-charcoal">
          Collection Coming Soon
        </h3>
        <p className="text-xs text-nexora-muted max-w-sm mx-auto leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};
