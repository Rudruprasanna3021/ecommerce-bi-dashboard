import { Category, Customer, Order, Product } from '../types/database';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Laptops & Computers', description: 'Workstations, gaming rigs, ultrabooks and peripherals' },
  { id: 2, name: 'Smartphones & Tablets', description: 'Flagship smartphones, Android, iOS and tablet devices' },
  { id: 3, name: 'Audio & Headphones', description: 'Wireless earbuds, noise-canceling headsets, and studio monitors' },
  { id: 4, name: 'Smart Wearables', description: 'Fitness bands, smartwatches and biometric trackers' },
  { id: 5, name: 'Gaming & VR', description: 'Consoles, controllers, VR headsets and accessories' },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 101, name: 'MacBook Pro M3 Max', category_id: 1, price: 2499.00, stock_quantity: 18, created_at: '2026-01-15T10:00:00Z', categories: { id: 1, name: 'Laptops & Computers' } },
  { id: 102, name: 'Dell XPS 15 OLED', category_id: 1, price: 1899.50, stock_quantity: 12, created_at: '2026-01-20T11:30:00Z', categories: { id: 1, name: 'Laptops & Computers' } },
  { id: 103, name: 'iPhone 16 Pro 256GB', category_id: 2, price: 1099.00, stock_quantity: 45, created_at: '2026-02-01T09:15:00Z', categories: { id: 2, name: 'Smartphones & Tablets' } },
  { id: 104, name: 'Samsung Galaxy S25 Ultra', category_id: 2, price: 1199.99, stock_quantity: 32, created_at: '2026-02-05T14:20:00Z', categories: { id: 2, name: 'Smartphones & Tablets' } },
  { id: 105, name: 'Sony WH-1000XM5 ANC', category_id: 3, price: 399.00, stock_quantity: 8, created_at: '2026-02-10T16:00:00Z', categories: { id: 3, name: 'Audio & Headphones' } },
  { id: 106, name: 'Apple AirPods Pro Gen 2', category_id: 3, price: 249.00, stock_quantity: 60, created_at: '2026-02-12T08:45:00Z', categories: { id: 3, name: 'Audio & Headphones' } },
  { id: 107, name: 'Apple Watch Ultra 2', category_id: 4, price: 799.00, stock_quantity: 15, created_at: '2026-02-18T13:10:00Z', categories: { id: 4, name: 'Smart Wearables' } },
  { id: 108, name: 'Garmin Fenix 8 Solar', category_id: 4, price: 899.00, stock_quantity: 4, created_at: '2026-03-01T15:25:00Z', categories: { id: 4, name: 'Smart Wearables' } },
  { id: 109, name: 'PlayStation 5 Pro', category_id: 5, price: 699.99, stock_quantity: 22, created_at: '2026-03-10T17:40:00Z', categories: { id: 5, name: 'Gaming & VR' } },
  { id: 110, name: 'Meta Quest 3 512GB', category_id: 5, price: 649.00, stock_quantity: 0, created_at: '2026-03-15T12:00:00Z', categories: { id: 5, name: 'Gaming & VR' } },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c101-0001-4444-9999-000000000001', full_name: 'Aarav Sharma', email: 'aarav.sharma@example.com', created_at: '2026-01-10T09:00:00Z' },
  { id: 'c101-0001-4444-9999-000000000002', full_name: 'Sophia Chen', email: 'sophia.chen@example.com', created_at: '2026-01-18T14:30:00Z' },
  { id: 'c101-0001-4444-9999-000000000003', full_name: 'Marcus Vance', email: 'marcus.vance@example.com', created_at: '2026-02-02T11:15:00Z' },
  { id: 'c101-0001-4444-9999-000000000004', full_name: 'Priya Patel', email: 'priya.patel@example.com', created_at: '2026-02-14T16:45:00Z' },
  { id: 'c101-0001-4444-9999-000000000005', full_name: 'Liam O’Connor', email: 'liam.oc@example.com', created_at: '2026-03-05T10:20:00Z' },
  { id: 'c101-0001-4444-9999-000000000006', full_name: 'Ananya Deshmukh', email: 'ananya.d@example.com', created_at: '2026-03-19T13:00:00Z' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1001,
    customer_id: 'c101-0001-4444-9999-000000000001',
    order_date: '2026-01-22T14:10:00Z',
    status: 'Completed',
    total_amount: 2898.00,
    customers: { id: 'c101-0001-4444-9999-000000000001', full_name: 'Aarav Sharma', email: 'aarav.sharma@example.com' }
  },
  {
    id: 1002,
    customer_id: 'c101-0001-4444-9999-000000000002',
    order_date: '2026-02-10T11:45:00Z',
    status: 'Completed',
    total_amount: 1099.00,
    customers: { id: 'c101-0001-4444-9999-000000000002', full_name: 'Sophia Chen', email: 'sophia.chen@example.com' }
  },
  {
    id: 1003,
    customer_id: 'c101-0001-4444-9999-000000000003',
    order_date: '2026-02-25T16:20:00Z',
    status: 'Processing',
    total_amount: 1448.00,
    customers: { id: 'c101-0001-4444-9999-000000000003', full_name: 'Marcus Vance', email: 'marcus.vance@example.com' }
  },
  {
    id: 1004,
    customer_id: 'c101-0001-4444-9999-000000000004',
    order_date: '2026-03-12T09:30:00Z',
    status: 'Completed',
    total_amount: 1899.50,
    customers: { id: 'c101-0001-4444-9999-000000000004', full_name: 'Priya Patel', email: 'priya.patel@example.com' }
  },
  {
    id: 1005,
    customer_id: 'c101-0001-4444-9999-000000000005',
    order_date: '2026-03-24T18:05:00Z',
    status: 'Pending',
    total_amount: 699.99,
    customers: { id: 'c101-0001-4444-9999-000000000005', full_name: 'Liam O’Connor', email: 'liam.oc@example.com' }
  },
  {
    id: 1006,
    customer_id: 'c101-0001-4444-9999-000000000006',
    order_date: '2026-04-02T13:15:00Z',
    status: 'Completed',
    total_amount: 1048.00,
    customers: { id: 'c101-0001-4444-9999-000000000006', full_name: 'Ananya Deshmukh', email: 'ananya.d@example.com' }
  },
  {
    id: 1007,
    customer_id: 'c101-0001-4444-9999-000000000001',
    order_date: '2026-04-14T10:00:00Z',
    status: 'Processing',
    total_amount: 899.00,
    customers: { id: 'c101-0001-4444-9999-000000000001', full_name: 'Aarav Sharma', email: 'aarav.sharma@example.com' }
  },
  {
    id: 1008,
    customer_id: 'c101-0001-4444-9999-000000000002',
    order_date: '2026-04-20T17:40:00Z',
    status: 'Cancelled',
    total_amount: 649.00,
    customers: { id: 'c101-0001-4444-9999-000000000002', full_name: 'Sophia Chen', email: 'sophia.chen@example.com' }
  }
];

export const MONTHLY_SALES_CHART_DATA = [
  { month: 'Jan', sales: 2898.00, orders: 1 },
  { month: 'Feb', sales: 2547.00, orders: 2 },
  { month: 'Mar', sales: 2599.49, orders: 2 },
  { month: 'Apr', sales: 1947.00, orders: 2 },
  { month: 'May (Proj)', sales: 3400.00, orders: 3 },
  { month: 'Jun (Proj)', sales: 4100.00, orders: 4 },
];

export const ORDER_TRENDS_DATA = [
  { date: 'Week 1', completed: 3, pending: 1, cancelled: 0 },
  { date: 'Week 2', completed: 5, pending: 2, cancelled: 1 },
  { date: 'Week 3', completed: 4, pending: 1, cancelled: 0 },
  { date: 'Week 4', completed: 7, pending: 3, cancelled: 1 },
];
