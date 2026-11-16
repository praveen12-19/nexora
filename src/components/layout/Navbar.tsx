import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Desktop Navigation Links
  const desktopNavLinks = [
    { label: 'Home', path: '/' },
    { label: "Men's Collection", path: '/men' },
    { label: "Women's Collection", path: '/women' },
    { label: 'Couples Collection', path: '/collections' },
  ];

  // Mobile Navigation (Strictly: Home, Men's Collection, Women's Collection, Couples Collection)
  const mobileNavLinks = [
    { label: 'Home', path: '/' },
    { label: "Men's Collection", path: '/men' },
    { label: "Women's Collection", path: '/women' },
    { label: 'Couples Collection', path: '/collections' },
  ];

  const handleLogoClick = () => {
    onMobileLogoTap();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-nexora-border/60 shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-nexora-charcoal hover:text-black focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo with Image (with secret 5-tap mobile admin gesture) */}
          <div className="flex-1 md:flex-initial text-center md:text-left">
            <button
              onClick={handleLogoClick}
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
            {desktopNavLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-xs lg:text-[13px] uppercase tracking-wider font-semibold transition-colors duration-200 py-1 border-b-2 ${
                    isActive
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

      {/* Mobile Navigation Dropdown (Only Men, Women, Couples) */}
      {mobileMenuOpen && (
        <>
          {/* Dimmed backdrop covering screen below header */}
          <div
            className="md:hidden fixed inset-0 top-16 bg-black/40 z-40 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Clean Menu Container */}
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-nexora-border shadow-xl z-50 animate-slide-up">
            <div className="py-1 divide-y divide-nexora-border/40">
              {mobileNavLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-6 py-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-50/50 text-nexora-primary font-bold border-l-4 border-l-nexora-primary'
                        : 'text-nexora-charcoal hover:bg-neutral-50 font-medium'
                    }`
                  }
                >
                  <span className="font-serif text-sm tracking-[0.15em] uppercase">
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-nexora-muted" />
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
