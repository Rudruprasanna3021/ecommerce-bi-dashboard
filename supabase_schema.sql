-- ==============================================================================
-- E-COMMERCE BUSINESS INTELLIGENCE DASHBOARD - SUPABASE POSTGRESQL SCHEMA
-- Author: College Project Demonstration
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. CUSTOMERS TABLE (Storefront shoppers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE (Product taxonomy)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS TABLE (Inventory catalog)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    category_id BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (Customer purchase transactions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    order_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Processing', 'Completed', 'Cancelled')),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0)
);

-- ------------------------------------------------------------------------------
-- 6. ORDER_ITEMS TABLE (Itemized line entries for orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
);

-- ------------------------------------------------------------------------------
-- 7. PERFORMANCE INDEXES (Optimized queries for BI aggregation)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON public.orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can read categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can read products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can read customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can read orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can read order items" ON public.order_items;

-- Public / Authenticated read for products and categories (catalog browsing)
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated manage products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Authenticated-only access for profiles, customers, orders, and order items
CREATE POLICY "Allow authenticated read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow authenticated read customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated read orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated read order items" ON public.order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage order items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. SAFE SAMPLE DATA INSERT STATEMENTS
-- ------------------------------------------------------------------------------

-- Insert Categories (if not already present)
INSERT INTO public.categories (name, description) VALUES
('Laptops & Computers', 'Workstations, gaming rigs, ultrabooks and peripherals'),
('Smartphones & Tablets', 'Flagship smartphones, Android, iOS and tablet devices'),
('Audio & Headphones', 'Wireless earbuds, noise-canceling headsets, and studio monitors'),
('Smart Wearables', 'Fitness bands, smartwatches and biometric trackers'),
('Gaming & VR', 'Consoles, controllers, VR headsets and accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert Products
INSERT INTO public.products (name, category_id, price, stock_quantity)
SELECT 'MacBook Pro M3 Max', c.id, 2499.00, 18 FROM public.categories c WHERE c.name = 'Laptops & Computers'
UNION ALL
SELECT 'Dell XPS 15 OLED', c.id, 1899.50, 12 FROM public.categories c WHERE c.name = 'Laptops & Computers'
UNION ALL
SELECT 'iPhone 16 Pro 256GB', c.id, 1099.00, 45 FROM public.categories c WHERE c.name = 'Smartphones & Tablets'
UNION ALL
SELECT 'Samsung Galaxy S25 Ultra', c.id, 1199.99, 32 FROM public.categories c WHERE c.name = 'Smartphones & Tablets'
UNION ALL
SELECT 'Sony WH-1000XM5 ANC', c.id, 399.00, 8 FROM public.categories c WHERE c.name = 'Audio & Headphones'
UNION ALL
SELECT 'Apple AirPods Pro Gen 2', c.id, 249.00, 60 FROM public.categories c WHERE c.name = 'Audio & Headphones'
UNION ALL
SELECT 'Apple Watch Ultra 2', c.id, 799.00, 15 FROM public.categories c WHERE c.name = 'Smart Wearables'
UNION ALL
SELECT 'Garmin Fenix 8 Solar', c.id, 899.00, 4 FROM public.categories c WHERE c.name = 'Smart Wearables'
UNION ALL
SELECT 'PlayStation 5 Pro', c.id, 699.99, 22 FROM public.categories c WHERE c.name = 'Gaming & VR'
UNION ALL
SELECT 'Meta Quest 3 512GB', c.id, 649.00, 0 FROM public.categories c WHERE c.name = 'Gaming & VR'
ON CONFLICT DO NOTHING;

-- Insert Customers
INSERT INTO public.customers (id, full_name, email) VALUES
('c1010001-4444-9999-0000-000000000001', 'Aarav Sharma', 'aarav.sharma@example.com'),
('c1010001-4444-9999-0000-000000000002', 'Sophia Chen', 'sophia.chen@example.com'),
('c1010001-4444-9999-0000-000000000003', 'Marcus Vance', 'marcus.vance@example.com'),
('c1010001-4444-9999-0000-000000000004', 'Priya Patel', 'priya.patel@example.com'),
('c1010001-4444-9999-0000-000000000005', 'Liam O''Connor', 'liam.oc@example.com'),
('c1010001-4444-9999-0000-000000000006', 'Ananya Deshmukh', 'ananya.d@example.com')
ON CONFLICT (email) DO NOTHING;

-- Insert Orders
INSERT INTO public.orders (id, customer_id, order_date, status, total_amount) OVERRIDING SYSTEM VALUE VALUES
(1001, 'c1010001-4444-9999-0000-000000000001', '2026-01-22 14:10:00+00', 'Completed', 2898.00),
(1002, 'c1010001-4444-9999-0000-000000000002', '2026-02-10 11:45:00+00', 'Completed', 1099.00),
(1003, 'c1010001-4444-9999-0000-000000000003', '2026-02-25 16:20:00+00', 'Processing', 1448.00),
(1004, 'c1010001-4444-9999-0000-000000000004', '2026-03-12 09:30:00+00', 'Completed', 1899.50),
(1005, 'c1010001-4444-9999-0000-000000000005', '2026-03-24 18:05:00+00', 'Pending', 699.99),
(1006, 'c1010001-4444-9999-0000-000000000006', '2026-04-02 13:15:00+00', 'Completed', 1048.00),
(1007, 'c1010001-4444-9999-0000-000000000001', '2026-04-14 10:00:00+00', 'Processing', 899.00),
(1008, 'c1010001-4444-9999-0000-000000000002', '2026-04-20 17:40:00+00', 'Cancelled', 649.00)
ON CONFLICT (id) DO NOTHING;

-- Insert Order Items
INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
SELECT 1001, p.id, 1, 2499.00 FROM public.products p WHERE p.name = 'MacBook Pro M3 Max'
UNION ALL
SELECT 1001, p.id, 1, 399.00 FROM public.products p WHERE p.name = 'Sony WH-1000XM5 ANC'
UNION ALL
SELECT 1002, p.id, 1, 1099.00 FROM public.products p WHERE p.name = 'iPhone 16 Pro 256GB'
UNION ALL
SELECT 1003, p.id, 1, 699.99 FROM public.products p WHERE p.name = 'PlayStation 5 Pro'
UNION ALL
SELECT 1004, p.id, 1, 1899.50 FROM public.products p WHERE p.name = 'Dell XPS 15 OLED'
UNION ALL
SELECT 1005, p.id, 1, 699.99 FROM public.products p WHERE p.name = 'PlayStation 5 Pro'
UNION ALL
SELECT 1006, p.id, 1, 799.00 FROM public.products p WHERE p.name = 'Apple Watch Ultra 2'
UNION ALL
SELECT 1006, p.id, 1, 249.00 FROM public.products p WHERE p.name = 'Apple AirPods Pro Gen 2'
UNION ALL
SELECT 1007, p.id, 1, 899.00 FROM public.products p WHERE p.name = 'Garmin Fenix 8 Solar'
UNION ALL
SELECT 1008, p.id, 1, 649.00 FROM public.products p WHERE p.name = 'Meta Quest 3 512GB';

-- ------------------------------------------------------------------------------
-- 10. USEFUL SQL QUERIES (BI METRICS, VIVA DEMONSTRATION & VERIFICATION)
-- ------------------------------------------------------------------------------

-- Query 1: Total Sales (excluding cancelled orders)
-- SELECT SUM(total_amount) AS total_sales FROM public.orders WHERE status != 'Cancelled';

-- Query 2: Total Orders
-- SELECT COUNT(*) AS total_orders FROM public.orders;

-- Query 3: Total Customers
-- SELECT COUNT(*) AS total_customers FROM public.customers;

-- Query 4: Total Products & Low Stock Count
-- SELECT COUNT(*) AS total_products, COUNT(*) FILTER (WHERE stock_quantity < 10) AS low_stock_items FROM public.products;

-- Query 5: Monthly Revenue Breakdown
-- SELECT TO_CHAR(order_date, 'Mon YYYY') AS month, SUM(total_amount) AS monthly_revenue, COUNT(*) AS orders_count
-- FROM public.orders WHERE status != 'Cancelled' GROUP BY TO_CHAR(order_date, 'Mon YYYY') ORDER BY MIN(order_date);

-- Query 6: Top Selling Products by Quantity
-- SELECT p.name, SUM(oi.quantity) AS total_sold, SUM(oi.quantity * oi.unit_price) AS total_revenue
-- FROM public.order_items oi
-- JOIN public.products p ON oi.product_id = p.id
-- GROUP BY p.name ORDER BY total_sold DESC;
