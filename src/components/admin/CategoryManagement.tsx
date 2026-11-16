import React, { useEffect, useState } from 'react';
import { Tags, Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';

interface CategoryManagementProps {
  onSelectCategoryFilter: (category: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  onSelectCategoryFilter,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const list = await productService.getProducts({}, true);
        setProducts(list);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  const categoryMap = products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { total: 0, active: 0, men: 0, women: 0, sampleImage: p.images[0] };
    }
    acc[p.category].total++;
    if (p.active) acc[p.category].active++;
    if (p.gender === 'men') acc[p.category].men++;
    if (p.gender === 'women') acc[p.category].women++;
    return acc;
  }, {} as Record<string, { total: number; active: number; men: number; women: number; sampleImage: string }>);

  const categories = Object.entries(categoryMap).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-nexora-charcoal">
            Category Management
          </h2>
          <p className="text-xs text-nexora-muted mt-0.5">
            Overview of fashion categories and product distribution across genders.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-nexora-charcoal bg-nexora-warmWhite px-3 py-1.5 rounded-lg border border-nexora-border">
          <Tags className="w-4 h-4 text-nexora-primary" />
          <span>{categories.length} Categories Active</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-nexora-muted">
          Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(([name, stats]) => (
            <div
              key={name}
              className="bg-white rounded-xl border border-nexora-border/70 overflow-hidden shadow-sm hover:border-nexora-charcoal/40 transition-all flex flex-col justify-between"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={stats.sampleImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120'}
                    alt={name}
                    className="w-12 h-14 object-cover rounded-lg border border-nexora-border shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-nexora-charcoal">
                      {name}
                    </h3>
                    <span className="text-[11px] text-nexora-muted">
                      {stats.total} total item{stats.total !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-nexora-muted pt-2 border-t border-nexora-border/50">
                  <div className="flex justify-between">
                    <span>Live Active:</span>
                    <span className="font-bold text-emerald-600">{stats.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Men&apos;s / Women&apos;s:</span>
                    <span className="font-medium text-nexora-charcoal">
                      {stats.men}M / {stats.women}W
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-nexora-warmWhite border-t border-nexora-border/50">
                <button
                  onClick={() => onSelectCategoryFilter(name)}
                  className="w-full py-1.5 text-xs font-semibold text-nexora-primary hover:text-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Products</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
