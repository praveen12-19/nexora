import { supabase, isSupabaseConfigured } from './supabase';
import { 
  AnalyticsEvent, 
  AnalyticsEventType, 
  AnalyticsSummary, 
  ProductPerformance, 
  AnalyticsDateFilter 
} from '../types/analytics';
import { getVisitorId } from '../utils/visitorId';
import { getOrCreateSession, updateSessionActivity } from '../utils/sessionTracking';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_ANALYTICS_EVENTS_KEY = 'nexora_analytics_events';
const LOCAL_CLICK_COUNTS_KEY = 'nexora_affiliate_clicks';
const CLEARED_AT_KEY = 'nexora_analytics_cleared_at';
const ADMIN_SESSION_KEY = 'nexora_admin_user';

// Check if currently acting as admin to exclude from analytics
function isAdminActive(): boolean {
  try {
    return Boolean(localStorage.getItem(ADMIN_SESSION_KEY));
  } catch (err) {
    return false;
  }
}

function getClearedAtTime(): number {
  try {
    const raw = localStorage.getItem(CLEARED_AT_KEY);
    if (raw) return new Date(raw).getTime();
  } catch {}
  return 0;
}

function getStoredClickCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LOCAL_CLICK_COUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse local click counts:', err);
  }
  return {};
}

function incrementStoredClickCount(productId: string): void {
  try {
    const counts = getStoredClickCounts();
    counts[productId] = (counts[productId] || 0) + 1;
    localStorage.setItem(LOCAL_CLICK_COUNTS_KEY, JSON.stringify(counts));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nexora_affiliate_click_updated'));
    }
  } catch (err) {
    console.warn('Failed to save local click count:', err);
  }
}

function getStoredEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_ANALYTICS_EVENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read local events:', err);
  }
  return [];
}

function saveStoredEvents(events: AnalyticsEvent[]): void {
  try {
    // Keep last 10,000 events locally to avoid storage limits
    const trimmed = events.slice(-10000);
    localStorage.setItem(LOCAL_ANALYTICS_EVENTS_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save local events:', err);
  }
}

function getFilterDate(filter: AnalyticsDateFilter): Date {
  const now = new Date();
  switch (filter) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case '7days':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'all':
    default:
      return new Date(0);
  }
}

