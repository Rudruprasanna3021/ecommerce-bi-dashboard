# ShopPulse BI — E-Commerce Business Intelligence Dashboard

A complete, beginner-friendly Business Intelligence (BI) dashboard website for college project demonstration.

## 🚀 Technology Stack
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Charts & Data Visualizations:** Recharts
- **Icons:** Lucide React
- **Backend & Database:** Supabase (Managed PostgreSQL)
- **Authentication:** Supabase Auth (JWT with Row Level Security)
- **Deployment Ready:** Vercel

---

## 📁 Project Structure

```text
ecommerce-bi-dashboard/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmModal.tsx     # Reusable delete confirmation modal
│   │   │   ├── LoadingSpinner.tsx   # Spinners and skeleton table loaders
│   │   │   └── Modal.tsx            # Clean modal dialog wrapper
│   │   └── layout/
│   │       ├── Navbar.tsx           # Top navigation bar, status, refresh
│   │       └── Sidebar.tsx          # Brand, navigation links, user session
│   ├── context/
│   │   ├── AuthContext.tsx          # Supabase Auth provider + Demo login
│   │   └── DataContext.tsx          # Real Supabase CRUD + offline fallback
│   ├── lib/
│   │   ├── mockData.ts              # Pre-loaded initial store datasets
│   │   └── supabase.ts              # Supabase client singleton
│   ├── pages/
│   │   ├── LoginPage.tsx            # Supabase Auth email/password login
│   │   ├── DashboardPage.tsx        # 4 KPI cards, mini charts, alerts
│   │   ├── SalesAnalyticsPage.tsx   # Recharts monthly sales & order trends
│   │   ├── ProductsPage.tsx         # Product catalog CRUD with modals
│   │   ├── CategoriesPage.tsx       # Category taxonomy CRUD with checks
│   │   ├── CustomersPage.tsx        # Customer accounts and registration logs
│   │   ├── OrdersPage.tsx           # Order fulfillment tracking & itemized receipts
│   │   └── ReportsPage.tsx          # Date-filtered sales audits & CSV export
│   ├── types/
│   │   └── database.ts              # TypeScript interfaces matching schema
│   ├── App.tsx                      # Application shell & routing
│   ├── index.css                    # Tailwind CSS directives
│   └── main.tsx                     # React root bootstrap
├── supabase_schema.sql              # Complete PostgreSQL schema, RLS & seed data
├── tailwind.config.js               # Tailwind design system configuration
├── postcss.config.js                # PostCSS configuration
├── package.json                     # Project manifest and scripts
└── .env.example                     # Environment variables template
```

---

## 🛠️ How to Run Locally

1. Open PowerShell or Terminal in the project folder:
   ```powershell
   cd C:\Users\prasa\Downloads\ecommerce-bi-dashboard
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

3. Open your browser at the displayed local URL (typically `http://localhost:5173`).
