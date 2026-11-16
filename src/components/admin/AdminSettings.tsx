import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Cloud, 
  Key, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

export const AdminSettings: React.FC = () => {
  const supabaseConnected = isSupabaseConfigured();
  const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const cloudinaryConnected = Boolean(cloudinaryCloudName);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-nexora-charcoal">
          System Status &amp; Configuration
        </h2>
        <p className="text-xs text-nexora-muted mt-0.5">
          Verify backend services, Cloudinary image pipeline, and secure admin access parameters.
        </p>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Supabase Status */}
        <div className="bg-white p-5 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-sm text-nexora-charcoal">
                Supabase PostgreSQL
              </h3>
            </div>
            {supabaseConnected ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                Local Sandbox Mode
              </span>
            )}
          </div>
          <p className="text-xs text-nexora-muted leading-relaxed">
            {supabaseConnected
              ? 'Live connection established. Auth, RLS policies, and database aggregations are operational.'
              : 'Operating with local persistence fallback. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to link your production Supabase database.'}
          </p>
        </div>

        {/* Cloudinary Status */}
        <div className="bg-white p-5 rounded-xl border border-nexora-border/70 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm text-nexora-charcoal">
                Cloudinary CDN
              </h3>
            </div>
            {cloudinaryConnected ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Configured
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                Direct Preview Mode
              </span>
            )}
          </div>
          <p className="text-xs text-nexora-muted leading-relaxed">
            {cloudinaryConnected
              ? `Connected to cloud: "${cloudinaryCloudName}". Image uploads are automatically signed and optimized with WebP/AVIF.`
              : 'Direct upload preview active. Configure VITE_CLOUDINARY_CLOUD_NAME in .env for direct Cloudinary storage.'}
          </p>
        </div>
      </div>

      {/* Admin Access & Shortcuts */}
      <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-nexora-border">
          <Key className="w-4 h-4 text-nexora-primary" />
          <h3 className="font-serif text-base font-bold text-nexora-charcoal">
            Hidden Access Shortcuts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-nexora-warmWhite rounded-xl border border-nexora-border/60">
            <span className="font-bold text-nexora-charcoal block mb-1">
              Desktop Shortcut
            </span>
            <div className="flex items-center gap-1.5 my-2">
              <kbd className="px-2 py-1 bg-white border border-nexora-border rounded shadow-xs font-mono font-bold">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-white border border-nexora-border rounded shadow-xs font-mono font-bold">
                Shift
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-white border border-nexora-border rounded shadow-xs font-mono font-bold">
                A
              </kbd>
            </div>
            <p className="text-nexora-muted text-[11px]">
              Instantly opens the admin login modal from anywhere on the public website without changing the browser URL.
            </p>
          </div>

          <div className="p-4 bg-nexora-warmWhite rounded-xl border border-nexora-border/60">
            <span className="font-bold text-nexora-charcoal block mb-1">
              Mobile Secret Gesture
            </span>
            <div className="my-2 font-semibold text-nexora-charcoal">
              Tap the &quot;NEXORA&quot; brand logo 5 times within 3 seconds
            </div>
            <p className="text-nexora-muted text-[11px]">
              Designed for quick administrative access when managing products or viewing analytics on smartphones.
            </p>
          </div>
        </div>
      </div>

      {/* Security Architecture Reference */}
      <div className="bg-white p-5 rounded-2xl border border-nexora-border/70 shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-nexora-border">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="font-serif text-base font-bold text-nexora-charcoal">
            Security &amp; RLS Checklist
          </h3>
        </div>

        <ul className="space-y-2 text-xs text-nexora-muted">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Row Level Security (RLS):</strong> Unauthenticated visitors can only view active products. Modification operations require an authenticated user listed in <code className="bg-nexora-warmWhite px-1.5 py-0.5 rounded border border-nexora-border">admin_users</code> table.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Secret Leakage:</strong> Cloudinary API secrets and Supabase service-role keys are never bundled in frontend client builds.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Admin Excluded from Metrics:</strong> All actions, views, and clicks performed by the administrator are filtered out of public analytics reports.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
