import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAdminShortcut } from '../../hooks/useAdminShortcut';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useVisitorTracking } from '../../hooks/useVisitorTracking';
import { AdminLoginModal } from '../admin/AdminLoginModal';
import { AdminDashboard } from '../admin/AdminDashboard';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, closeAdminModal, handleMobileLogoTap } = useAdminShortcut();
  const { user, isAuthenticated, isLoading, error, login, logout } = useAdminAuth();

  // Automatic anonymous visitor & page_view tracking
  useVisitorTracking();

  return (
    <div className="min-h-screen flex flex-col bg-nexora-warmWhite">
      <Navbar
        onMobileLogoTap={handleMobileLogoTap}
      />

      <main className="flex-1">{children}</main>

      <Footer />

      {/* Hidden Admin Access Modal & Dashboard */}
      {isOpen && !isAuthenticated && (
        <AdminLoginModal
          isOpen={isOpen}
          onClose={closeAdminModal}
          onLogin={login}
          isLoading={isLoading}
          error={error}
        />
      )}

      {isOpen && isAuthenticated && (
        <AdminDashboard
          isOpen={isOpen}
          onClose={closeAdminModal}
          onLogout={logout}
          adminUser={user}
        />
      )}
    </div>
  );
};
