# EcoHelp — B2B Near-Expiry Inventory Marketplace & Sustainable Commerce Platform

> **Tagline:** *"Connecting Near-Expiry Inventory. Creating Value. Reducing Waste."*  
> **Mission:** *"Give Products a Second Chance."*

EcoHelp is a production-grade commercial web platform connecting manufacturers, national distributors, supermarket chains, independent retailers, and buyers. It turns near-expiry inventory into liquidity, reduces landfill waste, and provides high-margin discounted stock before products lose commercial value.

---

## 🚀 Quick Deployment Guide (GitHub + Vercel)

### Option A: Deploy to Vercel (Recommended)
1. Push this repository to your GitHub account.
2. In [Vercel](https://vercel.com/), click **Add New Project** and select your EcoHelp repository.
3. In the project **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
4. Click **Deploy**. Vercel will build and publish your project with instant global CDN caching and SPA rewrite support (configured in `vercel.json`).

### Option B: Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
copy .env.example .env.local

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🗄️ Supabase Backend Setup

EcoHelp is fully integrated with Supabase for Authentication, PostgreSQL Relational Database, Row Level Security (RLS), and Cloud Storage.

### Step 1: Create Supabase Project
1. Log in to [Supabase](https://supabase.com/) and create a new project.
2. Note your **Project URL** and **anon public key** from `Project Settings -> API`.

### Step 2: Run Database Schema
1. In your Supabase Dashboard, go to the **SQL Editor**.
2. Open the file [`supabase/schema.sql`](./supabase/schema.sql) included in this repository.
3. Paste the entire SQL script and click **Run**.
4. This script automatically:
   - Creates the `profiles`, `products`, `orders`, `order_items`, and `notifications` tables.
   - Configures strict **Row Level Security (RLS)** policies ensuring user-specific data isolation.
   - Creates the `product-images` storage bucket with public read and authenticated write access.
   - Creates the automated database trigger `handle_new_user()` to automatically synchronize authentication signups with user profiles.

---

## 🎨 Brand Identity & Final Color Palette

| Color Element | Hex Code | Purpose in EcoHelp |
| :--- | :--- | :--- |
| **Deep Teal** | `#174B4A` | Navigation bar, headings, main buttons, footer, and brand typography |
| **Sage Mint** | `#B9D9C8` | Product & dashboard cards, badges, subtle accent backgrounds |
| **Warm Sand** | `#F3EBDD` | Dominant website background, page layouts, and modal backdrops |
| **Soft Turquoise** | `#65C6C0` | Primary buttons, action CTAs, interactive highlights |
| **Light Ocean Blue**| `#A9DCEB` | Secondary category tabs, informational cards, and badges |
| **Charcoal** | `#26383B` | Body text, descriptions, technical specs, and form labels |

---

## 📦 Core Feature Modules

1. **Apple-Inspired Homepage:**
   - 3D visual storytelling explaining the entire circulation model (Distributors → Marketplace → Buyers → Sustainable Future).
   - Clear distinction between **Want to Sell?** and **Want to Buy?**.
   - 4-step pipeline: *List Your Products* → *Connect with Buyers* → *Complete the Sale* → *Build a Greener Future*.
   - Live **Featured Near-Expiry Products** grid with real-time countdown badges.

2. **Role-Based Authentication & Accounts:**
   - Supports 4 business & consumer categories + Admin:
     1. **Distributor** (bulk wholesale lots, warehouse dispatch)
     2. **Retailer – Seller** (store excess clearance, batch expiry monitoring)
     3. **Retailer – Buyer** (discount procurement, order tracking)
     4. **Consumer / Household Buyer** (kitchen flash deals, household savings)
     5. **Platform Administrator** (statutory compliance, FSSAI verification desk)
   - 1-click **Demo Role Switcher** in header to test any role instantly.

3. **Product Listing & Cloud Image Upload ("Sell Here"):**
   - Category-adaptive sample images for 1-click selection.
   - Actual photograph drag-and-drop / file picker with direct upload to Supabase Storage bucket `product-images`.
   - Strict food safety validations: prevents expired products from being listed, enforces discount price < original price.

4. **Dynamic Marketplace & Search/Filters:**
   - Search across product titles, brands, and batch numbers.
   - Multi-criteria filters: Category pills, Shelf-life urgency (≤7d, ≤15d, ≤30d), Discount % (20%+, 40%+, 50%+), Max price slider, Storage condition, and Seller filter.
   - Sorting by Expiry Date (Soonest first), Price, Discount, and Latest Listed.

5. **Checkout & Fulfillment (With Exit Button):**
   - Top-right `[X]` exit button allowing users to cancel or leave checkout anytime without being forced to purchase.
   - Exactly two delivery modes:
     1. **Deliver to Your Address** (temperature-controlled transit logistics).
     2. **Warehouse Pickup** (zero delivery fee, depot loading bay slot).
   - Order tracking references generated (e.g. `ECO-2026-9810`).

6. **Role-Based Dashboards:**
   - **Seller Dashboard:** Live stock, nearing-expiry warnings, total revenue, inventory table, and order fulfillment actions (`Accept`, `Reject`, `Mark Processing`, `Mark Completed`).
   - **Buyer Dashboard:** 4-step progress tracker, purchase receipts, pickup codes, and lifetime savings.
   - **Distributor Dashboard:** Pallet lots, warehouse dispatches, and wholesale logistics.
   - **Consumer Dashboard:** Household flash deals, budget savings tracker, and green points.
   - **Admin Dashboard:** FSSAI compliance review queue (`Approve & Verify` / `Revoke Badge`), catalog moderation, and platform transaction audit.

---

## 🔒 Security & Code Standards

- **No Private Keys Exposed:** Only public `VITE_SUPABASE_ANON_KEY` is referenced in frontend code. Service role keys are never included.
- **Row Level Security (RLS):** All tables have RLS enabled with strict policies.
- **Offline/Demo Resilience:** If Supabase environment variables are omitted, EcoHelp gracefully falls back to persistent local storage with realistic FMCG seed data.
- **TypeScript:** Strict type checking across all components, interfaces, and operations.

---

## 📄 License

© 2026 EcoHelp Technologies Ltd. All rights reserved.
