import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Home: React.FC = () => {
  const collectionBoxes = [
    {
      title: "Men's Collection",
      image: '/images/men-collection.jpg',
      path: '/men',
      position: 'object-[center_20%]',
    },
    {
      title: "Women's Collection",
      image: '/images/women-collection.jpg',
      path: '/women',
      position: 'object-top',
    },
    {
      title: 'Couples Collection',
      image: '/images/couples-collection.jpg',
      path: '/collections',
      position: 'object-[center_20%]',
    },
  ];

  return (
    <div className="py-6 sm:py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 md:space-y-16">
        {/* Intro Section */}
        <section className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-4">
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-nexora-charcoal tracking-tight leading-tight">
            We are <span className="text-nexora-primary">Nexora</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-nexora-charcoal/85 font-light leading-relaxed">
            Finding affordable and trending clothes for festivals, events, functions, and special celebrations.
          </p>

          <p className="text-xs sm:text-sm text-nexora-muted max-w-2xl mx-auto leading-relaxed">
            We handpick top-rated fashion recommendations from Meesho so you look your best without overspending. Tap any category below to discover your next look.
          </p>
        </section>

        {/* 3 Clean, Compact Collection Cards (Mobile optimized, small in size) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {collectionBoxes.map((box) => (
            <Link
              key={box.title}
              to={box.path}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-nexora-border/70 flex flex-col justify-end h-28 sm:h-36 md:h-auto md:aspect-[3/4] bg-nexora-primary"
            >
              {/* Background Photo */}
              <img
                src={box.image}
                alt={box.title}
                className={`absolute inset-0 w-full h-full object-cover ${box.position} sm:object-top transition-transform duration-700 group-hover:scale-105`}
              />

              {/* Gradient overlay for clear contrast on both mobile horizontal card and desktop portrait */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20 md:bg-gradient-to-t md:from-black/85 md:via-black/20 md:to-transparent transition-opacity duration-300" />

              {/* Card Content */}
              <div className="relative z-10 p-4 sm:p-5 md:p-6 flex items-center justify-between text-white w-full">
                <div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-300/90 font-semibold block mb-0.5">
                    Explore
                  </span>
                  <h2 className="font-serif text-base sm:text-xl md:text-2xl font-bold tracking-wide text-white group-hover:text-amber-200 transition-colors leading-tight">
                    {box.title}
                  </h2>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-nexora-primary transition-all duration-300 shrink-0 ml-3 shadow-xs">
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
