import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Editorial Header */}
      <section className="bg-nexora-cream py-16 md:py-24 border-b border-nexora-border/80">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-[11px] uppercase tracking-widest text-nexora-muted font-bold block">
            The Brand &amp; Philosophy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-nexora-charcoal leading-tight">
            Elevating Indian Fashion Discovery.
          </h1>
          <p className="font-serif italic text-lg md:text-2xl text-nexora-muted max-w-2xl mx-auto">
            &ldquo;Discover Your Style. Shop Your Favorites.&rdquo;
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 text-nexora-charcoal text-sm md:text-base leading-relaxed">
        {/* Intro */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-nexora-charcoal">
            The Nexora Purpose
          </h2>
          <p className="text-nexora-muted">
            Nexora Collection was born out of a simple observation: endless social media scrolling on Instagram, YouTube, and Facebook often sparks style inspiration, but finding the exact, affordable piece behind the screen can be challenging.
          </p>
          <p className="text-nexora-muted">
            We act as a curated bridge between inspirational digital fashion content and verified, high-value purchases on Meesho. Our editorial team selects standout silhouettes, quality fabrics, and versatile cuts that elevate everyday dressing without premium price tags.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 bg-white rounded-2xl border border-nexora-border/80 shadow-xs space-y-3">
            <span className="font-serif text-2xl font-bold text-amber-500">01</span>
            <h3 className="font-serif font-bold text-base text-nexora-charcoal">
              Content Curation
            </h3>
            <p className="text-xs text-nexora-muted leading-relaxed">
              We monitor trending viral aesthetics across social channels and handpick pieces with verified fabric credentials and stellar reviews.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-nexora-border/80 shadow-xs space-y-3">
            <span className="font-serif text-2xl font-bold text-amber-500">02</span>
            <h3 className="font-serif font-bold text-base text-nexora-charcoal">
              Editorial Showcase
            </h3>
            <p className="text-xs text-nexora-muted leading-relaxed">
              Nexora Collection displays these curated looks in an elegant, minimal digital lookbook with clean photography and styling advice.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-nexora-border/80 shadow-xs space-y-3">
            <span className="font-serif text-2xl font-bold text-amber-500">03</span>
            <h3 className="font-serif font-bold text-base text-nexora-charcoal">
              Direct Meesho Affiliate
            </h3>
            <p className="text-xs text-nexora-muted leading-relaxed">
              One click on &quot;Buy on Meesho&quot; transfers you seamlessly to Meesho to complete your checkout with Cash on Delivery and buyer protections.
            </p>
          </div>
        </div>

        {/* Affiliate Transparency Section */}
        <div className="p-6 sm:p-8 bg-nexora-warmWhite rounded-2xl border border-nexora-border/80 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-serif font-bold text-lg text-nexora-charcoal">
              Our Transparency &amp; Affiliate Commitment
            </h3>
          </div>
          <p className="text-xs md:text-sm text-nexora-muted leading-relaxed">
            Nexora Collection does not process payments, store billing records, or ship packages. Every purchase occurs securely on Meesho. When you make an eligible purchase via our referral links, we may receive a qualifying affiliate commission from Meesho at no additional cost to you. This support allows us to keep curating fresh fashion every single day.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-nexora-primary hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-md transition-all"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
