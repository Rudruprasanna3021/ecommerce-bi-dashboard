import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Layers,
  Users,
  ShoppingCart,
  FileText,
  LogOut,
  GraduationCap,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type PageId =
  | 'dashboard'
  | 'analytics'
  | 'products'
  | 'categories'
  | 'customers'
  | 'orders'
  | 'reports';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, signOut, isConfigured, isDemoUser } = useAuth();

  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as PageId, label: 'Sales Analytics', icon: BarChart3 },
    { id: 'products' as PageId, label: 'Products', icon: Package },
    { id: 'categories' as PageId, label: 'Categories', icon: Layers },
    { id: 'customers' as PageId, label: 'Customers', icon: Users },
    { id: 'orders' as PageId, label: 'Orders', icon: ShoppingCart },
    { id: 'reports' as PageId, label: 'Reports', icon: FileText },
  ];

  const handleNavClick = (id: PageId) => {
    onSelectPage(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-xl ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  ShopPulse <span className="text-indigo-400">BI</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Business Intelligence Hub</p>
              </div>
            </div>

            {/* College Project Pill */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/40 text-[11px] font-semibold text-indigo-300">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>College Project Demo</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Database Status & User Info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Backend Status Box */}
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Backend
              </span>
              {isConfigured && !isDemoUser ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Supabase Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                  <AlertCircle className="w-3 h-3" /> Demo Mode
                </span>
              )}
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin User'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@bi.local'}</p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
