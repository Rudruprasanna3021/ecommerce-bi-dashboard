import React from 'react';
import { Menu, RefreshCw, Database, Sparkles } from 'lucide-react';
import { PageId } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  currentPage: PageId;
  onOpenMobileSidebar: () => void;
}

const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Dashboard',
    subtitle: 'High-level Key Performance Indicators and real-time business health',
  },
  analytics: {
    title: 'Sales & Revenue Analytics',
    subtitle: 'Visualizing order trends, revenue trajectories, and sales velocity',
  },
  products: {
    title: 'Product Catalog Management',
    subtitle: 'Manage items, inventory levels, category classification, and pricing',
  },
  categories: {
    title: 'Category Taxonomy',
    subtitle: 'Organize store departments, inventory groups, and product lines',
  },
  customers: {
    title: 'Customer Directory',
    subtitle: 'Active accounts, customer lifetime analytics, and registration records',
  },
  orders: {
    title: 'Orders & Fulfillment',
    subtitle: 'Order tracking, itemized receipts, customer transactions, and order states',
  },
  reports: {
    title: 'Business Intelligence Reports',
    subtitle: 'Date-filtered revenue audits, category performance, and CSV exports',
  },
};

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onOpenMobileSidebar }) => {
  const { isConfigured, isDemoUser } = useAuth();
  const { refreshData, loading } = useData();

  const currentMeta = pageTitles[currentPage] || pageTitles.dashboard;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile trigger & Page Header */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {currentMeta.title}
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Live BI
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden md:block mt-0.5">{currentMeta.subtitle}</p>
        </div>
      </div>

      {/* Right: Quick actions & Connection Status */}
      <div className="flex items-center gap-3">
        {/* Supabase Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            isConfigured && !isDemoUser
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isConfigured && !isDemoUser ? 'Supabase Connected' : 'Demo Project Mode'}
          </span>
          <span className="sm:hidden">{isConfigured && !isDemoUser ? 'Connected' : 'Demo'}</span>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => refreshData()}
          disabled={loading}
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition-all duration-200 disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* College Demo Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>College Evaluation Ready</span>
        </div>
      </div>
    </header>
  );
};
