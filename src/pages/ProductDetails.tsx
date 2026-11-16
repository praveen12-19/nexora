import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Share2, 
  Check, 
  ArrowLeft,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency, calculateDiscount } from '../utils/currency';
import { ImageGallery } from '../components/product/ImageGallery';
import { ProductCard } from '../components/product/ProductCard';
import { AffiliateBadge } from '../components/common/AffiliateBadge';
import { Badge } from '../components/common/Badge';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setIsLoading(true);
      try {
        const found = await productService.getProductById(id);
        setProduct(found);

        if (found) {
          // Record product view event
          analyticsService.trackEvent('product_view', found.id).catch(() => {});

          // Fetch related products
          const related = await productService.getRelatedProducts(found, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAffiliateClick = () => {
    if (product) {
      analyticsService.trackEvent('affiliate_click', product.id).catch(() => {});
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-xs text-nexora-muted">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-nexora-charcoal">
          Product Not Found
        </h2>
        <p className="text-xs text-nexora-muted max-w-sm mx-auto">
          This piece may have been unlisted or moved. Discover our current collection below.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-nexora-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Products</span>
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.original_price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      {/* Back Button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-nexora-muted hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to catalog</span>
        </Link>
      </div>

      {/* Main Product Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* Left: Gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Details & Purchase */}
        <div className="space-y-6">
          {/* Breadcrumb & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-nexora-muted">
              {product.category}
            </span>
            {product.trending && <Badge variant="trending">Trending on Reels</Badge>}
            {product.featured && <Badge variant="primary">Curated Pick</Badge>}
            {discount && <Badge variant="sale">{discount}% OFF</Badge>}
          </div>

          {/* Product Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-nexora-charcoal leading-tight">
            {product.name}
          </h1>

          {/* Pricing Display */}
          {product.price > 0 && (
            <div className="p-4 bg-white rounded-xl border border-nexora-border/70 flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-nexora-charcoal">
                {formatCurrency(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-nexora-muted line-through">
                  {formatCurrency(product.original_price)}
                </span>
              )}
              {discount && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save {discount}% on Meesho
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-nexora-muted">
              About This Piece
            </h3>
            <p className="text-xs sm:text-sm text-nexora-charcoal leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Action Area: Buy on Meesho Button & Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* PRIMARY AFFILIATE BUTTON */}
              <a
                href={product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAffiliateClick}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:from-[#7B1FA2] hover:to-[#3800B0] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>View Product</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Share Button */}
              <button
                onClick={handleShare}
                aria-label="Share"
                className="p-3.5 rounded-xl border bg-white border-nexora-border text-nexora-charcoal hover:bg-nexora-warmWhite transition-colors shadow-xs"
                title="Copy product link"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Affiliate Disclosure Badge (Required by FTC & Prompt Section 5.D) */}
            <AffiliateBadge variant="detailed" />
          </div>

          {/* Meesho Platform Perks */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-nexora-muted border-t border-nexora-border/60">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-nexora-charcoal" />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-nexora-charcoal" />
              <span>7-Day Hassle Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-nexora-border/80">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-nexora-muted font-bold block mb-1">
                You May Also Admire
              </span>
              <h2 className="font-serif text-2xl font-bold text-nexora-charcoal">
                Related Fashion Pieces
              </h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold uppercase tracking-wider text-nexora-primary hover:text-black"
            >
              More in {product.category}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
