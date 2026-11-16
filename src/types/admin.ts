export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at?: string;
}

export interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
