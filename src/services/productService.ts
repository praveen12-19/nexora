import { supabase, isSupabaseConfigured } from './supabase';
import { Product, ProductFilterOptions } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_STORAGE_PRODUCTS_KEY = 'nexora_catalog_v2';

// Helper to get local stored products (used as local cache / fallback)
function getStoredProducts(): Product[] {
  try {
    // Clear legacy initial cache if present
    localStorage.removeItem('nexora_local_products');

    const data = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read local products:', err);
  }
  // Initialize with initial curated products (empty by default)
  localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save local products:', err);
  }
}

export const productService = {
  /**
   * Fetch all active products for the public website.
   * If isAdmin=true, also returns inactive products.
   */
  async getProducts(options: ProductFilterOptions = {}, isAdmin = false): Promise<Product[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('products').select('*');

        if (!isAdmin) {
          query = query.eq('active', true);
        }

        if (options.category && options.category !== 'All') {
          query = query.eq('category', options.category);
        }

        if (options.gender && options.gender !== 'all') {
          query = query.eq('gender', options.gender);
        }

        if (options.featured) {
          query = query.eq('featured', true);
        }

        if (options.trending) {
          query = query.eq('trending', true);
        }

        if (options.minPrice !== undefined) {
          query = query.gte('price', options.minPrice);
        }

        if (options.maxPrice !== undefined) {
          query = query.lte('price', options.maxPrice);
        }

        if (options.search && options.search.trim()) {
          query = query.ilike('name', `%${options.search.trim()}%`);
        }

        if (options.sortBy === 'price-asc') {
          query = query.order('price', { ascending: true });
        } else if (options.sortBy === 'price-desc') {
          query = query.order('price', { ascending: false });
        } else {
          // Default newest
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map((item) => ({
            ...item,
            images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
          }));
        }
        console.warn('Supabase fetch failed, falling back to local dataset:', error);
      } catch (err) {
        console.warn('Supabase error, using local fallback:', err);
      }
    }

    // Local / Offline fallback
    let list = getStoredProducts();

    if (!isAdmin) {
      list = list.filter((p) => p.active);
    }

    if (options.category && options.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options.gender && options.gender !== 'all') {
      list = list.filter((p) => p.gender === options.gender);
    }

    if (options.featured) {
      list = list.filter((p) => p.featured);
    }

    if (options.trending) {
      list = list.filter((p) => p.trending);
    }

    if (options.minPrice !== undefined) {
      list = list.filter((p) => p.price >= options.minPrice!);
    }

    if (options.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= options.maxPrice!);
    }

    if (options.search && options.search.trim()) {
      const term = options.search.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }

    if (options.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (options.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    }

    return list;
  },

  /**
   * Get a single product by ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (!error && data) {
          return {
            ...data,
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
          };
        }
      } catch (err) {
        console.warn('Supabase product by id error, falling back:', err);
      }
    }

    const localList = getStoredProducts();
    return localList.find((p) => p.id === id) || null;
  },

  /**
   * Get related products based on category and gender.
   */
  async getRelatedProducts(currentProduct: Product, limit = 4): Promise<Product[]> {
    const all = await this.getProducts({
      gender: currentProduct.gender,
    });
    return all
      .filter((p) => p.id !== currentProduct.id)
      .slice(0, limit);
  },

  /**
   * Create a new product.
   */
  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('products').insert({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          original_price: newProduct.original_price,
          category: newProduct.category,
          gender: newProduct.gender,
          images: newProduct.images,
          affiliate_url: newProduct.affiliate_url,
          featured: newProduct.featured,
          trending: newProduct.trending,
          active: newProduct.active,
        }).select().single();

        if (error) {
          console.error('Supabase createProduct failed:', error);
          throw error;
        }

        if (data) {
          return {
            ...data,
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
          };
        }
      } catch (err) {
        console.error('Supabase error creating product:', err);
        throw err;
      }
    }

    // Local fallback persistence
    const localList = getStoredProducts();
    localList.unshift(newProduct);
    saveStoredProducts(localList);
    return newProduct;
  },

  /**
   * Update an existing product.
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const updatedTimestamp = new Date().toISOString();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({
            ...updates,
            updated_at: updatedTimestamp,
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          return {
            ...data,
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
          };
        }
      } catch (err) {
        console.error('Supabase error updating product:', err);
        throw err;
      }
    }

    // Local fallback update
    const localList = getStoredProducts();
    const index = localList.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    localList[index] = {
      ...localList[index],
      ...updates,
      updated_at: updatedTimestamp,
    };
    saveStoredProducts(localList);
    return localList[index];
  },

  /**
   * Delete a product.
   */
  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase error deleting product:', err);
        throw err;
      }
    }

    // Local fallback
    const localList = getStoredProducts();
    const filtered = localList.filter((p) => p.id !== id);
    saveStoredProducts(filtered);
    return true;
  },
};
