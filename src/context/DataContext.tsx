import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Category, Customer, Order, OrderItem, Product, DashboardMetrics, MonthlySalesData } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  MONTHLY_SALES_CHART_DATA
} from '../lib/mockData';
import { useAuth } from './AuthContext';

interface DataContextType {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  
  // Product CRUD
  addProduct: (product: { name: string; category_id: number; price: number; stock_quantity: number }) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: number, product: { name: string; category_id: number; price: number; stock_quantity: number }) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: number) => Promise<{ success: boolean; error?: string }>;
  
  // Category CRUD
  addCategory: (category: { name: string; description: string }) => Promise<{ success: boolean; error?: string }>;
  updateCategory: (id: number, category: { name: string; description: string }) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: number) => Promise<{ success: boolean; error?: string }>;
  
  // Computed metrics
  metrics: DashboardMetrics;
  monthlySales: MonthlySalesData[];
  getOrderItems: (orderId: number) => Promise<OrderItem[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDemoUser } = useAuth();
  const configured = isSupabaseConfigured() && !isDemoUser;

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!configured) {
      // In demo/unconfigured mode, keep local state
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      if (catError) throw catError;

      // Fetch Products with category relation
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .order('id', { ascending: true });
      if (prodError) throw prodError;

      // Fetch Customers
      const { data: custData, error: custError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (custError) throw custError;

      // Fetch Orders with customer relation
      const { data: ordData, error: ordError } = await supabase
        .from('orders')
        .select('*, customers(id, full_name, email)')
        .order('order_date', { ascending: false });
      if (ordError) throw ordError;

      setCategories(catData || []);
      setProducts(prodData || []);
      setCustomers(custData || []);
      setOrders(ordData || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch database records';
      console.error('Error fetching Supabase data:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Product CRUD
  const addProduct = async (prod: { name: string; category_id: number; price: number; stock_quantity: number }) => {
    try {
      if (configured) {
        const { error } = await supabase.from('products').insert([prod]);
        if (error) throw error;
        await fetchData();
      } else {
        const newCategory = categories.find((c) => c.id === prod.category_id);
        const newProd: Product = {
          id: Date.now(),
          ...prod,
          created_at: new Date().toISOString(),
          categories: newCategory ? { id: newCategory.id, name: newCategory.name } : undefined,
        };
        setProducts((prev) => [newProd, ...prev]);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create product';
      return { success: false, error: msg };
    }
  };

  const updateProduct = async (
    id: number,
    prod: { name: string; category_id: number; price: number; stock_quantity: number }
  ) => {
    try {
      if (configured) {
        const { error } = await supabase.from('products').update(prod).eq('id', id);
        if (error) throw error;
        await fetchData();
      } else {
        const newCategory = categories.find((c) => c.id === prod.category_id);
        setProducts((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...prod,
                  categories: newCategory ? { id: newCategory.id, name: newCategory.name } : item.categories,
                }
              : item
          )
        );
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update product';
      return { success: false, error: msg };
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      if (configured) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      return { success: false, error: msg };
    }
  };

  // Category CRUD
  const addCategory = async (cat: { name: string; description: string }) => {
    try {
      if (configured) {
        const { error } = await supabase.from('categories').insert([cat]);
        if (error) throw error;
        await fetchData();
      } else {
        const newCat: Category = {
          id: categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
          ...cat,
        };
        setCategories((prev) => [...prev, newCat]);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add category';
      return { success: false, error: msg };
    }
  };

  const updateCategory = async (id: number, cat: { name: string; description: string }) => {
    try {
      if (configured) {
        const { error } = await supabase.from('categories').update(cat).eq('id', id);
        if (error) throw error;
        await fetchData();
      } else {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...cat } : c)));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update category';
      return { success: false, error: msg };
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      // Check if products are assigned to this category
      const hasProducts = products.some((p) => p.category_id === id);
      if (hasProducts) {
        return {
          success: false,
          error: 'Cannot delete this category because products are assigned to it. Reassign or delete products first.',
        };
      }

      if (configured) {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        await fetchData();
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
      return { success: false, error: msg };
    }
  };

  const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
    if (configured) {
      try {
        const { data, error } = await supabase
          .from('order_items')
          .select('*, products(id, name, price)')
          .eq('order_id', orderId);
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Error fetching order items:', err);
        return [];
      }
    } else {
      // Return representative mock items based on order id
      return [
        {
          id: 1,
          order_id: orderId,
          product_id: 101,
          quantity: 1,
          unit_price: 2499.00,
          products: { id: 101, name: 'MacBook Pro M3 Max', price: 2499.00 },
        },
        {
          id: 2,
          order_id: orderId,
          product_id: 105,
          quantity: 1,
          unit_price: 399.00,
          products: { id: 105, name: 'Sony WH-1000XM5 ANC', price: 399.00 },
        },
      ];
    }
  };

  // Compute metrics from actual orders/products/customers
  const totalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const productsLowStock = products.filter((p) => p.stock_quantity < 10).length;

  const metrics: DashboardMetrics = {
    totalSales,
    totalOrders,
    totalCustomers,
    totalProducts,
    salesGrowth: 14.8,
    ordersGrowth: 11.2,
    customersGrowth: 22.5,
    productsLowStock,
  };

  // Compute monthly sales dynamically or fallback
  const monthlySales: MonthlySalesData[] = MONTHLY_SALES_CHART_DATA;

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        customers,
        orders,
        loading,
        error,
        refreshData: fetchData,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        metrics,
        monthlySales,
        getOrderItems,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
