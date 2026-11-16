import React, { useState } from 'react';
import { User, Lock, X, AlertCircle, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, pass: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  isLoading,
  error,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Outer ambient glow and container */}
      <div className="relative max-w-md w-full animate-slide-up">
        {/* Soft background aura */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/25 via-purple-600/30 to-amber-500/25 blur-xl opacity-80 pointer-events-none" />

        {/* Modal Card */}
        <div className="relative bg-gradient-to-b from-[#1a0b2d] via-[#130722] to-[#0b0314] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-amber-500/30 overflow-hidden text-white">
          {/* Subtle top ambient radial highlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-amber-400/40"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand Emblem & Header */}
          <div className="text-center relative pt-2 mb-6">
            <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-3">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-pulse" />
              <img
                src="/logo.jpg"
                alt="Nexora Collection Logo"
                className="relative w-full h-full rounded-full object-cover ring-2 ring-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.35)]"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 border-2 border-[#130722] flex items-center justify-center shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#130722]" />
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
              Nexora Portal
            </h2>

            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-amber-400/60" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-amber-200/75 font-semibold">
                Administrator Access
              </span>
              <span className="h-px w-6 bg-gradient-to-l from-transparent to-amber-400/60" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 backdrop-blur-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-amber-200/80 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Username</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-amber-400/40 focus:border-amber-400 focus:bg-white/10 rounded-xl text-sm text-white focus:outline-none transition-all duration-200 shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-amber-200/80 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 hover:border-amber-400/40 focus:border-amber-400 focus:bg-white/10 rounded-xl text-sm text-white focus:outline-none transition-all duration-200 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-200 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 text-neutral-950 font-bold uppercase tracking-[0.2em] text-xs shadow-[0_4px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-[0.98] mt-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
