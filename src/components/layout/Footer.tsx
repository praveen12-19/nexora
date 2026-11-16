import React from 'react';
import { Instagram, Youtube, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-nexora-primary text-white py-12 border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Connect With Us Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg md:text-xl font-medium tracking-widest uppercase text-white/90">
            Connect With Us
          </h3>
          <div className="flex items-center justify-center gap-4">
            {/* Instagram - Official Gradient Brand Color */}
            <a
              href="https://www.instagram.com/nexora_collection_?mdxt=MWpmbm5ybTI4NTNscQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 text-white shadow-lg hover:scale-110 active:scale-95 hover:shadow-pink-500/25"
              style={{
                background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)'
              }}
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 stroke-[2.2]" />
            </a>

            {/* YouTube - Official Brand Red */}
            <a
              href="https://youtube.com/@nexora-collections?si=SvGpR0-vYHu1TpAt"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#FF0000] hover:bg-[#E60000] flex items-center justify-center transition-all duration-300 text-white shadow-lg hover:scale-110 active:scale-95 hover:shadow-red-500/25"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 stroke-[2.2]" />
            </a>

            {/* Facebook - Official Brand Royal Blue */}
            <a
              href="https://www.facebook.com/share/1HFhZ7ydus/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-[#1877F2] hover:bg-[#166fe5] flex items-center justify-center transition-all duration-300 text-white shadow-lg hover:scale-110 active:scale-95 hover:shadow-blue-500/25"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 fill-white stroke-none" />
            </a>
          </div>
        </div>

        {/* Affiliate Disclaimer Statement */}
        <div className="pt-6 border-t border-white/10 text-xs text-white/60 leading-relaxed max-w-3xl mx-auto space-y-1.5">
          <p className="font-semibold text-white/80 uppercase tracking-wider text-[11px]">
            Affiliate Disclaimer Statement
          </p>
          <p className="text-[11px] md:text-xs text-white/65">
            Nexora Collection is a fashion discovery and curation platform. We do not sell products directly, hold inventory, process customer payments, or fulfill orders. When you click &quot;Buy on Meesho&quot;, you are redirected to the Meesho marketplace to complete your transaction with trusted sellers. Nexora Collection participates in the Meesho Affiliate Program and may earn affiliate commissions on qualifying purchases made through our referral links at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
};
