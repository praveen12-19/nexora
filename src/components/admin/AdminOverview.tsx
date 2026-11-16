import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Product } from '../../types/product';
import { AnalyticsSummary } from '../../types/analytics';
import { productService } from '../../services/productService';
import { analyticsService } from '../../services/analyticsService';

interface AdminOverviewProps {
  onNavigateToProducts: () => void;
  onOpenAddProduct: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateToProducts,
  onOpenAddProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prodList, analyticsSummary] = await Promise.all([
          productService.getProducts({}, true),
          analyticsService.getSummary('all'),
        ]);
        setProducts(prodList);
        setSummary(analyticsSummary);
      } catch (err) {
        console.error('Failed to load admin overview data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const featuredProducts = products.filter((p) => p.featured).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-nexora-border/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-nexora-charcoal">
            Nexora Admin Hub
          </h2>
          <p className="text-xs text-nexora-muted mt-1 leading-relaxed">
            Real-time management for catalog discovery, Meesho affiliate links, and traffic analytics.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-nexora-primary hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer touch-manipulation"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToProducts}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-nexora-warmWhite hover:bg-nexora-beige text-nexora-charcoal text-xs font-bold uppercase tracking-wider rounded-lg border border-nexora-border transition-all cursor-pointer touch-manipulation"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Manage Catalog</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 md:gap-4">
        {/* Total Products */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-nexora-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Products</span>
            <ShoppingBag className="w-4 h-4 text-nexora-charcoal" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : totalProducts}
          </div>
          <div className="text-[10px] text-nexora-muted mt-1">
            {featuredProducts} featured
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-nexora-muted">Active Live</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {isLoading ? '...' : activeProducts}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">
            Visible on store
          </div>
        </div>

        {/* Total Visits */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-nexora-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Visits</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.totalVisits ?? 0}
          </div>
          <div className="text-[10px] text-nexora-muted mt-1">
            Sessions tracked
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-nexora-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Unique Visitors</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.uniqueVisitors ?? 0}
          </div>
          <div className="text-[10px] text-nexora-muted mt-1">
            Anonymous devices
          </div>
        </div>

        {/* Product Views */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-nexora-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Product Views</span>
            <Eye className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.totalProductViews ?? 0}
          </div>
          <div className="text-[10px] text-nexora-muted mt-1">
            Product detail hits
          </div>
        </div>
      </div>

      {/* Recent Catalog Preview Table */}
      <div className="bg-white rounded-2xl border border-nexora-border/70 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-nexora-border flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-nexora-charcoal">
              Recent Products In Catalog
            </h3>
            <p className="text-xs text-nexora-muted">
              Recently added fashion pieces.
            </p>
          </div>
          <button
            onClick={onNavigateToProducts}
            className="text-xs font-semibold uppercase tracking-wider text-nexora-primary hover:text-black flex items-center gap-1"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexora-warmWhite text-nexora-muted uppercase tracking-wider text-[10px] border-b border-nexora-border">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Meesho Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexora-border/50">
              {products.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-nexora-warmWhite/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                        alt={p.name}
                        className="w-10 h-12 object-cover rounded border border-nexora-border"
                      />
                      <div>
                        <span className="font-medium text-nexora-charcoal block line-clamp-1">
                          {p.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-nexora-charcoal font-medium">
                    {p.category}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={p.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 flex items-center gap-1 font-semibold"
                    >
                      <span>Affiliate Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
