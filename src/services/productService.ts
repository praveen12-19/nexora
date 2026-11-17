import { supabase, isSupabaseConfigured } from './supabase';
import { Product, ProductFilterOptions } from '../types/product';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

const LOCAL_STORAGE_PRODUCTS_KEY = 'nexora_catalog_v2';

// Helper to determine next sequential integer ID starting from 1
function getNextSequentialId(products: Product[]): string {
  let maxId = 0;
  for (const p of products) {
    const num = parseInt(String(p.id), 10);
    if (!isNaN(num) && num > maxId) {
      maxId = num;
    }
  }
  return String(maxId + 1);
}

// Helper to get local stored products (used as local cache / fallback)
function getStoredProducts(): Product[] {
  try {
    // Clear legacy initial cache if present
    localStorage.removeItem('nexora_local_products');

    const data = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (data) {
      let products: Product[] = JSON.parse(data);
      // Auto-migrate any legacy non-numeric UUIDs into sequential IDs starting from 1
      let hasLegacyId = false;
      for (const p of products) {
        if (!/^\d+$/.test(String(p.id))) {
          hasLegacyId = true;
          break;
        }
      }

      if (hasLegacyId && products.length > 0) {
        // Sort chronologically ascending to preserve order
        const sorted = [...products].sort(
          (a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        );
        sorted.forEach((p, index) => {
          p.id = String(index + 1);
        });
        saveStoredProducts(sorted);
        return sorted;
      }

      return products;
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
          // If Supabase returned items, return them formatted
          if (data.length > 0) {
            return data.map((item) => ({
              ...item,
              images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
            }));
          }

          // If Supabase returned 0 items, check if local browser storage has items from previous offline adds
          const localItems = getStoredProducts();
          if (localItems.length > 0) {
            // Trigger automatic sync to Supabase in the background
            this.syncLocalProductsToSupabase().catch(console.error);
            return localItems.filter((p) => isAdmin || p.active);
          }

          return [];
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
    const localList = getStoredProducts();
    const nextId = getNextSequentialId(localList);

    const newProduct: Product = {
      ...productData,
      id: nextId,
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
          console.warn('Supabase createProduct failed, saving to local catalog fallback:', error);
        } else if (data) {
          return {
            ...data,
            id: String(data.id),
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
          };
        }
      } catch (err) {
        console.warn('Supabase error creating product, saving to local catalog fallback:', err);
      }
    }

    // Local fallback persistence
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

        if (error) {
          console.warn('Supabase updateProduct failed, updating local catalog fallback:', error);
        } else if (data) {
          return {
            ...data,
            images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
          };
        }
      } catch (err) {
        console.warn('Supabase error updating product, updating local catalog fallback:', err);
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
        if (error) {
          console.warn('Supabase deleteProduct failed, deleting from local catalog fallback:', error);
        } else {
          return true;
        }
      } catch (err) {
        console.warn('Supabase error deleting product, deleting from local catalog fallback:', err);
      }
    }

    // Local fallback
    const localList = getStoredProducts();
    const filtered = localList.filter((p) => p.id !== id);
    saveStoredProducts(filtered);
    return true;
  },

  /**
   * Automatically migrate and synchronize products from local browser storage to Supabase.
   * This ensures that any products added offline or before database setup are pushed to the cloud,
   * so every visitor (from Instagram, mobile, laptop) can immediately see them.
   */
  async syncLocalProductsToSupabase(): Promise<number> {
    if (!isSupabaseConfigured()) return 0;

    try {
      // 1. Get current products in Supabase
      const { data: dbProducts, error } = await supabase.from('products').select('*');
      if (error) {
        console.warn('Could not query Supabase for sync:', error);
        return 0;
      }

      // 2. Get local products
      const localProducts = getStoredProducts();
      if (!localProducts || localProducts.length === 0) return 0;

      const existingNames = new Set((dbProducts || []).map((p) => p.name.trim().toLowerCase()));

      let syncedCount = 0;
      for (const localP of localProducts) {
        // If not already in Supabase by name
        if (!existingNames.has(localP.name.trim().toLowerCase())) {
          const { data: inserted, error: insertErr } = await supabase.from('products').insert({
            name: localP.name,
            description: localP.description || '',
            price: localP.price || 0,
            original_price: localP.original_price || null,
            category: localP.category,
            gender: localP.gender,
            images: localP.images,
            affiliate_url: localP.affiliate_url,
            featured: Boolean(localP.featured),
            trending: Boolean(localP.trending),
            active: localP.active !== false,
          }).select().single();

          if (!insertErr && inserted) {
            existingNames.add(localP.name.trim().toLowerCase());
            syncedCount++;
          } else {
            console.warn('Failed to sync product to Supabase:', insertErr);
          }
        }
      }

      if (syncedCount > 0) {
        console.log(`Successfully synced ${syncedCount} products to Supabase cloud database!`);
      }
      return syncedCount;
    } catch (err) {
      console.error('Error during auto-sync to Supabase:', err);
      return 0;
    }
  },
};
