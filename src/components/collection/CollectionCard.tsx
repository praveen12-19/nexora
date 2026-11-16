import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Collection } from '../../types/collection';

interface CollectionCardProps {
  collection: Collection;
  variant?: 'featured' | 'compact';
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  variant = 'compact',
}) => {
  const targetUrl = collection.gender && collection.gender !== 'all'
    ? `/shop?gender=${collection.gender}`
    : collection.categoryFilter && collection.categoryFilter.length > 0
    ? `/shop?category=${encodeURIComponent(collection.categoryFilter[0])}`
    : `/collections#${collection.slug}`;

  if (variant === 'featured') {
    return (
      <Link
        to={targetUrl}
        className="group relative h-[360px] md:h-[480px] rounded-2xl overflow-hidden block shadow-sm border border-nexora-border/60"
      >
        <img
          src={collection.imageUrl}
          alt={collection.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 text-white flex justify-between items-end">
          <div className="max-w-md">
            <span className="text-[11px] uppercase tracking-widest text-nexora-accent font-semibold block mb-1">
              Curated Edit
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-2 leading-tight">
              {collection.title}
            </h3>
            <p className="text-xs md:text-sm text-white/80 line-clamp-2 mb-3">
              {collection.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white border-b border-white pb-0.5 group-hover:text-nexora-accent group-hover:border-nexora-accent transition-colors">
              Explore Collection
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={targetUrl}
      className="group relative rounded-xl overflow-hidden block aspect-[4/5] shadow-sm border border-nexora-border/60"
    >
      <img
        src={collection.imageUrl}
        alt={collection.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className="absolute bottom-0 inset-x-0 p-4 text-white">
        <h4 className="font-serif text-lg font-semibold leading-tight group-hover:text-amber-200 transition-colors">
          {collection.title}
        </h4>
        <p className="text-xs text-white/75 line-clamp-1 mt-0.5">
          {collection.subtitle}
        </p>
      </div>
    </Link>
  );
};
