import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { AdminUser, AdminAuthState } from '../types/admin';

const ADMIN_STORAGE_KEY = 'nexora_admin_user';

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check existing session on mount
  useEffect(() => {
    async function initAuth() {
      // Check local storage session first
      try {
        const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
        if (stored) {
          const parsed: AdminUser = JSON.parse(stored);
          setState({
            user: parsed,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }
      } catch (err) {
        console.error('Failed to parse admin storage:', err);
      }

      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Verify admin role in admin_users table
            const { data: adminRecord, error } = await supabase
              .from('admin_users')
              .select('id, role, created_at')
              .eq('id', session.user.id)
              .single();

            if (!error && adminRecord) {
              const adminUser: AdminUser = {
                id: session.user.id,
                email: session.user.email || '',
                role: adminRecord.role || 'admin',
                created_at: adminRecord.created_at,
              };
              localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
              setState({
                user: adminUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return;
            }
          }
        } catch (err) {
          console.warn('Supabase auth session check failed:', err);
        }
      }

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }

    initAuth();
  }, []);

  const login = useCallback(async (emailOrUsername: string, pass: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const normalizedIdentifier = emailOrUsername.trim().toLowerCase();
    const normalizedPass = pass.trim();

    // 1. Check Primary Master Administrator Credentials
    if (normalizedIdentifier === 'nexora@collections12' && normalizedPass === 'nexora@plan12') {
      const adminUser: AdminUser = {
        id: 'nexora-superadmin-master',
        email: 'nexora@collections12',
        role: 'superadmin',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
      setState({
        user: adminUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    }

    // 2. Supabase Auth fallback if configured
    if (isSupabaseConfigured()) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: emailOrUsername.trim(),
          password: pass,
        });

        if (!authError && authData?.user) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('id, role, created_at')
            .eq('id', authData.user.id)
            .single();

          if (!adminError && adminData) {
            const adminUser: AdminUser = {
              id: authData.user.id,
              email: authData.user.email || emailOrUsername,
              role: adminData.role || 'admin',
              created_at: adminData.created_at,
            };
            localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
            setState({
              user: adminUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return true;
          }
        }
      } catch (err: any) {
        console.warn('Supabase auth attempt:', err);
      }
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: 'Invalid username or password. Please verify and try again.',
    }));
    return false;
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}
