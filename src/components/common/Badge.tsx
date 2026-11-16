import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'trending' | 'sale' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm';

  const variants = {
    primary: 'bg-nexora-primary text-white',
    accent: 'bg-nexora-accent/20 text-yellow-900 border border-nexora-accent/40',
    trending: 'bg-rose-50 text-rose-700 border border-rose-200',
    sale: 'bg-red-600 text-white font-bold',
    outline: 'border border-nexora-charcoal/20 text-nexora-charcoal bg-white/80',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
