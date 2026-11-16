export type Gender = 'men' | 'women' | 'couples' | 'unisex';

export type ProductCategory = 
  | 'Shirts'
  | 'T-Shirts'
  | 'Dresses'
  | 'Kurtis'
  | 'Ethnic Wear'
  | 'Jeans & Trousers'
  | 'Jackets & Coats'
  | 'Footwear'
  | 'Accessories'
  | 'Bags'
  | 'Jewelry'
  | 'Casual Wear'
  | 'Office Wear'
  | 'Party Wear';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  category: string;
  gender: Gender;
  images: string[];
  affiliate_url: string;
  featured: boolean;
  trending: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilterOptions {
  category?: string;
  gender?: Gender | 'all';
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  trending?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}
