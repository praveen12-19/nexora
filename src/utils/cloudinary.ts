/**
 * Cloudinary image optimization utility.
 * Automatically injects responsive delivery, WebP/AVIF auto-format, and auto-quality.
 */

export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  } = {}
): string {
  if (!url) return '';

  // Only transform Cloudinary URLs
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const { width = 800, quality = 'auto', crop = 'fill' } = options;
  const transformations = [`f_auto`, `q_${quality}`, `w_${width}`, `c_${crop}`].join(',');

  // Check if URL already has /upload/
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + 8);
  const suffix = url.substring(uploadIndex + 8);

  // If already contains transformations, avoid duplicate stacking
  if (suffix.startsWith('v') || suffix.match(/^[a-z0-9_]+,/i)) {
    return `${prefix}${transformations}/${suffix}`;
  }

  return `${prefix}${transformations}/${suffix}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image (JPEG, PNG, WebP, or AVIF).',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size exceeds 5MB limit. Please choose a smaller image.',
    };
  }

  return { valid: true };
}
