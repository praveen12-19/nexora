import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  ExternalLink, 
  MousePointerClick, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw,
  Award
} from 'lucide-react';
import { 
  AnalyticsSummary, 
  ProductPerformance, 
  AnalyticsDateFilter 
} from '../../types/analytics';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrency } from '../../utils/currency';

export const AnalyticsDashboard: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<AnalyticsDateFilter>('all');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [performance, setPerformance] = useState<ProductPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [sum, perf] = await Promise.all([
        analyticsService.getSummary(dateFilter),
        analyticsService.getProductPerformance(dateFilter),
      ]);
      setSummary(sum);
      setPerformance(perf);
    } catch (err) {
      console.error('Failed to load analytics dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateFilter]);

  // Top performers
  const topViewed = [...performance].sort((a, b) => b.totalViews - a.totalViews).slice(0, 3);
  const topAffiliate = [...performance].sort((a, b) => b.affiliateClicks - a.affiliateClicks).slice(0, 3);

  // Category aggregations
  const categoryStats = performance.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { views: 0, clicks: 0, affClicks: 0 };
    }
    acc[curr.category].views += curr.totalViews;
    acc[curr.category].clicks += curr.productClicks;
    acc[curr.category].affClicks += curr.affiliateClicks;
    return acc;
  }, {} as Record<string, { views: number; clicks: number; affClicks: number }>);

  const sortedCategories = Object.entries(categoryStats).sort(
    (a, b) => b[1].affClicks - a[1].affClicks || b[1].views - a[1].views
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Date Filters */}
      <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-nexora-charcoal">
            Analytics &amp; Visitor Tracking
          </h2>
          <p className="text-xs text-nexora-muted mt-0.5">
            Privacy-conscious anonymous tracking. Real-time aggregated visitor sessions &amp; Meesho referral events.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-nexora-warmWhite p-1 rounded-xl border border-nexora-border/70 self-start sm:self-auto">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'all', label: 'All Time' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setDateFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                dateFilter === item.id
                  ? 'bg-nexora-primary text-white shadow-sm'
                  : 'text-nexora-muted hover:text-black hover:bg-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={loadAnalytics}
            className="p-1.5 text-nexora-muted hover:text-black ml-1 rounded-md"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 md:gap-4">
        {/* Total Visits */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-nexora-muted">Total Visits</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.totalVisits ?? 0}
          </div>
          <p className="text-[10px] text-nexora-muted mt-1">
            Distinct 30-min browsing sessions
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-nexora-muted">Unique Visitors</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.uniqueVisitors ?? 0}
          </div>
          <p className="text-[10px] text-nexora-muted mt-1">
            Distinct anonymous client devices
          </p>
        </div>

        {/* Product Views */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-nexora-muted">Product Views</span>
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.totalProductViews ?? 0}
          </div>
          <p className="text-[10px] text-nexora-muted mt-1">
            Product detail views loaded
          </p>
        </div>

        {/* Product Clicks */}
        <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-nexora-muted">Card Clicks</span>
            <MousePointerClick className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-nexora-charcoal">
            {isLoading ? '...' : summary?.totalProductClicks ?? 0}
          </div>
          <p className="text-[10px] text-nexora-muted mt-1">
            Catalog card impressions clicked
          </p>
        </div>

        {/* Affiliate Clicks */}
        <div className="bg-white p-4 rounded-xl border border-pink-200 shadow-sm bg-gradient-to-br from-white to-pink-50/30">
          <div className="flex items-center justify-between text-pink-600 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-pink-700">Meesho Clicks</span>
            <ExternalLink className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-pink-600">
            {isLoading ? '...' : summary?.totalAffiliateClicks ?? 0}
          </div>
          <p className="text-[10px] text-pink-600/80 mt-1">
            CTR: {summary?.clickThroughRate ?? 0}%
          </p>
        </div>
      </div>

      {/* Highlights & Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Outbound Affiliate Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-nexora-border">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-base font-bold text-nexora-charcoal">
              Top Affiliate Performers (Meesho Redirects)
            </h3>
          </div>
          <div className="space-y-3">
            {topAffiliate.map((p, idx) => (
              <div key={p.productId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-nexora-warmWhite font-bold text-[10px] flex items-center justify-center text-nexora-charcoal">
                    {idx + 1}
                  </span>
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100'}
                    alt={p.productName}
                    className="w-8 h-10 object-cover rounded border border-nexora-border"
                  />
                  <div>
                    <span className="font-medium text-nexora-charcoal block line-clamp-1">
                      {p.productName}
                    </span>
                    <span className="text-[10px] text-nexora-muted">
                      {p.category} &bull; {formatCurrency(p.price)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-pink-600 block">
                    {p.affiliateClicks} clicks
                  </span>
                  <span className="text-[10px] text-nexora-muted">
                    {p.conversionRate}% conv.
                  </span>
                </div>
              </div>
            ))}
            {topAffiliate.length === 0 && (
              <p className="text-xs text-nexora-muted italic">No affiliate clicks recorded in this range.</p>
            )}
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-nexora-border">
            <Eye className="w-4 h-4 text-blue-500" />
            <h3 className="font-serif text-base font-bold text-nexora-charcoal">
              Most Viewed Products
            </h3>
          </div>
          <div className="space-y-3">
            {topViewed.map((p, idx) => (
              <div key={p.productId} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-nexora-warmWhite font-bold text-[10px] flex items-center justify-center text-nexora-charcoal">
                    {idx + 1}
                  </span>
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100'}
                    alt={p.productName}
                    className="w-8 h-10 object-cover rounded border border-nexora-border"
                  />
                  <div>
                    <span className="font-medium text-nexora-charcoal block line-clamp-1">
                      {p.productName}
                    </span>
                    <span className="text-[10px] text-nexora-muted">
                      {p.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-nexora-charcoal block">
                    {p.totalViews} views
                  </span>
                  <span className="text-[10px] text-nexora-muted">
                    {p.uniqueVisitors} unique visitors
                  </span>
                </div>
              </div>
            ))}
            {topViewed.length === 0 && (
              <p className="text-xs text-nexora-muted italic">No product views recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm">
        <h3 className="font-serif text-base font-bold text-nexora-charcoal mb-3">
          Category Performance Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sortedCategories.slice(0, 8).map(([cat, stats]) => (
            <div key={cat} className="p-3 bg-nexora-warmWhite rounded-xl border border-nexora-border/60">
              <span className="font-semibold text-xs text-nexora-charcoal block truncate">
                {cat}
              </span>
              <div className="flex items-baseline justify-between mt-2 text-[11px]">
                <span className="text-nexora-muted">{stats.views} Views</span>
                <span className="font-bold text-pink-600">{stats.affClicks} Clicks</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Product Performance Table */}
      <div className="bg-white rounded-2xl border border-nexora-border/70 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-nexora-border">
          <h3 className="font-serif text-base font-bold text-nexora-charcoal">
            Product Performance Table
          </h3>
          <p className="text-xs text-nexora-muted mt-0.5">
            Aggregated metrics per product. High views with high Meesho clicks indicates top affiliate conversion.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexora-warmWhite text-nexora-muted uppercase tracking-wider text-[10px] border-b border-nexora-border">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Total Views</th>
                <th className="py-3 px-4 text-center">Unique Visitors</th>
                <th className="py-3 px-4 text-center">Card Clicks</th>
                <th className="py-3 px-4 text-center text-pink-600">Meesho Clicks</th>
                <th className="py-3 px-4 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexora-border/50">
              {performance.map((item) => (
                <tr key={item.productId} className="hover:bg-nexora-warmWhite/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100'}
                        alt={item.productName}
                        className="w-8 h-10 object-cover object-top rounded border border-nexora-border"
                      />
                      <span className="font-semibold text-nexora-charcoal block line-clamp-1 max-w-xs">
                        {item.productName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-nexora-charcoal">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {item.totalViews}
                  </td>
                  <td className="py-3 px-4 text-center text-nexora-muted">
                    {item.uniqueVisitors}
                  </td>
                  <td className="py-3 px-4 text-center text-nexora-muted">
                    {item.productClicks}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-pink-600">
                    {item.affiliateClicks}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-nexora-charcoal">
                      {item.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy & Metric Definitions Footer */}
      <div className="p-4 bg-nexora-warmWhite rounded-xl border border-nexora-border/70 flex items-start gap-3 text-xs text-nexora-muted">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-nexora-charcoal">
            Privacy-Preserving Visitor Architecture
          </p>
          <p className="text-[11px] leading-relaxed">
            Nexora Collection uses anonymous randomly generated browser tokens. No IP addresses, device fingerprinting, or personally identifiable information is stored. Admin actions are excluded automatically from tracking. Actual purchases and commissions are calculated and settled separately within your official Meesho Affiliate Portal.
          </p>
        </div>
      </div>
    </div>
  );
};
