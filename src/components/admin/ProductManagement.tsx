import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Copy,
  MousePointerClick,
  ExternalLink,
  ShoppingBag,
  CloudUpload
} from 'lucide-react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrency } from '../../utils/currency';
import { ProductForm } from './ProductForm';

interface ProductManagementProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
  openAddModalInitially?: boolean;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  onNotify,
  openAddModalInitially = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(openAddModalInitially);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Helper to get clean sequential display ID starting from 1
  const getProductDisplayId = (product: Product): string => {
    if (/^\d+$/.test(String(product.id))) {
      return product.id;
    }
    const sorted = [...products].sort(
      (a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
    );
    const index = sorted.findIndex((item) => item.id === product.id);
    return index >= 0 ? String(index + 1) : '1';
  };

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Auto-sync any products trapped in this browser's local storage to Supabase Cloud Database
      const synced = await productService.syncLocalProductsToSupabase();
      if (synced > 0) {
        onNotify(`Successfully synced ${synced} product(s) to Supabase Cloud Database!`, 'success');
      }

      const [data, counts] = await Promise.all([
        productService.getProducts({}, true), // isAdmin = true
        analyticsService.getAffiliateClickCounts(),
      ]);
      setProducts(data);
      setClickCounts(counts);
    } catch (err: any) {
      onNotify('Failed to fetch products: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const synced = await productService.syncLocalProductsToSupabase();
      if (synced > 0) {
        onNotify(`Successfully synced ${synced} product(s) to Supabase Cloud Database!`, 'success');
      } else {
        onNotify('All products are synced and live in the Cloud Database!', 'success');
      }
      await loadProducts();
    } catch (err: any) {
      onNotify('Sync error: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        onNotify('Product updated successfully.', 'success');
      } else {
        await productService.createProduct(productData);
        onNotify('New product created and live in catalog.', 'success');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (err: any) {
      onNotify('Error saving product: ' + err.message, 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete.id);
      onNotify(`"${productToDelete.name}" deleted from catalog.`, 'success');
      setProductToDelete(null);
      await loadProducts();
    } catch (err: any) {
      onNotify('Failed to delete product: ' + err.message, 'error');
    }
  };

  // Filter products locally for instant response
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      p.description.toLowerCase().includes(search.toLowerCase().trim()) ||
      p.id.toLowerCase().includes(search.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesGender =
      selectedGender === 'All' ||
      p.gender === selectedGender ||
      (selectedGender === 'couples' && (p.gender === 'couples' || p.gender === 'unisex'));

    return matchesSearch && matchesCategory && matchesGender;
  });

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-nexora-border/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-nexora-charcoal">
            Product Management
          </h2>
          <p className="text-xs text-nexora-muted mt-0.5 leading-relaxed">
            Add new products, update details, monitor Meesho affiliate clicks, and manage catalog items.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer touch-manipulation"
            title="Upload any products in this browser to Supabase Cloud Database"
          >
            <CloudUpload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sync to Cloud</span>
          </button>
          <button
            type="button"
            onClick={loadProducts}
            disabled={isLoading}
            className="p-2.5 rounded-lg border border-nexora-border text-nexora-charcoal hover:bg-nexora-warmWhite transition-colors shrink-0 cursor-pointer touch-manipulation"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-nexora-primary hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer touch-manipulation"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="w-4 h-4 text-nexora-muted absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or ID..."
            className="w-full pl-9 pr-3.5 py-2 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs focus:outline-none focus:border-nexora-primary focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-xs text-nexora-muted shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs text-nexora-charcoal focus:outline-none shrink-0"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs text-nexora-charcoal focus:outline-none shrink-0"
          >
            <option value="All">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="couples">Couples</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-nexora-border/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-nexora-warmWhite text-nexora-muted uppercase tracking-wider text-[10px] border-b border-nexora-border">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Product ID</th>
                <th className="py-3.5 px-4 font-semibold">Product Name</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-center">Link Click Count</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexora-border/50">
              {filteredProducts.map((p) => {
                const count = clickCounts[p.id] || 0;
                return (
                  <tr key={p.id} className="hover:bg-nexora-warmWhite/40 transition-colors">
                    {/* 1. Product ID */}
                    <td className="py-3.5 px-4">
                      {(() => {
                        const displayId = getProductDisplayId(p);
                        return (
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="font-mono text-xs font-bold text-nexora-charcoal bg-nexora-warmWhite px-2.5 py-1 rounded border border-nexora-border select-all min-w-[32px] text-center"
                              title={`Product #${displayId}`}
                            >
                              #{displayId}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(displayId);
                                onNotify(`Product ID #${displayId} copied to clipboard`, 'success');
                              }}
                              className="p-1 text-neutral-400 hover:text-nexora-charcoal hover:bg-nexora-beige rounded transition-colors cursor-pointer"
                              title="Copy Product ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })()}
                    </td>

                    {/* 2. Product Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200'}
                          alt={p.name}
                          className="w-12 h-14 object-cover object-top rounded-lg border border-nexora-border shrink-0 shadow-xs"
                        />
                        <div className="max-w-xs sm:max-w-md">
                          <span className="font-semibold text-nexora-charcoal block text-xs line-clamp-1">
                            {p.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-nexora-muted">
                            {p.price > 0 && (
                              <span className="font-semibold text-nexora-charcoal">{formatCurrency(p.price)}</span>
                            )}
                            {p.active ? (
                              <span className="inline-flex items-center text-emerald-600 font-medium">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-neutral-400 font-medium">
                                Hidden
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 bg-nexora-warmWhite border border-nexora-border/80 rounded-full text-xs font-medium text-nexora-charcoal">
                        {p.category}
                      </span>
                    </td>

                    {/* 4. Link Click Count */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-pink-700 font-bold text-xs shadow-xs" title={`${count} Meesho affiliate clicks recorded for this product`}>
                        <MousePointerClick className="w-3.5 h-3.5 text-pink-600" />
                        <span>{count}</span>
                        <span className="text-[10px] font-normal text-pink-600/80 font-sans">clicks</span>
                        {p.affiliate_url && (
                          <a
                            href={p.affiliate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-pink-400 hover:text-pink-600 transition-colors"
                            title="Open Meesho link in new tab"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* 5. Actions (Edit & Delete) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-nexora-charcoal hover:text-black hover:bg-nexora-warmWhite border border-transparent hover:border-nexora-border rounded-lg transition-all"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 px-4">
              <ShoppingBag className="w-10 h-10 text-nexora-muted/40 mx-auto mb-3" />
              <p className="text-xs font-semibold text-nexora-charcoal">No products found</p>
              <p className="text-[11px] text-nexora-muted mt-0.5">
                {products.length === 0 
                  ? 'Your catalog is currently empty. Click "Add New Product" to add your first fashion piece.' 
                  : 'No products match your search or filter criteria.'}
              </p>
              {products.length === 0 && (
                <button
                  onClick={handleOpenAdd}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-nexora-primary hover:bg-black text-white text-xs font-bold rounded-lg transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Product</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal (Add / Edit) */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          isLoading={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-nexora-border space-y-4 animate-slide-up">
            <h3 className="font-serif text-lg font-bold text-nexora-charcoal">
              Delete Product?
            </h3>
            <p className="text-xs text-nexora-muted leading-relaxed">
              Are you sure you want to delete &quot;{productToDelete.name}&quot;? This product will be permanently removed from the catalog.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-nexora-muted hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
