import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
  Calendar,
  DollarSign,
  PackageCheck,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Order, OrderItem, OrderStatus } from '../types/database';
import { Modal } from '../components/common/Modal';
import { TableSkeleton } from '../components/common/LoadingSpinner';

export const OrdersPage: React.FC = () => {
  const { orders, getOrderItems, loading } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const openOrderDetails = async (order: Order) => {
    setSelectedOrder(order);
    setItemsLoading(true);
    const items = await getOrderItems(order.id);
    setOrderItems(items);
    setItemsLoading(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toString().includes(searchQuery) ||
      (o.customers?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customers?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return {
          icon: CheckCircle,
          cls: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'Processing':
        return {
          icon: RefreshCw,
          cls: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'Pending':
        return {
          icon: Clock,
          cls: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'Cancelled':
        return {
          icon: XCircle,
          cls: 'bg-rose-100 text-rose-800 border-rose-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order # or Customer..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
            >
              <option value="all">All Statuses ({orders.length})</option>
              <option value="Completed">Completed</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Orders Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or filter options.'
                : 'Customer orders placed on the storefront will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Order Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  const Icon = badge.icon;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #ORD-{ord.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div>
                          <p>{ord.customers?.full_name || 'Customer'}</p>
                          <p className="text-[10px] text-slate-400 font-normal">
                            {ord.customers?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(ord.order_date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        ${Number(ord.total_amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.cls}`}
                        >
                          <Icon className="w-3 h-3" />
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openOrderDetails(ord)}
                          className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details / Receipt Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: #ORD-${selectedOrder?.id}`}
        subtitle="Itemized receipt and order breakdown"
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-5">
            {/* Meta summary card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Customer</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {selectedOrder.customers?.full_name || 'Customer'}
                </p>
                <p className="text-[10px] text-slate-500">{selectedOrder.customers?.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Date Placed</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {new Date(selectedOrder.order_date).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Status</p>
                <p className="font-bold text-slate-800 mt-0.5">{selectedOrder.status}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px]">Total Amount</p>
                <p className="font-extrabold text-indigo-600 mt-0.5 text-sm">
                  ${Number(selectedOrder.total_amount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Line items table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Order Items ({orderItems.length})
              </h4>
              {itemsLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  Loading order items...
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Item / Product</th>
                        <th className="py-2.5 px-3">Quantity</th>
                        <th className="py-2.5 px-3">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderItems.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {item.products?.name || `Product #${item.product_id}`}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{item.quantity}x</td>
                          <td className="py-2.5 px-3 text-slate-600">
                            ${Number(item.unit_price).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            ${(item.quantity * Number(item.unit_price)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
