export type AnalyticsEventType = 
  | 'page_view'
  | 'product_view'
  | 'product_click'
  | 'affiliate_click';

export interface AnalyticsEvent {
  id?: string;
  visitor_id: string;
  session_id: string;
  product_id?: string | null;
  event_type: AnalyticsEventType;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface VisitorSession {
  id: string;
  visitor_id: string;
  created_at?: string;
  last_activity_at?: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalProductViews: number;
  totalProductClicks: number;
  totalAffiliateClicks: number;
  clickThroughRate: number; // Affiliate clicks / product views
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  category: string;
  gender: string;
  price: number;
  imageUrl?: string;
  totalViews: number;
  uniqueVisitors: number;
  productClicks: number;
  affiliateClicks: number;
  conversionRate: number; // affiliate clicks / views %
}

export type AnalyticsDateFilter = 'today' | '7days' | '30days' | 'all';
