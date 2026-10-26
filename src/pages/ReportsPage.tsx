import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  Layers,
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const ReportsPage: React.FC = () => {
  const { orders, products, categories } = useData();

  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | 'quarter' | 'all'>('all');
  const [exporting, setExporting] = useState(false);

  // Filter orders according to selected date range
  const filteredOrders = orders.filter((o) => {
    if (dateFilter === 'all') return true;
    const orderDate = new Date(o.order_date).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - orderDate) / (1000 * 3600 * 24);

    if (dateFilter === '7days') return daysDiff <= 7;
    if (dateFilter === '30days') return daysDiff <= 30;
    if (dateFilter === 'quarter') return daysDiff <= 90;
    return true;
  });

  const grossSales = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const completedSales = filteredOrders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingSales = filteredOrders
    .filter((o) => o.status === 'Pending' || o.status === 'Processing')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const cancelledSales = filteredOrders
    .filter((o) => o.status === 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // Export to CSV Function
  const handleExportCSV = () => {
    setExporting(true);

    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Date', 'Status', 'Total Amount ($)'];
    const rows = filteredOrders.map((o) => [
      `ORD-${o.id}`,
      `"${o.customers?.full_name || 'Customer'}"`,
      `"${o.customers?.email || ''}"`,
      new Date(o.order_date).toISOString().split('T')[0],
      o.status,
      Number(o.total_amount).toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shoppulse_bi_sales_report_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setExporting(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Date Filter & Export Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Audit Period:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setDateFilter('7days')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === '7days' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateFilter('30days')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === '30days' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setDateFilter('quarter')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === 'quarter' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                dateFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting || filteredOrders.length === 0}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Generating CSV...' : 'Export Sales Report (CSV)'}</span>
        </button>
      </div>

      {/* Sales Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Gross Sales Audited
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            ${grossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">{filteredOrders.length} total orders filtered</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Realized Net Revenue
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">
            ${completedSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Successfully fulfilled</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pipeline / In-Transit
          </p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-2">
            ${pendingSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Pending & processing</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cancelled / Loss
          </p>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-2">
            ${cancelledSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Cancelled order transactions</p>
        </div>
      </div>

      {/* Filtered Orders Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Period Audit Log</h3>
            <p className="text-xs text-slate-500">Detailed records included in this export period</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {filteredOrders.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No transactions found for the selected period.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">#ORD-{o.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {o.customers?.full_name || 'Customer'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(o.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : o.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      ${Number(o.total_amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* College Project Architecture & Viva Defense Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-white">
              System Architecture & College Project Summary
            </h4>
            <p className="text-xs text-indigo-200">Key talking points for viva / demo evaluation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-bold text-indigo-300 mb-1">Frontend Engineering</h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Vite + React with TypeScript ensures type safety. Tailwind CSS provides a responsive, modern UI. Recharts delivers animated business charts.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-bold text-indigo-300 mb-1">Database Architecture</h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              PostgreSQL schema normalized across 6 relational tables (`profiles`, `customers`, `categories`, `products`, `orders`, `order_items`) with foreign keys and cascade integrity.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h5 className="font-bold text-indigo-300 mb-1">Security & Row Level Security</h5>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Supabase Auth provides secure JWT authentication. Row Level Security (RLS) protects customer, order, and profile records from unauthorized API mutations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
