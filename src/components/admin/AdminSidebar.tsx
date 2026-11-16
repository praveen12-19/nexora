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
  isOpenOnMobile?: boolean;
  onCloseSidebar?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onCloseDashboard,
  isOpenOnMobile = false,
  onCloseSidebar,
}) => {
  const menuItems = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Product Management', icon: ShoppingBag },
  ];

  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 bg-nexora-primary text-white flex flex-col justify-between h-full border-r border-white/10 shrink-0 transform transition-transform duration-300 ease-in-out ${
        isOpenOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } shadow-2xl md:shadow-none`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
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
            type="button"
            onClick={onCloseSidebar}
            className="md:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer touch-manipulation"
            aria-label="Close Admin Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseSidebar?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer touch-manipulation ${
                  isActive
                    ? 'bg-white text-nexora-primary shadow-sm font-bold'
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
          type="button"
          onClick={() => {
            onCloseDashboard();
            onCloseSidebar?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer touch-manipulation"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Return To Store</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onLogout();
            onCloseSidebar?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-colors cursor-pointer touch-manipulation"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
