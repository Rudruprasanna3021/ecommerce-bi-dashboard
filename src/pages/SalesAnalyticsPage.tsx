import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useData } from '../context/DataContext';
import { ORDER_TRENDS_DATA } from '../lib/mockData';
import { TrendingUp, DollarSign, ShoppingCart, Award } from 'lucide-react';

export const SalesAnalyticsPage: React.FC = () => {
  const { monthlySales, orders, products, categories } = useData();

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const completedOrders = orders.filter((o) => o.status === 'Completed');
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Compute category sales distribution
  const categoryStats = categories.map((cat) => {
    const prodsInCat = products.filter((p) => p.category_id === cat.id);
    return {
      name: cat.name,
      productCount: prodsInCat.length,
      inventoryVal: prodsInCat.reduce((sum, p) => sum + p.price * p.stock_quantity, 0),
    };
  });

  return (
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Gross Sales Volume</p>
              <h3 className="text-xl font-extrabold text-slate-900">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Avg. Order Value (AOV)</p>
              <h3 className="text-xl font-extrabold text-slate-900">
                ${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Order Completion Rate</p>
              <h3 className="text-xl font-extrabold text-slate-900">
                {orders.length ? Math.round((completedOrders.length / orders.length) * 100) : 0}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts: Monthly Sales & Order Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Sales Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Monthly Sales Revenue
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated monthly transaction amounts across periods
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Sales Revenue']}
                />
                <Bar dataKey="sales" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Order Trends Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-violet-600" />
              Weekly Order Volume Trends
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of order fulfillment statuses by week
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ORDER_TRENDS_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#10b981"
                  fill="#d1fae5"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  name="Pending"
                  stroke="#f59e0b"
                  fill="#fef3c7"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  name="Cancelled"
                  stroke="#f43f5e"
                  fill="#ffe4e6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Inventory Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Category Inventory & Asset Value</h3>
        <p className="text-xs text-slate-500 mb-4">Stock valuation categorized by business divisions</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((cat, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70">
              <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <span>Products Active:</span>
                <span className="font-semibold">{cat.productCount}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
                <span>Inventory Valuation:</span>
                <span className="font-bold text-indigo-700">
                  ${cat.inventoryVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
