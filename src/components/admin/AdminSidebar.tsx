import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

export type AdminTab = 'overview' | 'products';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onCloseDashboard: () => void;
  adminUser?: AdminUser | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onCloseDashboard,
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Product Management', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 bg-nexora-primary text-white flex flex-col justify-between h-full border-r border-white/10 shrink-0">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Nexora Emblem"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-400/50 shrink-0"
            />
            <div>
              <span className="font-serif text-lg font-bold tracking-widest uppercase text-white block leading-tight">
                NEXORA
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-300 font-sans font-semibold">
                ADMIN
              </span>
            </div>
          </div>
          <button
            onClick={onCloseDashboard}
            className="md:hidden text-white/70 hover:text-white p-1"
            aria-label="Close Admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-white text-nexora-primary shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-nexora-primary' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onCloseDashboard}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Return To Store</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
