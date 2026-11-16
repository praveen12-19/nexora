import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { ProductManagement } from './ProductManagement';
import { AdminUser } from '../../types/admin';
import { Toast } from '../common/Toast';
import { X, ExternalLink, Menu } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  adminUser: AdminUser | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  adminUser,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openAddProductImmediately, setOpenAddProductImmediately] = useState(false);

  if (!isOpen) return null;

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleOpenAddProduct = () => {
    setActiveTab('products');
    setOpenAddProductImmediately(true);
    setMobileSidebarOpen(false);
  };

  return (
    <div
      data-admin-dashboard
      className="fixed inset-0 z-50 flex bg-nexora-warmWhite animate-fade-in overflow-hidden no-scrollbar"
    >
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop static column / Mobile slide-over drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setOpenAddProductImmediately(false);
        }}
        onLogout={onLogout}
        onCloseDashboard={onClose}
        adminUser={adminUser}
        isOpenOnMobile={mobileSidebarOpen}
        onCloseSidebar={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden w-full">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-nexora-border/70 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Hamburger button for mobile to open admin drawer */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-nexora-charcoal hover:text-black rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer touch-manipulation"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold uppercase tracking-wider text-nexora-muted hidden sm:inline">
                Admin &bull;
              </span>
              <span className="font-bold text-nexora-charcoal capitalize">
                {activeTab === 'overview' ? 'Overview' : 'Product Management'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-nexora-border hover:bg-nexora-warmWhite active:bg-neutral-100 text-xs font-semibold text-nexora-charcoal transition-colors cursor-pointer touch-manipulation"
              title="Return to store"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back To Store</span>
              <span className="sm:hidden text-[11px]">Store</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-nexora-muted hover:text-black hover:bg-nexora-warmWhite active:bg-neutral-100 transition-colors cursor-pointer touch-manipulation"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0 no-scrollbar">
          {activeTab === 'overview' && (
            <AdminOverview
              onNavigateToProducts={() => setActiveTab('products')}
              onOpenAddProduct={handleOpenAddProduct}
            />
          )}

          {activeTab === 'products' && (
            <ProductManagement
              onNotify={showNotification}
              openAddModalInitially={openAddProductImmediately}
            />
          )}
        </div>
      </main>

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
