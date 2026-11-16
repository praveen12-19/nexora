import React, { useState } from 'react';
import { ExternalLink, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
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

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const discount = calculateDiscount(product.price, product.original_price);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'];
  const primaryImage = images[0];
  const hoverImage = images[1] || primaryImage;

  const handleAffiliateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    analyticsService.trackEvent('affiliate_click', product.id).catch(() => {});
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageIndex(0);
    setIsImageModalOpen(true);
    analyticsService.trackEvent('product_view', product.id).catch(() => {});
  };

  return (
    <>
      <div className="group relative bg-white rounded-lg overflow-hidden border border-nexora-border/60 hover:border-nexora-charcoal/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
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

        {/* Product Image (Clicking opens image preview only - no redirection) */}
        <div
          onClick={handleImageClick}
          className="cursor-pointer block aspect-[3/4] overflow-hidden bg-nexora-beige/30 relative group/img"
          title="Click to view image"
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

          {/* Hover Zoom Hint */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <span className="p-2 bg-white/90 rounded-full shadow-md text-nexora-charcoal transform scale-90 group-hover/img:scale-100 transition-transform">
              <ZoomIn className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-nexora-muted uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span className="capitalize">{product.gender}</span>
            </div>

            {/* Product Title (Clicking opens image preview only) */}
            <h3
              onClick={handleImageClick}
              className="cursor-pointer font-medium text-xs md:text-sm text-nexora-charcoal line-clamp-2 leading-snug hover:text-black transition-colors"
              title="Click to view image"
            >
              {product.name}
            </h3>

            {/* Pricing */}
            {product.price > 0 && (
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
            )}
          </div>

          {/* Action Button: View Product (Redirects directly to admin-added link) */}
          <div className="mt-3.5 pt-3 border-t border-nexora-border/40">
            <a
              href={product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAffiliateClick}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:from-[#7B1FA2] hover:to-[#3800B0] text-white text-xs font-semibold rounded-md shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <span>View Product</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>
        </div>
      </div>

      {/* Full Image Preview Lightbox (Shows ONLY product image - no website redirection) */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="relative max-w-2xl max-h-[92vh] w-full flex flex-col items-center justify-center animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 sm:right-2 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
              title="Close image"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image Viewer */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/40 border border-white/10 max-h-[78vh] flex items-center justify-center">
              <img
                src={images[selectedImageIndex] || primaryImage}
                alt={product.name}
                className="max-h-[76vh] max-w-full w-auto object-contain select-none rounded-lg"
              />

              {/* Prev / Next controls for multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Details Bar with View Product Link */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full gap-3 px-2">
              <div className="text-white text-center sm:text-left">
                <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                <p className="text-[11px] text-white/60 capitalize">
                  {product.category} &bull; {images.length > 1 ? `Image ${selectedImageIndex + 1} of ${images.length}` : 'Product Image'}
                </p>
              </div>

              {/* View Product CTA */}
              <a
                href={product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAffiliateClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] hover:from-[#7B1FA2] hover:to-[#3800B0] text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95"
              >
                <span>View Product</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-12 h-14 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-purple-500 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
