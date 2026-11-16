import React, { useState } from 'react';
import { X, Upload, Trash2, AlertCircle, Link as LinkIcon, Check } from 'lucide-react';
import { Product, Gender } from '../../types/product';
import { cloudinaryService } from '../../services/cloudinaryService';

interface ProductFormProps {
  product?: Product | null;
  onSave: (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

const CATEGORIES = [
  'Couples Collection',
  'Matching Sets',
  'Shirts',
  'T-Shirts',
  'Dresses',
  'Kurtis',
  'Ethnic Wear',
  'Jeans & Trousers',
  'Jackets & Coats',
  'Casual Wear',
  'Office Wear',
  'Party Wear',
  'Footwear',
  'Accessories',
  'Bags',
  'Jewelry',
];

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSave,
  onClose,
  isLoading,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price ? product.price.toString() : '');
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price ? product.original_price.toString() : ''
  );
  const [category, setCategory] = useState(product?.category || 'Shirts');
  const [gender, setGender] = useState<Gender>(
    product?.gender === 'unisex' ? 'couples' : product?.gender || 'women'
  );
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [affiliateUrl, setAffiliateUrl] = useState(product?.affiliate_url || '');
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [trending, setTrending] = useState(product?.trending ?? false);
  const [active, setActive] = useState(product?.active ?? true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setValidationError(null);

    try {
      const fileList = Array.from(files);
      const uploadedUrls = await cloudinaryService.uploadMultipleImages(fileList);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setValidationError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form Validations
    if (!name.trim()) {
      setValidationError('Product name is required.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setValidationError('Please enter a valid product price.');
      return;
    }

    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (parsedOriginalPrice !== null && (isNaN(parsedOriginalPrice) || parsedOriginalPrice < parsedPrice)) {
      setValidationError('Original price must be greater than or equal to current price.');
      return;
    }

    if (!category.trim()) {
      setValidationError('Category is required.');
      return;
    }

    if (images.length === 0) {
      setValidationError('At least one product image is required.');
      return;
    }

    if (!affiliateUrl.trim() || !affiliateUrl.startsWith('http')) {
      setValidationError('Valid Meesho affiliate URL is required (must start with https://).');
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        original_price: parsedOriginalPrice,
        category,
        gender,
        images,
        affiliate_url: affiliateUrl.trim(),
        featured,
        trending,
        active,
      });
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save product. Please check your data.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-nexora-border overflow-hidden my-8 animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-nexora-primary text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-lg font-bold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-white/70">
              Configure product details, Cloudinary images, and Meesho affiliate link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
            />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                Current Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                Original Price (₹ MRP, optional)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
              />
            </div>
          </div>

          {/* Category & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
                Target Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
              >
                <option value="men">Men&apos;s Fashion</option>
                <option value="women">Women&apos;s Fashion</option>
                <option value="couples">Couples Collection</option>
              </select>
            </div>
          </div>

          {/* Meesho Affiliate Link */}
          <div>
            <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider mb-1.5">
              Meesho Affiliate URL *
            </label>
            <div className="relative">
              <input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                required
                className="w-full pl-9 pr-3.5 py-2.5 bg-nexora-warmWhite border border-nexora-border rounded-lg text-sm focus:outline-none focus:border-nexora-primary focus:bg-white"
              />
              <LinkIcon className="w-4 h-4 text-pink-500 absolute left-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-nexora-muted mt-1">
              Visitors clicking &quot;Buy on Meesho&quot; will be securely redirected to this exact affiliate link.
            </p>
          </div>

          {/* Product Images (Cloudinary) */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-nexora-charcoal uppercase tracking-wider">
              Product Images (Cloudinary Upload) *
            </label>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-nexora-warmWhite border-2 border-dashed border-nexora-border rounded-lg hover:border-nexora-primary transition-colors text-xs font-semibold text-nexora-charcoal">
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image Files'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview List */}
            {images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-nexora-border aspect-[3/4] bg-nexora-beige">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors"
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-nexora-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-nexora-muted italic">
                No images added yet. Please upload at least one image.
              </p>
            )}
          </div>

          {/* Flags: Featured, Trending, Active */}
          <div className="p-4 bg-nexora-warmWhite rounded-xl border border-nexora-border/70 space-y-3">
            <span className="text-xs font-semibold text-nexora-charcoal uppercase tracking-wider block">
              Display &amp; Visibility Controls
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-nexora-charcoal">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-nexora-primary focus:ring-0"
                />
                <span>Active (Live on store)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-nexora-charcoal">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-nexora-primary focus:ring-0"
                />
                <span>Featured Collection</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-nexora-charcoal">
                <input
                  type="checkbox"
                  checked={trending}
                  onChange={(e) => setTrending(e.target.checked)}
                  className="rounded text-nexora-primary focus:ring-0"
                />
                <span>Trending Badge</span>
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-nexora-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-xs font-semibold text-nexora-muted hover:text-black uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || uploadingImage}
              className="px-6 py-2.5 bg-nexora-primary hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Saving Product...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{product ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
