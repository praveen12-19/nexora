import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onMobileLogoTap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileLogoTap,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Couples Collection', path: '/collections' },
    { label: "Men's Fashion", path: '/men' },
    { label: "Women's Fashion", path: '/women' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-nexora-border/60 transition-all">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-nexora-charcoal hover:text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo with Image (with secret mobile tap gesture) */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <button
              onClick={onMobileLogoTap}
              className="text-left focus:outline-none select-none group inline-flex items-center gap-2.5 sm:gap-3"
              title="Nexora Collection"
            >
              <img
                src="/logo.jpg"
                alt="Nexora Collection Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover shadow-sm ring-1 ring-amber-400/50 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="text-left">
                <span className="font-serif text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-nexora-primary block group-hover:text-neutral-700 transition-colors leading-tight">
                  NEXORA
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-nexora-muted font-sans font-medium block">
                  COLLECTION
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.slice(0, 4).map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end
                className={({ isActive }) =>
                  `text-xs lg:text-[13px] uppercase tracking-wider font-semibold transition-colors duration-200 py-1 border-b-2 ${isActive
                    ? 'text-nexora-primary border-nexora-primary'
                    : 'text-nexora-muted border-transparent hover:text-nexora-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Right Spacer for symmetry */}
          <div className="w-8 md:hidden pointer-events-none" />
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="pb-4 border-b border-nexora-border flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="Nexora Collection Logo"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-400/40"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-nexora-muted font-bold block mb-0.5">
                    Menu
                  </span>
                  <span className="font-serif text-lg font-bold text-nexora-primary leading-tight">
                    Nexora Collection
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-semibold text-nexora-charcoal py-2 hover:text-black border-b border-nexora-border/30"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-nexora-muted" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-nexora-border">
              <p className="text-[11px] text-nexora-muted leading-relaxed mb-3">
                Nexora Collection curates top fashion trends and connects you directly to official Meesho affiliate purchase links.
              </p>
              <div className="text-[10px] text-neutral-400">
                Tip: Press Ctrl + Shift + A on desktop for admin
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
