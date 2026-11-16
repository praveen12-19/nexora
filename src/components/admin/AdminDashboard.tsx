import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { ProductManagement } from './ProductManagement';
import { AdminUser } from '../../types/admin';
import { Toast } from '../common/Toast';
import { X, ExternalLink } from 'lucide-react';

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openAddProductImmediately, setOpenAddProductImmediately] = useState(false);

  if (!isOpen) return null;

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleOpenAddProduct = () => {
    setActiveTab('products');
    setOpenAddProductImmediately(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-nexora-warmWhite animate-fade-in overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setOpenAddProductImmediately(false);
        }}
        onLogout={onLogout}
        onCloseDashboard={onClose}
        adminUser={adminUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-nexora-border/70 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-nexora-muted">
              Admin &bull;
            </span>
            <span className="text-xs font-bold text-nexora-charcoal capitalize">
              {activeTab === 'overview' ? 'Overview' : 'Product Management'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-nexora-border hover:bg-nexora-warmWhite text-xs font-semibold text-nexora-charcoal transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back To Store</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-nexora-muted hover:text-black hover:bg-nexora-warmWhite transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
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
