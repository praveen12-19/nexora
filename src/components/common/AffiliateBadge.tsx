import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface AffiliateBadgeProps {
  variant?: 'subtle' | 'detailed' | 'inline';
  className?: string;
}

export const AffiliateBadge: React.FC<AffiliateBadgeProps> = ({
  variant = 'subtle',
  className = '',
}) => {
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ${className}`}>
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        Verified Meesho Link
      </span>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-3.5 bg-nexora-beige/60 rounded-lg border border-nexora-border/70 text-xs text-nexora-muted flex items-start gap-2.5 ${className}`}>
        <ExternalLink className="w-4 h-4 text-nexora-charcoal mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-nexora-charcoal block mb-0.5">
            Affiliate Disclosure
          </span>
          Nexora Collection curates verified fashion looks. When you click &quot;Buy on Meesho&quot;, you are redirected to the official Meesho marketplace. We may earn a qualifying commission at no additional cost to you.
        </div>
      </div>
    );
  }

  return (
    <div className={`text-[11px] text-nexora-muted/80 flex items-center gap-1.5 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      Official Meesho Affiliate Link &bull; Secure External Checkout
    </div>
  );
};
