import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../../utils/cloudinary';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800'
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0 md:max-h-[550px] shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-14 h-18 md:w-20 md:h-24 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? 'border-nexora-primary shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getOptimizedImageUrl(img, { width: 160, quality: 'auto' })}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image View */}
      <div className="flex-1 bg-white rounded-xl overflow-hidden border border-nexora-border/60 aspect-[3/4] max-h-[600px] relative">
        <img
          src={getOptimizedImageUrl(displayImages[selectedIndex], { width: 1000, quality: 'auto' })}
          alt={`${productName} - main view`}
          className="w-full h-full object-cover object-top transition-all duration-300"
        />

        {/* Mobile image indicator dots */}
        {displayImages.length > 1 && (
          <div className="md:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedIndex === idx ? 'bg-nexora-primary w-5' : 'bg-white/80 shadow'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
