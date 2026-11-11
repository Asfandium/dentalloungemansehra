import React, { useState } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { clinicConfig } from '../../config/clinicConfig';
import {
  LayoutDashboard,
  CalendarDays,
  Tag,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout, isSuperAdmin, isAdmin } = useAdminAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Verifying Administrative Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
    ...(isAdmin ? [
      { name: 'Services & Pricing', path: '/admin/services', icon: Tag },
      { name: 'Media Assets', path: '/admin/media', icon: ImageIcon },
      { name: 'System Settings', path: '/admin/settings', icon: Settings },
    ] : []),
    ...(isSuperAdmin ? [
      { name: 'Staff Management', path: '/admin/staff', icon: Users },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    ] : []),
  ];

  const isLinkActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const roleBadgeColor = {
    SuperAdmin: 'bg-amber-950 text-amber-300 border-amber-800',
    Admin: 'bg-blue-950 text-blue-300 border-blue-800',
    Helper: 'bg-slate-800 text-slate-300 border-slate-700',
  }[user.role] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img src={clinicConfig.logoImage} alt="Logo" className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain" />
          <span className="font-serif-editorial font-bold text-lg text-white">Admin Lounge</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
          aria-label="Toggle menu"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={clinicConfig.logoImage}
                alt="Clinic Logo"
                className="w-10 h-10 rounded-xl bg-white p-1 object-contain shadow-md"
              />
              <div>
                <h1 className="font-serif-editorial font-extrabold text-base text-white tracking-tight leading-tight">
                  Dental Lounge
                </h1>
                <p className="text-xs text-sky-400 font-semibold uppercase tracking-wider">
                  Admin Portal
                </p>
              </div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View Public Website"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const active = isLinkActive(item.path, item.exact);
              const IconComp = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <IconComp className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.fullName || user.email}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-1 ${roleBadgeColor}`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Mansehra Dental Lounge • v1.0
          </p>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Administration</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-700">
              {navItems.find((i) => isLinkActive(i.path, i.exact))?.name || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-700">{user.email}</span>
              <span className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${roleBadgeColor}`}>
                {user.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Admin Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
