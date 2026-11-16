import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  X, 
  Sparkles, 
  TrendingUp, 
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { Product, Gender } from '../types/product';
import { productService } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { useWishlist } from '../hooks/useWishlist';

const CATEGORIES = [
  'All',
  'Shirts',
  'T-Shirts',
  'Dresses',
  'Kurtis',
  'Ethnic Wear',
  'Office Wear',
  'Casual Wear',
  'Party Wear',
  'Accessories',
  'Jewelry',
  'Bags',
];

interface ShopProps {
  defaultGender?: Gender | 'all';
}

export const Shop: React.FC<ShopProps> = ({ defaultGender }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { wishlist, toggleWishlist } = useWishlist();

  // Automatic redirect if accessed via query string to keep URL clean and active links accurate
  useEffect(() => {
    if (location.pathname === '/shop') {
      const g = searchParams.get('gender');
      if (g === 'men') {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('gender');
        const qs = nextParams.toString() ? `?${nextParams.toString()}` : '';
        navigate(`/men${qs}`, { replace: true });
      } else if (g === 'women') {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('gender');
        const qs = nextParams.toString() ? `?${nextParams.toString()}` : '';
        navigate(`/women${qs}`, { replace: true });
      }
    }
  }, [location.pathname, searchParams, navigate]);

  // Route-based gender resolution
  const routeGender: Gender | undefined =
    location.pathname === '/men'
      ? 'men'
      : location.pathname === '/women'
      ? 'women'
      : undefined;

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedGender: Gender | 'all' =
    routeGender ||
    (searchParams.get('gender') as Gender | 'all') ||
    defaultGender ||
    'all';
  const sortBy = (searchParams.get('sortBy') as 'newest' | 'price-asc' | 'price-desc') || 'newest';
  const onlyFeatured = searchParams.get('featured') === 'true';
  const onlyTrending = searchParams.get('trending') === 'true';

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const list = await productService.getProducts({
          search: searchQuery,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          gender: selectedGender === 'all' ? undefined : selectedGender,
          sortBy,
          featured: onlyFeatured ? true : undefined,
          trending: onlyTrending ? true : undefined,
        });
        setProducts(list);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [searchQuery, selectedCategory, selectedGender, sortBy, onlyFeatured, onlyTrending]);

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'all' || value === 'false') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleGenderChange = (g: Gender | 'all') => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('gender');
    const queryString = newParams.toString() ? `?${newParams.toString()}` : '';

    if (g === 'men') {
      navigate(`/men${queryString}`);
    } else if (g === 'women') {
      navigate(`/women${queryString}`);
    } else {
      navigate(`/shop${queryString}`);
    }
  };

  const resetAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const wishlistIds = new Set(wishlist.map((p) => p.id));
  const hasActiveFilters = Boolean(
    searchQuery ||
    (selectedCategory && selectedCategory !== 'All') ||
    (selectedGender && selectedGender !== 'all') ||
    onlyFeatured ||
    onlyTrending ||
    sortBy !== 'newest'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] uppercase tracking-widest text-nexora-muted font-bold block">
          Curated Discovery
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-nexora-charcoal">
          {selectedGender === 'men'
            ? "Men's Fashion"
            : selectedGender === 'women'
            ? "Women's Fashion"
            : "Fashion Catalog"}
        </h1>
        <p className="text-xs md:text-sm text-nexora-muted leading-relaxed">
          {selectedGender === 'men'
            ? 'Affordable and trending shirts, kurtas, blazers, and celebration wear for men.'
            : selectedGender === 'women'
            ? 'Affordable and trending kurtis, anarkalis, dresses, and celebration wear for women.'
            : 'Explore our complete fashion edit. Click through any item to buy securely on Meesho.'}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-nexora-border/70 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-nexora-muted absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search dresses, linen, kurtis..."
            className="w-full pl-9 pr-3.5 py-2 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs focus:outline-none focus:border-nexora-primary focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => updateParam('search', null)}
              className="absolute right-3 top-3 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Quick Pills & Sort */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Gender Pills */}
          <div className="flex items-center gap-1 bg-nexora-warmWhite p-1 rounded-lg border border-nexora-border text-xs">
            {(['all', 'men', 'women'] as const).map((g) => (
              <button
                key={g}
                onClick={() => handleGenderChange(g)}
                className={`px-3 py-1 rounded-md capitalize font-semibold transition-all ${
                  selectedGender === g
                    ? 'bg-nexora-primary text-white shadow-xs'
                    : 'text-nexora-muted hover:text-black'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-nexora-muted" />
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="px-2.5 py-1.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-xs font-medium text-nexora-charcoal focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-nexora-primary text-white text-xs font-semibold rounded-lg"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="bg-white p-5 rounded-xl border border-nexora-border/70 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-nexora-border">
              <span className="font-serif font-bold text-sm text-nexora-charcoal">
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Curated Toggles */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-nexora-muted block">
                Curation Status
              </span>
              <button
                onClick={() => updateParam('featured', onlyFeatured ? null : 'true')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  onlyFeatured
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'text-nexora-charcoal hover:bg-nexora-warmWhite'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Featured Collection
                </span>
                {onlyFeatured && <span className="text-[10px]">&bull;</span>}
              </button>

              <button
                onClick={() => updateParam('trending', onlyTrending ? null : 'true')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  onlyTrending
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'text-nexora-charcoal hover:bg-nexora-warmWhite'
                }`}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  Trending Viral
                </span>
                {onlyTrending && <span className="text-[10px]">&bull;</span>}
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5 pt-2 border-t border-nexora-border">
              <span className="text-[10px] uppercase tracking-wider font-bold text-nexora-muted block mb-2">
                Categories
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-nexora-primary text-white font-semibold'
                      : 'text-nexora-charcoal hover:bg-nexora-warmWhite'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 lg:col-span-4 space-y-4">
          {/* Active Filter Summary Banner */}
          <div className="flex items-center justify-between text-xs text-nexora-muted">
            <span>
              Showing <strong className="text-nexora-charcoal">{products.length}</strong> product
              {products.length !== 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-pink-600 hover:underline font-semibold"
              >
                Clear all active filters
              </button>
            )}
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            wishlistIds={wishlistIds}
            onToggleWishlist={toggleWishlist}
            emptyMessage={
              selectedGender === 'men'
                ? "No products added in Men's Fashion yet. New festival & event pieces will appear here once added by the admin."
                : selectedGender === 'women'
                ? "No products added in Women's Fashion yet. New party & festive pieces will appear here once added by the admin."
                : "No products added yet. Check back soon or add products via the Admin Portal."
            }
          />
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-nexora-border">
                <span className="font-serif font-bold text-base text-nexora-charcoal">
                  Filter Catalog
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-nexora-muted block mb-2">
                  Categories
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      updateParam('category', cat);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-nexora-primary text-white font-semibold'
                        : 'text-nexora-charcoal hover:bg-nexora-warmWhite'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-nexora-border space-y-2">
              <button
                onClick={() => {
                  resetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 text-xs font-semibold text-nexora-muted border border-nexora-border rounded-lg"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-nexora-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg"
              >
                View {products.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
