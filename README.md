# myParaOnline.tn — Parapharmacy E-Commerce Platform

A modern e-commerce platform for parapharmacy products, built with Next.js 16, Supabase, and Tailwind CSS. Shoppers browse the catalog and check out as guests — no account required — pay a flat delivery fee, and settle the total in cash when their order arrives. Administrators manage the catalog, orders, and customers through a dedicated, authenticated dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Admin Setup](#admin-setup)
- [Order & Payment Model](#order--payment-model)
- [Customization](#customization)
- [Deployment](#deployment)
- [API Routes](#api-routes)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## Features

### Customer Storefront

- **Guest checkout** — anyone can place an order by filling in shipping details. There is no customer login or signup.
- **Cash on delivery** — no online payment integration; customers pay the delivery courier when the order arrives.
- **Flat delivery fee** — an 8 DT delivery ("livraison") charge is added to every order and shown as its own line item in the cart and checkout summaries, so it's never a surprise at the door.
- **Product catalog** — browse active products by category, with a dedicated product details page (image, description, price, stock, add to cart).
- **Shopping cart** — add, update, and remove items, persisted locally in the browser (`localStorage`) for the duration of the visit.
- **Order confirmation** — a summary of the order, its ID, and the total due on delivery.
- **Multi-language UI** — English, French, and Arabic (with right-to-left layout support).
- **Add-to-cart toast** — a brief confirmation toast appears whenever an item is added to the cart.

### Admin Dashboard

- **Dashboard overview** — key store metrics at a glance.
- **Product management** — create, edit, and delete products, including image uploads to Supabase Storage.
- **Category management** — organize the catalog into categories.
- **Order management** — view orders and update their fulfillment status.
- **Customer overview** — a view of guest customers, derived from the orders they've placed.
- **Role-gated access** — the dashboard is only reachable by accounts flagged `is_admin` in the database; it is the only part of the application that requires signing in. It's also responsive — the sidebar collapses into an off-canvas drawer on phones.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (admin accounts only) |
| Storage | Supabase Storage (product images) |

## Project Structure

```
/app
  /admin                    # Admin dashboard (auth-gated, responsive)
    /layout.tsx              # Session check + off-canvas sidebar layout
    /login/page.tsx          # Admin sign-in — the only login in the app
    /page.tsx                # Dashboard overview
    /products/page.tsx       # Product management
    /categories/page.tsx     # Category management
    /orders/page.tsx         # Order management
    /customers/page.tsx      # Guest customer overview
  /admin-setup               # One-time admin bootstrap page
  /api/admin                 # Admin-only API routes (customers, setup, session check)
  /product/[id]               # Product details page
  /cart                      # Shopping cart (localStorage-backed, includes delivery fee)
  /checkout                  # Guest checkout flow
  /categories, /category     # Public catalog browsing
  /about                     # About page
  /layout.tsx                # Root layout
  /page.tsx                  # Homepage

/components
  /header.tsx                # Storefront navigation, with mobile menu
  /product-card.tsx          # Product display card
  /toast-provider.tsx        # Add-to-cart confirmation toasts
  /locale-provider.tsx       # EN/FR/AR translations
  /admin                     # Admin-specific components

/lib
  /cart.ts                   # Guest cart + delivery fee constant, persisted in localStorage
  /supabase.ts                # Browser Supabase client
  /supabase-server.ts          # Server-side Supabase client
  /supabase-admin.ts           # Service-role Supabase client (server only)
  /format.ts                   # Price formatting (TND)
  /utils.ts                    # Shared utilities

/supabase/migrations         # Versioned SQL migrations
```

## Database Schema

### Tables

| Table | Purpose |
|---|---|
| `categories` | Product categories |
| `products` | Product listings with pricing, stock, description, and images |
| `user_profiles` | Admin account metadata (`is_admin` flag) — no customer accounts exist |
| `orders` | Guest orders — `user_id` is always `null`; customer name, email, phone, and shipping address are stored directly on the order; `total` includes the flat delivery fee |
| `order_items` | Line items per order, with historical product name and price |

### Row-Level Security

- Public read access on `categories` and `products`.
- Anonymous clients may **insert** into `orders` and `order_items` (guest checkout), but cannot read them back — the confirmation screen relies on a client-generated order ID rather than a `select()` after insert, so guest orders are never exposed to the public API.
- All admin write access (products, categories, order status) is gated behind the `is_admin()` helper, backed by the `user_profiles.is_admin` flag.

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- `pnpm` (or your package manager of choice)

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Server-only — Settings → API → "service_role" secret key. Never expose to the browser.
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

Note: these are your **local** values only. A deployment platform (e.g. Vercel) needs the same variables configured separately in its own project settings — `.env.local` is never uploaded.

### Installation

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Build for production
pnpm build

# Start the production server
pnpm start
```

The application is available at `http://localhost:3000`.

## Admin Setup

There is no customer signup, and the storefront never creates an account — so admin accounts are provisioned out-of-band:

1. In the Supabase dashboard, go to **Authentication → Users** and add a new user with an email and password.
2. Visit `/admin-setup` and sign in with those same credentials — this flags the matching `user_profiles` row with `is_admin = true`.
3. Sign in at `/admin/login` to access the dashboard at `/admin`.

## Order & Payment Model

This storefront does not process online payments. Checkout collects shipping details, adds a flat **8 DT delivery fee** on top of the items subtotal, creates the order with `pending` status, and displays the total due. Payment is settled in cash with the delivery courier once the order arrives — a **cash-on-delivery (COD)** model. There is no sales tax in the checkout flow; the order total is items subtotal + the flat delivery fee.

## Customization

### Branding & Theme

The color palette, typography, and other design tokens are defined in `app/globals.css` and the Tailwind theme configuration.

### Delivery Fee

The flat delivery fee is a single constant, `DELIVERY_FEE`, exported from `lib/cart.ts` and used by both `app/cart/page.tsx` and `app/checkout/page.tsx`. Change it in one place to adjust it everywhere.

### Product Categories

Manage categories from the admin dashboard's category management section, or directly in the Supabase table editor.

## Deployment

### Vercel (recommended)

```bash
git push origin main
# Then deploy via the Vercel dashboard, or:
vercel deploy
```

### Other platforms

Ensure the following environment variables are configured on the platform itself (not just locally):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-only)

## API Routes

Most data operations go through Supabase client-side queries, secured by Row-Level Security. A small set of server API routes exist under `/api/admin` for operations that require the service-role key or a server-side admin check:

| Route | Purpose |
|---|---|
| `GET /api/admin/check` | Verifies the current session belongs to an admin |
| `GET /api/admin/customers` | Returns guest customers aggregated from `orders` |
| `POST /api/admin/setup` | Flags an existing Supabase Auth user as admin |

## Security Considerations

1. **Row-Level Security** — all table access is controlled at the database level, not just in application code.
2. **Admin-only authentication** — there are no customer accounts; the only sign-in flow in the app is for administrators.
3. **Guest order privacy** — guest orders can be inserted anonymously but not read back through the public API, preventing enumeration of customer data.
4. **Role-based admin access** — enforced via the `is_admin` flag and RLS, not just UI checks.
5. **Image uploads** — validated for file type and size, restricted to admin accounts.
6. **Resilient middleware** — session refresh failures (e.g. a missing environment variable on the deployment platform) are caught and logged rather than crashing every route.

## Troubleshooting

### Products not showing

- Confirm products exist with `is_active = true`.
- Verify RLS policies allow public `select` on `products`.

### Admin access denied

- Confirm the account has `is_admin = true` in `user_profiles`.
- Sign out and back in to refresh the session.
- Re-check RLS policies on admin-protected tables.

### Guest checkout fails

- Confirm the `orders_guest_insert` and `order_items_insert` RLS policies exist (see `supabase/migrations/20260809_guest_checkout.sql`).
- Check the browser console and Supabase logs for the specific RLS or validation error.

### Images not uploading

- Verify the `products` storage bucket exists and is public.
- Confirm the signed-in account has `is_admin = true`.

### Every page 500s in production

- This almost always means the deployment platform is missing the Supabase environment variables (see [Deployment](#deployment)) — they never come from `.env.local` automatically.

## License

This project is provided as-is for demonstration and learning purposes.