export const analyticsService = {
  /**
   * Track an analytics event.
   * Excludes background page/product browsing from admin, but always tracks
   * affiliate link clicks so testing and click verification works reliably.
   */
  async trackEvent(eventType: AnalyticsEventType, productId?: string | null): Promise<void> {
    // 1. Immediately record fast local affiliate click count so UI updates instantly
    if (eventType === 'affiliate_click' && productId) {
      incrementStoredClickCount(productId);
    }

    // Exclude admin from background page/product browsing metrics, but never block affiliate clicks
    if (isAdminActive() && eventType !== 'affiliate_click') {
      return;
    }

    const visitorId = getVisitorId();
    const { sessionId } = getOrCreateSession();
    updateSessionActivity();

    const event: AnalyticsEvent = {
      visitor_id: visitorId,
      session_id: sessionId,
      product_id: productId || null,
      event_type: eventType,
      created_at: new Date().toISOString(),
    };

    // 2. Send to Supabase Edge Function or Table if configured
    if (isSupabaseConfigured()) {
      try {
        // Try Edge Function first if deployed
        const { error: fnError } = await supabase.functions.invoke('track-event', {
          body: event,
        });

        if (!fnError) {
          // Edge function succeeded
          const list = getStoredEvents();
          list.push(event);
          saveStoredEvents(list);
          return;
        }

        // Direct table insert with anon key
        const payload: Record<string, any> = {
          visitor_id: visitorId,
          session_id: sessionId,
          event_type: eventType,
        };

        if (productId) {
          payload.product_id = productId;
        }

        const { error: insertError } = await supabase.from('analytics_events').insert(payload);

        if (!insertError) {
          // Direct insert succeeded
          const list = getStoredEvents();
          list.push(event);
          saveStoredEvents(list);
          return;
        }

        console.warn('Supabase analytics insert failed, will persist locally:', insertError);

        // If insert failed because of product_id type mismatch (e.g. invalid UUID syntax),
        // try inserting with product_id: null so the session/event is still recorded in Supabase,
        // while the exact product_id click is recorded locally!
        if (payload.product_id) {
          try {
            await supabase.from('analytics_events').insert({
              visitor_id: visitorId,
              session_id: sessionId,
              event_type: eventType,
              product_id: null,
            });
          } catch {}
        }
      } catch (err) {
        // Edge function or database insertion failed, store locally
        console.warn('Analytics network log failed, logging locally:', err);
      }
    }

    // 3. Local fallback storage
    const list = getStoredEvents();
    list.push(event);
    saveStoredEvents(list);
  },

  /**
   * Clear today's live activity counts (visits, visitors, views, and clicks) to 0.
   * Useful for administrators analyzing traffic over custom time periods.
   */
  clearTodayCounts(): void {
    try {
      localStorage.setItem(CLEARED_AT_KEY, new Date().toISOString());
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('nexora_affiliate_click_updated'));
      }
    } catch (err) {
      console.warn('Failed to clear today counts:', err);
    }
  },

  /**
   * Get aggregated summary for the Admin Analytics Dashboard.
   * When filter === 'today', strictly computes 24-hr metrics that reset at EOD (midnight),
   * and respects manual clear timestamps.
   */
  async getSummary(filter: AnalyticsDateFilter = 'all'): Promise<AnalyticsSummary> {
    const baseTime = getFilterDate(filter).getTime();
    let filterTime = baseTime;

    // For 'today', if the user clicked "Clear Count" today, only count events after that timestamp
    if (filter === 'today') {
      const clearedAt = getClearedAtTime();
      if (clearedAt > baseTime) {
        filterTime = clearedAt;
      }
    }
    const filterStartDate = new Date(filterTime).toISOString();

    // 1. Try Supabase aggregation RPC or direct query
    if (isSupabaseConfigured()) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_analytics_summary', {
          p_start_time: filterStartDate,
          p_end_time: new Date().toISOString(),
        });

        if (!rpcError && rpcData && rpcData.length > 0) {
          const row = rpcData[0];
          const totalVisits = Number(row.total_visits || 0);
          const uniqueVisitors = Number(row.unique_visitors || 0);
          const totalProductViews = Number(row.total_product_views || 0);
          const totalProductClicks = Number(row.total_product_clicks || 0);
          const totalAffiliateClicks = Number(row.total_affiliate_clicks || 0);
          const clickThroughRate = totalProductViews > 0 
            ? Math.round((totalAffiliateClicks / totalProductViews) * 1000) / 10 
            : 0;

          return {
            totalVisits,
            uniqueVisitors,
            totalProductViews,
            totalProductClicks,
            totalAffiliateClicks,
            clickThroughRate,
          };
        }

        // Direct table query fallback if RPC is not installed in database
        const { data: tableData, error: tableError } = await supabase
          .from('analytics_events')
          .select('visitor_id, session_id, event_type, created_at')
          .gte('created_at', filterStartDate);

        if (!tableError && Array.isArray(tableData)) {
          const visitorSet = new Set<string>();
          const sessionSet = new Set<string>();
          let pViews = 0;
          let pClicks = 0;
          let aClicks = 0;

          for (const row of tableData) {
            if (row.visitor_id) visitorSet.add(row.visitor_id);
            if (row.session_id) sessionSet.add(row.session_id);
            if (row.event_type === 'product_view') pViews++;
            if (row.event_type === 'product_click') pClicks++;
            if (row.event_type === 'affiliate_click') aClicks++;
          }

          // Merge any events saved locally for this timeframe
          const localEvents = getStoredEvents().filter(
            (e) => new Date(e.created_at || '').getTime() >= filterTime
          );
          for (const e of localEvents) {
            if (e.visitor_id) visitorSet.add(e.visitor_id);
            if (e.session_id) sessionSet.add(e.session_id);
            if (e.event_type === 'product_view') pViews++;
            if (e.event_type === 'product_click') pClicks++;
            if (e.event_type === 'affiliate_click') aClicks++;
          }

          const ctr = pViews > 0 ? Math.round((aClicks / pViews) * 1000) / 10 : 0;
          return {
            totalVisits: sessionSet.size,
            uniqueVisitors: visitorSet.size,
            totalProductViews: pViews,
            totalProductClicks: pClicks,
            totalAffiliateClicks: aClicks,
            clickThroughRate: ctr,
          };
        }
      } catch (err) {
        console.warn('Supabase summary failed, computing from local:', err);
      }
    }

    // 2. Local computation fallback
    const events = getStoredEvents();
    const filteredEvents = events.filter((e) => new Date(e.created_at || '').getTime() >= filterTime);

    const uniqueVisitorSet = new Set<string>();
    const uniqueSessionSet = new Set<string>();
    let totalProductViews = 0;
    let totalProductClicks = 0;
    let totalAffiliateClicks = 0;

    for (const e of filteredEvents) {
      if (e.visitor_id) uniqueVisitorSet.add(e.visitor_id);
      if (e.session_id) uniqueSessionSet.add(e.session_id);

      if (e.event_type === 'product_view') totalProductViews++;
      if (e.event_type === 'product_click') totalProductClicks++;
      if (e.event_type === 'affiliate_click') totalAffiliateClicks++;
    }

    const clickThroughRate = totalProductViews > 0 
      ? Math.round((totalAffiliateClicks / totalProductViews) * 1000) / 10 
      : 0;

    return {
      totalVisits: uniqueSessionSet.size,
      uniqueVisitors: uniqueVisitorSet.size,
      totalProductViews,
      totalProductClicks,
      totalAffiliateClicks,
      clickThroughRate,
    };
  },

  /**
   * Get product performance table data.
   */
  async getProductPerformance(filter: AnalyticsDateFilter = 'all'): Promise<ProductPerformance[]> {
    const filterStartDate = getFilterDate(filter).toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('get_product_performance', {
          p_start_time: filterStartDate,
          p_end_time: new Date().toISOString(),
        });

        if (!error && data) {
          return data.map((item: any) => {
            const views = Number(item.total_views || 0);
            const affClicks = Number(item.affiliate_clicks || 0);
            const conversionRate = views > 0 ? Math.round((affClicks / views) * 1000) / 10 : 0;
            const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]');

            return {
              productId: item.product_id,
              productName: item.product_name,
              category: item.category,
              gender: item.gender,
              price: Number(item.price),
              imageUrl: images[0] || '',
              totalViews: views,
              uniqueVisitors: Number(item.unique_visitors || 0),
              productClicks: Number(item.product_clicks || 0),
              affiliateClicks: affClicks,
              conversionRate,
            };
          });
        }
      } catch (err) {
        console.warn('Supabase product performance RPC failed, computing local:', err);
      }
    }

    // Local computation
    const events = getStoredEvents();
    const filterTime = getFilterDate(filter).getTime();
    const filteredEvents = events.filter((e) => new Date(e.created_at || '').getTime() >= filterTime);

    // Get current products from catalog v2 or legacy storage
    const rawProducts = localStorage.getItem('nexora_catalog_v2') || localStorage.getItem('nexora_local_products');
    const products = rawProducts ? JSON.parse(rawProducts) : INITIAL_PRODUCTS;
    const fastClickCounts = getStoredClickCounts();

    const performanceMap = new Map<string, {
      totalViews: number;
      visitors: Set<string>;
      productClicks: number;
      affiliateClicks: number;
    }>();

    for (const p of products) {
      performanceMap.set(p.id, {
        totalViews: 0,
        visitors: new Set(),
        productClicks: 0,
        affiliateClicks: fastClickCounts[p.id] || 0,
      });
    }

    for (const e of filteredEvents) {
      if (!e.product_id || !performanceMap.has(e.product_id)) continue;
      const stats = performanceMap.get(e.product_id)!;

      if (e.event_type === 'product_view') {
        stats.totalViews++;
        stats.visitors.add(e.visitor_id);
      } else if (e.event_type === 'product_click') {
        stats.productClicks++;
      } else if (e.event_type === 'affiliate_click') {
        stats.affiliateClicks = Math.max(stats.affiliateClicks, (stats.affiliateClicks || 0) + 1);
      }
    }

    const result: ProductPerformance[] = [];
    for (const p of products) {
      const stats = performanceMap.get(p.id)!;
      const conversionRate = stats.totalViews > 0 
        ? Math.round((stats.affiliateClicks / stats.totalViews) * 1000) / 10 
        : 0;

      result.push({
        productId: p.id,
        productName: p.name,
        category: p.category,
        gender: p.gender,
        price: p.price,
        imageUrl: p.images[0] || '',
        totalViews: stats.totalViews,
        uniqueVisitors: stats.visitors.size,
        productClicks: stats.productClicks,
        affiliateClicks: stats.affiliateClicks,
        conversionRate,
      });
    }

    result.sort((a, b) => b.affiliateClicks - a.affiliateClicks || b.totalViews - a.totalViews);
    return result;
  },

  /**
   * Get affiliate click counts keyed by product ID: { [productId: string]: number }
   * Merges local instant click counts, local recorded events, and Supabase cloud events.
   */
  async getAffiliateClickCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    // 1. Load fast local click counts
    const localFastCounts = getStoredClickCounts();
    for (const [id, count] of Object.entries(localFastCounts)) {
      counts[id] = count;
    }

    // 2. Scan local stored events
    const events = getStoredEvents();
    const eventCounts: Record<string, number> = {};
    for (const e of events) {
      if (e.product_id && e.event_type === 'affiliate_click') {
        eventCounts[e.product_id] = (eventCounts[e.product_id] || 0) + 1;
      }
    }
    for (const [id, count] of Object.entries(eventCounts)) {
      counts[id] = Math.max(counts[id] || 0, count);
    }

    // 3. If Supabase is configured, fetch cloud click counts and merge
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('analytics_events')
          .select('product_id')
          .eq('event_type', 'affiliate_click');

        if (!error && Array.isArray(data)) {
          const cloudCounts: Record<string, number> = {};
          for (const row of data) {
            if (row.product_id) {
              const pId = String(row.product_id);
              cloudCounts[pId] = (cloudCounts[pId] || 0) + 1;
            }
          }
          // Merge: ensure counts reflect both cloud and local clicks
          for (const [id, count] of Object.entries(cloudCounts)) {
            counts[id] = Math.max(counts[id] || 0, count);
          }
        } else if (error) {
          console.warn('Supabase affiliate click counts query warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase affiliate click counts query failed, using local fallback:', err);
      }
    }

    return counts;
  },
};
