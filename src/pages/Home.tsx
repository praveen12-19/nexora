import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Home: React.FC = () => {
  const collectionBoxes = [
    {
      title: "Men's Collection",
      image: '/images/men-collection.jpg',
      path: '/men',
    },
    {
      title: "Women's Collection",
      image: '/images/women-collection.jpg',
      path: '/women',
    },
    {
      title: 'Couples Collection',
      image: '/images/couples-collection.jpg',
      path: '/collections',
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Intro Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-nexora-charcoal tracking-tight leading-tight">
            We are <span className="text-nexora-primary">Nexora</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-nexora-charcoal/85 font-light leading-relaxed">
            Finding affordable and trending clothes for festivals, events, functions, and special celebrations.
          </p>

          <p className="text-xs sm:text-sm text-nexora-muted max-w-2xl mx-auto leading-relaxed">
            We handpick top-rated fashion recommendations from Meesho so you look your best without overspending. Tap any category below to discover your next look.
          </p>
        </section>

        {/* 3 Clean Collection Boxes (No Extra Wordings) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {collectionBoxes.map((box) => (
            <Link
              key={box.title}
              to={box.path}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-nexora-border/70 flex flex-col justify-end aspect-[3/4] sm:aspect-[4/5] bg-nexora-primary"
            >
              {/* User Uploaded Photos */}
              <img
                src={box.image}
                alt={box.title}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Minimal Bottom Vignette For High Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300" />

              {/* Box Title Only (Extra Wordings Removed) */}
              <div className="relative z-10 p-6 flex items-center justify-between text-white">
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white group-hover:text-amber-200 transition-colors leading-tight">
                  {box.title}
                </h2>
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-nexora-primary transition-all duration-300 shrink-0">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};
