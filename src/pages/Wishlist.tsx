import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { ProductCard } from '../components/product/ProductCard';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-nexora-border pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-nexora-muted font-bold block mb-1">
            Saved Pieces
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-nexora-charcoal">
            My Wishlist ({wishlistCount})
          </h1>
          <p className="text-xs text-nexora-muted mt-1">
            Persisted securely on your device. Click &quot;Buy on Meesho&quot; to order anytime.
          </p>
        </div>

        {wishlistCount > 0 && (
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-nexora-primary hover:text-black self-start sm:self-auto"
          >
            <span>Continue Discovering</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlistCount > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={true}
              onToggleWishlist={() => removeFromWishlist(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white rounded-2xl border border-nexora-border/80 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-nexora-charcoal">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-nexora-muted leading-relaxed">
            Save your favorite shirts, kurtis, dresses, and viral fashion picks by tapping the heart icon while browsing.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-nexora-primary hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Collection</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
