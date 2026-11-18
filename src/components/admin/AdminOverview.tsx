import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Eye, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight,
  MousePointerClick,
  Clock,
  RotateCcw
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodList, analyticsSummary] = await Promise.all([
        productService.getProducts({}, true),
        analyticsService.getSummary('today'), // Strictly today's 24-hr metrics (EOD reset)
      ]);
      setProducts(prodList);
      setSummary(analyticsSummary);
    } catch (err) {
      console.error('Failed to load admin overview data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTodayCounts = () => {
    if (window.confirm("Are you sure you want to clear today's activity counts? All visits, visitors, views, and link clicks will reset to 0.")) {
      analyticsService.clearTodayCounts();
      setSummary({
        totalVisits: 0,
        uniqueVisitors: 0,
        totalProductViews: 0,
        totalProductClicks: 0,
        totalAffiliateClicks: 0,
        clickThroughRate: 0,
      });
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh when tab regains focus or when an affiliate click is logged
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('nexora_affiliate_click_updated', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('nexora_affiliate_click_updated', handleFocus);
    };
  }, []);

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

      {/* Today's Live Metrics */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-nexora-charcoal">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Today's Activity</span>
          </div>
          <button
            type="button"
            onClick={handleClearTodayCounts}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-nexora-muted hover:text-red-600 bg-white hover:bg-red-50 border border-nexora-border/80 hover:border-red-200 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Clear today's visit, view, and link click counts to 0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Count</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
          {/* 1. Today's Total Visits */}
          <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-nexora-muted mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Today's Visits</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-nexora-charcoal">
              {isLoading ? '...' : summary?.totalVisits ?? 0}
            </div>
            <div className="text-[10px] text-nexora-muted mt-1">
              Sessions today
            </div>
          </div>

          {/* 2. Today's Unique Visitors */}
          <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-nexora-muted mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Unique Visitors</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-nexora-charcoal">
              {isLoading ? '...' : summary?.uniqueVisitors ?? 0}
            </div>
            <div className="text-[10px] text-nexora-muted mt-1">
              Devices today
            </div>
          </div>

          {/* 3. Today's Product Views */}
          <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-nexora-muted mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Product Views</span>
              <Eye className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-nexora-charcoal">
              {isLoading ? '...' : summary?.totalProductViews ?? 0}
            </div>
            <div className="text-[10px] text-nexora-muted mt-1">
              Detail hits today
            </div>
          </div>

          {/* 4. Today's Link Clicks (Affiliate Outbound) */}
          <div className="bg-white p-4 rounded-xl border border-pink-200/90 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-pink-50/40">
            <div className="flex items-center justify-between text-pink-700 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Today's Link Clicks</span>
              <MousePointerClick className="w-4 h-4 text-pink-600" />
            </div>
            <div className="text-2xl font-bold text-pink-700">
              {isLoading ? '...' : summary?.totalAffiliateClicks ?? 0}
            </div>
            <div className="text-[10px] text-pink-600 mt-1">
              Affiliate clicks today
            </div>
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
                      onClick={() => {
                        analyticsService.trackEvent('affiliate_click', p.id).catch(() => {});
                      }}
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
