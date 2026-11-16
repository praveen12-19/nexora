import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-nexora-border/50 animate-pulse">
      <div className="aspect-[3/4] bg-nexora-beige/60"></div>
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-1/3 bg-nexora-beige rounded"></div>
        <div className="h-4 w-4/5 bg-nexora-beige rounded"></div>
        <div className="h-4 w-1/2 bg-nexora-beige rounded"></div>
        <div className="h-9 w-full bg-nexora-beige rounded mt-3"></div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
