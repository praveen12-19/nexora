# NEXORA COLLECTION

> **"Discover Your Style. Shop Your Favorites."**
> A complete, production-minded fashion discovery and Meesho affiliate marketing platform.

---

## 1. Project Overview

**Nexora Collection** is a curated fashion discovery and affiliate shopping platform focused on modern Men's and Women's fashion.

### Business & Discovery Model
1. High-aesthetic fashion looks are published on Instagram, YouTube Shorts, and Facebook.
2. Visitors arrive at Nexora Collection to discover curated looks, seasonal capsules, and viral items.
3. Visitors browse fashion collections, high-definition editorial imagery, product details, and styling notes.
4. Visitors click **"Buy on Meesho"** and are securely redirected to the exact Meesho affiliate product URL.
5. Purchases completed on Meesho generate affiliate commissions for the site owner.

> **Note on E-Commerce Boundaries**:
> Nexora Collection is purely a discovery and curation platform. It intentionally contains no checkout, payment gateways, customer cart processing, or order fulfillment. Order fulfillment, shipping, and customer care are handled directly by Meesho.

---

## 2. Technology Stack

- **Frontend Core**: React 18, Vite, TypeScript, Tailwind CSS
- **Routing**: React Router DOM (v6) with full client-side SPA routing (`vercel.json` rewrites)
- **Icons & Styling**: Lucide React, Google Fonts (`Cinzel`, `Plus Jakarta Sans`)
- **Backend Services**:
  - **Supabase Authentication**: Secure admin verification
  - **Supabase PostgreSQL Database**: Products, visitor sessions, and analytics tables
  - **Supabase Row Level Security (RLS)**: Public read for active products; strict admin-only write permissions
  - **Supabase Edge Functions**: Deno runtime for `cloudinary-signature` generation and `track-event` ingestion
- **Image Pipeline**: Cloudinary CDN with responsive transformations, WebP/AVIF auto-format, and direct client uploads
- **Deployment**: Vercel SPA configuration

---

## 3. Key Features

### A. Customer-Facing Discovery Website
- **Home Page (`/`)**:
  - Luxury editorial announcement bar and hero banner
  - Interactive "Shop By Category" pills
  - Curated "Trending Collections" (Men's & Women's Fashion capsules)
  - Handpicked "Featured Discoveries"
  - Fresh "New Arrivals"
  - Dedicated Men's and Women's fashion showcases
  - "As Seen On Instagram & YouTube" social reels showcase
  - Brand story and trust pillars
  - Luxury footer with FTC-compliant affiliate disclosures
- **Shop Page (`/shop`)**:
  - Full product catalog with real-time text search
  - Filter by category (Shirts, Dresses, Kurtis, Office Wear, Casual Wear, Jewelry, etc.)
  - Gender selector (All, Men, Women)
  - Filter toggles for "Featured" and "Trending"
  - Sort by Newest, Price (Low to High), and Price (High to Low)
  - Mobile filter drawer
- **Collections Page (`/collections`)**:
  - Curated fashion capsules: Men's Fashion, Women's Fashion, Casual Wear, Office Wear, Party Wear, Everyday Essentials, Trending Fashion, Budget Fashion (< ₹999), Shirts, Dresses, Kurtis, Accessories
  - Interactive collection switcher with dynamic product updates
- **Product Details Page (`/product/:id`)**:
  - Multi-image gallery with thumbnail selection and zoom
  - Price, original MRP, and auto-calculated discount % badge
  - Category, gender, and status badges
  - **"Buy on Meesho" Action Button**: Opens the affiliate URL in a new tab (`target="_blank" rel="noopener noreferrer"`)
  - Prominent affiliate disclosure statement
  - One-click copy product link to share
  - Related items recommendation grid
- **Wishlist Page (`/wishlist`)**:
  - LocalStorage-backed wishlist (persists across reloads without requiring customer login)
  - Heart icon toggle on all cards
  - Real-time badge counter in navigation bar
- **About Page (`/about`)**:
  - Brand story, curation principles, and affiliate transparency commitment
- **Contact Page (`/contact`)**:
  - Official social links (Instagram, YouTube, Facebook), contact email placeholder, creator collaboration form, and Meesho order FAQ

---

### B. Hidden Admin Login & Dashboard

Nexora Collection maintains a clean, editorial look for customers by **excluding public admin login buttons**.

#### Access Shortcuts:
- **Desktop**: Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac) anywhere on the website.
- **Mobile**: Tap the **"NEXORA"** brand logo 5 times in rapid succession (within 3 seconds).
- **Behavior**: Opens the Admin Login Modal as an in-place overlay **without changing the browser URL**.

#### Admin Dashboard Sections:
1. **Overview**: Real-time KPI summary cards (Total Products, Active Live, Total Visits, Unique Visitors, Product Views, Meesho Clicks) and recent catalog preview.
2. **Product Management**:
   - Complete CRUD (Add, Edit, Delete with confirmation)
   - Real-time search and category filtering
   - Quick one-click status toggles for `Active` (live vs hidden), `Featured`, and `Trending`
   - Direct affiliate link testing
3. **Product Form (`Add / Edit`)**:
   - Validates name, description, price, optional MRP, category, gender, and Meesho URL
   - **Cloudinary Image Upload**: Multi-image file uploader, URL pasting, preview thumbnails, and cover selector
