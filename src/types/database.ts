export interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  price: number;
  stock_quantity: number;
  created_at: string;
  categories?: {
    id: number;
    name: string;
  };
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface Order {
  id: number;
  customer_id: string;
  order_date: string;
  status: OrderStatus;
  total_amount: number;
  customers?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  products?: {
    id: number;
    name: string;
    price: number;
  };
}

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsLowStock: number;
}

export interface MonthlySalesData {
  month: string;
  sales: number;
  orders: number;
}
