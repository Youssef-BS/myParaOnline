# HealthHub - Premium Parapharmacy E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 16, Supabase, and Tailwind CSS. This platform allows customers to browse and purchase parapharmacy products while providing administrators with comprehensive management tools.

## Features

### Customer Storefront
- **Modern Homepage**: Hero section with product categories and featured products
- **Product Catalog**: Browse active products with prices and availability
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure email/password signup and login
- **Checkout Flow**: Complete order form with address collection
- **Order Confirmation**: Order summary with tracking information

### Admin Dashboard
- **Dashboard Overview**: Real-time statistics and metrics
- **Product Management**: Create, edit, and delete products with image uploads to Supabase Storage
- **Category Management**: Organize products by categories
- **Order Management**: View and manage customer orders with status tracking
- **Customer Management**: Monitor registered users and their information

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for product images)
- **State Management**: React hooks with Supabase client

## Project Structure

```
/app
  /admin                    # Admin panel routes
    /layout.tsx            # Admin layout with sidebar
    /page.tsx              # Admin dashboard
    /products/page.tsx     # Product management
    /orders/page.tsx       # Order management
    /customers/page.tsx    # Customer management
  /login                    # Login page
  /signup                   # Signup page
  /cart                     # Shopping cart
  /checkout                 # Checkout page
  /layout.tsx              # Root layout
  /page.tsx                # Homepage/product listing

/components
  /header.tsx              # Navigation header
  /product-card.tsx        # Product display card
  /admin
    /product-form.tsx      # Product creation/editing form

/lib
  /supabase.ts            # Browser Supabase client
  /supabase-server.ts     # Server-side Supabase client
  /utils.ts               # Utility functions
```

## Database Schema

### Tables
- **categories**: Product categories
- **products**: Product listings with pricing and stock
- **user_profiles**: Extended user information
- **orders**: Customer orders with status tracking
- **order_items**: Line items for orders
- **carts**: Shopping cart items

### Security
- Row-Level Security (RLS) policies on all tables
- Public read access for product/category listings
- Authenticated users can only access their own orders and cart
- Admin-only access to management functions

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account with a project created
- Environment variables configured

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The application will be available at `http://localhost:3000`

## Admin Setup

To create an admin user:

1. Create a new user account through the signup page
2. In Supabase, navigate to the `user_profiles` table
3. Find the user you just created and set `is_admin` to `true`
4. Log out and log back in
5. You'll now have access to the admin dashboard at `/admin`

## Key Features Implementation

### Product Image Upload
- Images are uploaded to Supabase Storage in the `products` bucket
- Bucket is configured for public read access
- URLs are stored in the products table for display

### Shopping Cart
- Client-side cart stored in Supabase database
- Persists across sessions
- Tracks user_id and product associations with quantity

### Order Processing
- Orders are created with pending status
- Payment status defaults to pending (demo mode - no actual payment processing)
- Order items link back to products for historical pricing
- Orders include shipping address information

### Admin Authorization
- Checked via `user_profiles.is_admin` flag
- Middleware-level protection in admin layout
- RLS policies enforce role-based database access

## Customization

### Colors & Branding
The design uses a green/teal color scheme for health/wellness emphasis. Customize in:
- Tailwind theme configuration
- Component color classes
- SVG/icon colors

### Product Categories
Add custom categories in the Supabase admin panel or through the admin dashboard's category management section.

### Pricing & Tax
Current tax calculation is fixed at 10%. Modify in `/app/cart/page.tsx` and `/app/checkout/page.tsx` as needed.

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# Environment variables automatically configured
vercel deploy
```

### Other Platforms
Ensure the following environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## API Routes

All data operations use Supabase client-side queries with RLS. No dedicated API routes are required - the Supabase REST API handles all database operations securely.

## Security Considerations

1. **RLS Policies**: All table access is controlled via Row-Level Security
2. **Authentication**: Email/password auth with secure session management
3. **Admin Access**: Role-based via `is_admin` flag with RLS enforcement
4. **Input Validation**: Form validation on client side
5. **Image Upload**: File type validation and size limits

## Future Enhancements

- Real payment processing integration (Stripe)
- Email notifications for orders
- Product reviews and ratings
- Wishlist functionality
- Email marketing integration
- Analytics dashboard
- Inventory alerts
- Multi-language support

## Troubleshooting

### Products not showing
- Ensure products exist in the database with `is_active = true`
- Check that the `products` table has an `is_active` column
- Verify RLS policies allow public read access

### Admin access denied
- Verify user has `is_admin = true` in `user_profiles` table
- Try logging out and back in to refresh session
- Check RLS policies on admin-protected tables

### Images not uploading
- Verify `products` bucket exists in Supabase Storage
- Check bucket is set to public
- Ensure user has admin role for upload permissions

## Support

For issues or questions:
1. Check Supabase logs in the dashboard
2. Review browser console for client-side errors
3. Check Next.js dev server logs for compilation errors
4. Verify all environment variables are correctly set

## License

This project is provided as-is for demonstration and learning purposes.