4. **Analytics & Traffic Dashboard**:
   - Date range filters: `Today`, `7 Days`, `30 Days`, `All Time`
   - Metric summary cards (Sessions, Unique Visitors, Views, Clicks, Conversion CTR %)
   - Outbound Meesho click performance and top viewed products
   - Category performance breakdown
   - Aggregated Product Performance table
5. **Categories**: Overview of product counts by category and gender breakdown.
6. **System Settings**: Live Supabase and Cloudinary connectivity monitor, security checklist, and shortcut guide.
7. **Logout**: Safely destroys admin session and returns to customer view.

---

### C. Privacy-Preserving Analytics & Visitor Tracking
- **Unique Visitors**: Tracked via an anonymous random UUID stored in `localStorage`. No browser fingerprinting or PII collected.
- **Sessions & Visits**: Managed with a 30-minute inactivity sliding window in `sessionStorage`. Page refreshes do not inflate total visit counts.
- **Tracked Events**:
  - `page_view`: Route changes
  - `product_view`: Product details page impressions
  - `product_click`: Catalog card clicks
  - `affiliate_click`: "Buy on Meesho" outbound redirects
- **Admin Exclusion**: All actions by the logged-in administrator are automatically omitted from analytics tracking.
- **Aggregations**: Database aggregation functions compute sums and group-bys on the PostgreSQL server, eliminating the need to download raw event records into React.

---

## 4. Environment Setup

Create a `.env` file in the project root:

```bash
# Supabase Configuration (from Supabase Dashboard -> Project Settings -> API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Cloudinary Configuration (from Cloudinary Dashboard)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name

# (Optional) For unsigned uploads if not using Supabase Edge Functions:
# VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **Sandbox / Offline Fallback**:
> If Supabase credentials are not provided, Nexora Collection runs in local preview mode. You can log in using:
> - **Email**: `admin@nexoracollection.com`
> - **Password**: `NexoraAdmin2026!`
> All product modifications, image additions, and analytics are persisted to browser local storage.

---

## 5. Supabase Database & Security Setup

### 1. Run Database Migrations
Open your Supabase Project -> **SQL Editor**, and execute the migration script located at:
`supabase/migrations/20261115000000_initial_schema.sql`

This script creates:
- `admin_users` table
- `products` table
- `visitor_sessions` table
- `analytics_events` table
- Performance indexes on categories, gender, active, and timestamps
- Row Level Security (RLS) policies (public read for active products; admin-only writes)
- `get_analytics_summary()` and `get_product_performance()` RPC aggregation functions

### 2. Create the Initial Admin User
1. Go to Supabase Dashboard -> **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email and a strong password (e.g., `admin@yourdomain.com`).
4. Copy the generated User **UUID** (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
5. Go to Supabase **SQL Editor** and authorize this user in `admin_users`:
   ```sql
   INSERT INTO public.admin_users (id, role)
   VALUES ('YOUR_USER_UUID_HERE', 'superadmin');
   ```

---

## 6. Cloudinary & Edge Functions Configuration

### 1. Cloudinary Credentials
In Supabase Dashboard -> **Edge Functions** -> **Secrets**, set:
- `CLOUDINARY_CLOUD_NAME`: your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: your Cloudinary API key
- `CLOUDINARY_API_SECRET`: your Cloudinary API secret
- `SUPABASE_SERVICE_ROLE_KEY`: your Supabase service role key

### 2. Deploy Edge Functions
Using the Supabase CLI:
```bash
# Deploy Cloudinary signature generator
supabase functions deploy cloudinary-signature --no-verify-jwt

# Deploy Analytics event ingestion
supabase functions deploy track-event --no-verify-jwt
```

---

## 7. Local Development & Production Build

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 8. Vercel Deployment Instructions

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your `nexora-collection` GitHub repository.
4. Framework Preset: **Vite**.
5. Root Directory: `./`.
6. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET` (optional)
7. Click **Deploy**.
8. `vercel.json` will automatically configure SPA client routing for all sub-paths (`/shop`, `/collections`, `/product/:id`, `/wishlist`, etc.).

---

## 9. Admin Guide: Adding & Managing Products

1. Navigate to your deployed Nexora Collection website.
2. Press `Ctrl + Shift + A` on your keyboard (or tap the logo 5 times on mobile).
3. Sign in with your Supabase Admin credentials.
4. Click **Add New Product**.
5. Fill in the product details:
   - **Name**: e.g., "Tailored Linen Mandarin Collar Shirt"
   - **Description**: Fabric, fit, styling advice
   - **Price**: Selling price on Meesho (e.g., 899)
   - **MRP**: Original retail price for discount calculation (e.g., 1899)
   - **Category**: Select or enter a category
   - **Gender**: Men / Women / Unisex
   - **Images**: Click "Upload Image Files" to upload directly to Cloudinary, or paste an image URL
   - **Meesho Affiliate URL**: Paste your specific affiliate tracking link
   - **Flags**: Toggle Active, Featured, and Trending
6. Click **Create Product**.
7. The new piece appears immediately in the catalog for all visitors!

---

## 10. License & Compliance
Nexora Collection is built for fashion discovery and affiliate marketing. All trademarks and brand names are property of their respective owners. External purchases and orders are fulfilled independently by Meesho.
