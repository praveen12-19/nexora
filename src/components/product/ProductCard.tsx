import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { Product } from '../../types/product';
import { formatCurrency, calculateDiscount } from '../../utils/currency';
import { getOptimizedImageUrl } from '../../utils/cloudinary';
import { analyticsService } from '../../services/analyticsService';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist = false,
  onToggleWishlist,
}) => {
  const discount = calculateDiscount(product.price, product.original_price);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800';
  const hoverImage = product.images?.[1] || primaryImage;

  const handleCardClick = () => {
    analyticsService.trackEvent('product_click', product.id).catch(() => {});
  };

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    analyticsService.trackEvent('affiliate_click', product.id).catch(() => {});
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-nexora-border/60 hover:border-nexora-charcoal/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {product.trending && (
          <Badge variant="trending">Trending</Badge>
        )}
        {product.featured && !product.trending && (
          <Badge variant="primary">Curated</Badge>
        )}
        {discount && (
          <Badge variant="sale">{discount}% OFF</Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full transition-transform duration-200 active:scale-90 shadow-sm backdrop-blur-md ${
          isInWishlist
            ? 'bg-rose-50 text-rose-600'
            : 'bg-white/85 text-nexora-charcoal hover:text-rose-600 hover:bg-white'
        }`}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isInWishlist ? 'fill-current text-rose-600' : ''
          }`}
        />
      </button>

      {/* Product Image Link */}
      <Link
        to={`/product/${product.id}`}
        onClick={handleCardClick}
        className="block aspect-[3/4] overflow-hidden bg-nexora-beige/30 relative"
      >
        <img
          src={getOptimizedImageUrl(primaryImage, { width: 600, quality: 'auto' })}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {hoverImage !== primaryImage && (
          <img
            src={getOptimizedImageUrl(hoverImage, { width: 600, quality: 'auto' })}
            alt={`${product.name} view 2`}
            loading="lazy"
            className="w-full h-full object-cover object-top absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
      </Link>

      {/* Product Information */}
      <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-nexora-muted uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span className="capitalize">{product.gender}</span>
          </div>

          <Link
            to={`/product/${product.id}`}
            onClick={handleCardClick}
            className="block group-hover:text-neutral-700 transition-colors"
          >
            <h3 className="font-medium text-xs md:text-sm text-nexora-charcoal line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-bold text-sm md:text-base text-nexora-charcoal">
              {formatCurrency(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-nexora-muted line-through">
                {formatCurrency(product.original_price)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button: Buy on Meesho */}
        <div className="mt-3.5 pt-3 border-t border-nexora-border/40">
          <a
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:from-[#7B1FA2] hover:to-[#3800B0] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <span>Buy on Meesho</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
          </a>
        </div>
      </div>
    </div>
  );
};
