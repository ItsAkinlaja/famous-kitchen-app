# Famous Kitchen

A food pre-ordering app for Famous Kitchen at NYSC Camp, Imo State. Built with Next.js 16, Supabase, and Resend.

## Features

- Browse menu with real-time availability
- Shopping cart with persistent state
- Manual payment via bank transfer + receipt upload
- Admin panel for order management, payment verification, menu management
- Email notifications (admin on new order, customer on confirmation)
- State code identification for quick corper lookup
- Rate limiting on uploads and order submission

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Email:** Resend
- **Image Hosting:** ImageKit
- **State Management:** Zustand (cart only)
- **Styling:** Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase account
- ImageKit account
- Resend account

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend
RESEND_API_KEY=re_your_api_key
ADMIN_EMAIL=your_admin_email@example.com

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
IMAGEKIT_PUBLIC_KEY=public_xxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxx
```

### Database Migration

Run this in your Supabase SQL editor:

```sql
ALTER TABLE orders ADD COLUMN state_code TEXT;
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment Checklist

### 🔴 Critical (Must Do)

- [ ] **Verify Resend domain** — Add your domain on Resend dashboard
- [ ] Update `src/lib/email.ts` lines 157 & 315: change sender from `onboarding@resend.dev` to `orders@yourdomain.com`
- [ ] Run database migration (add `state_code` column to `orders` table)
- [ ] Set all environment variables in production
- [ ] Create admin user via Supabase Auth dashboard

### 🟡 Recommended

- [ ] Set up Supabase RLS policies for `menu_items` and `settings` tables (restrict write to authenticated users only)
- [ ] Add custom domain to ImageKit
- [ ] Enable Supabase email auth rate limiting
- [ ] Test email delivery to common providers (Gmail, Yahoo, Outlook)

### 🟢 Optional

- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN caching rules
- [ ] Add analytics (Vercel Analytics, Plausible)

## Project Structure

```
src/
├── app/
│   ├── (customer)/         # Customer-facing routes (menu, checkout, etc.)
│   ├── admin/              # Admin panel routes
│   └── api/                # API routes (orders, uploads)
├── components/
│   ├── admin/              # Admin components
│   ├── cart/               # Cart UI
│   ├── checkout/           # Checkout form & receipt upload
│   ├── layout/             # Header, Footer, MobileCartBar
│   ├── menu/               # Menu grid & item cards
│   └── ui/                 # Shared UI components
├── lib/
│   ├── email.ts            # Resend email helpers
│   ├── imagekit.ts         # ImageKit upload helpers
│   ├── rateLimit.ts        # In-memory rate limiter
│   ├── settings.ts         # Settings parser
│   ├── supabase/           # Supabase clients & middleware
│   ├── utils.ts            # cn() utility
│   └── validations.ts      # Form validation
├── store/
│   └── cart.ts             # Zustand cart store
└── types/
    └── index.ts            # TypeScript types

```

## Admin Panel

Access at `/admin` after creating an admin user in Supabase Auth.

**Features:**
- View all orders with status badges
- Verify/reject payments
- Update order status (triggers customer email on "confirmed")
- Manage menu items (add, edit, toggle availability)
- Update business settings

## Customer Flow

1. Browse menu at `/menu`
2. Add items to cart
3. Fill out checkout form (name, phone, email, **state code**, delivery/pickup)
4. Transfer payment to OPay account shown
5. Upload receipt screenshot
6. Submit order → admin receives email
7. Admin verifies payment → sets status to "confirmed"
8. Customer receives confirmation email
9. Admin sets status to "ready" → customer picks up or receives delivery

## Security

- Rate limiting on orders (5/15min) and uploads (10/10min) per IP
- Receipt URLs validated as ImageKit domain
- Order confirmation endpoint strips PII
- Admin routes protected by Supabase auth middleware
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Admin login brute-force protection (5 attempts per 15 min)

## Known Limitations

- No user accounts for customers (intentional — 3-week corper stay)
- Manual payment verification (no OPay API integration)
- In-memory rate limiting (resets per serverless function cold start)
- No pagination on admin orders table (add when > 100 orders)

## License

Proprietary — Famous Kitchen, Imo State NYSC Camp

## Developer

Designed & developed by [Akinlaja Timileyin](https://www.akinlajatimileyin.dev)
