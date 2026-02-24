# 🌴 Loga Guest House — Boutique Hotel Website

**A production-ready, full-stack guest house booking website for Sri Lanka.**

Built with: **Next.js 16 (App Router) · TailwindCSS · Supabase · Vercel**

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd loga
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Fill in your Supabase, Stripe, Resend keys
```

### 3. Set up Supabase database
Go to **Supabase → SQL Editor** and run:
```
supabase/schema.sql
```

### 4. Run development server
```bash
npm run dev
# → http://localhost:3000
```

---

## 🗂️ Project Structure

```
loga/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── rooms/              # Rooms listing + [slug] detail
│   │   ├── booking/            # Multi-step checkout
│   │   ├── blog/               # Blog listing + [slug] post
│   │   ├── gallery/            # Photo gallery
│   │   ├── experiences/        # Sri Lanka attractions
│   │   ├── contact/            # Contact form + WhatsApp
│   │   ├── dashboard/          # Guest booking dashboard
│   │   ├── admin/              # Admin panel (role-protected)
│   │   ├── auth/               # Login / Register / OAuth callback
│   │   └── api/                # API routes
│   │       ├── rooms/          # GET rooms, GET [slug]
│   │       ├── bookings/       # POST create, GET/PATCH/DELETE [id]
│   │       ├── availability/   # GET blocked dates
│   │       ├── pricing/        # GET price breakdown + coupon validate
│   │       ├── reviews/        # GET/POST reviews
│   │       ├── email/          # POST send transactional email
│   │       └── webhooks/stripe/# Stripe payment webhook
│   ├── components/
│   │   ├── atoms/              # Button, Badge, Input, StarRating
│   │   ├── molecules/          # RoomCard, BlogCard, ReviewCard, BookingWidget
│   │   └── organisms/          # Navbar, Footer, HeroSection, ChatbotWidget, WhatsAppButton, AdminSidebar
│   ├── lib/
│   │   ├── booking.ts          # Core booking logic (availability, pricing, create, cancel)
│   │   ├── currency.ts         # Multi-currency formatting
│   │   ├── utils.ts            # cn(), formatDate, slugify, etc.
│   │   └── supabase/           # Server + client Supabase clients
│   └── types/                  # TypeScript interfaces
├── supabase/
│   └── schema.sql              # Full DB schema + RLS + seeds
├── .env.local.example          # Environment variable template
├── next.config.ts              # Next.js config (images, headers, redirects)
├── tailwind.config.ts          # Design system tokens
└── vercel.json                 # Vercel deployment config
```

---

## 🌐 Pages

| Route | Description |
|-------|-------------|
| `/` | Hero + amenities + featured rooms + reviews + CTA |
| `/rooms` | Room listing with category/guest/price filters |
| `/rooms/[slug]` | Room detail with gallery, amenities, booking sidebar |
| `/booking` | 3-step checkout (Review → Details → Payment) |
| `/blog` | Travel blog listing by category |
| `/blog/[slug]` | Blog post with schema markup |
| `/experiences` | Sri Lanka attractions with Google Maps |
| `/gallery` | Masonry photo gallery |
| `/contact` | WhatsApp + form + map |
| `/dashboard` | Guest booking management |
| `/admin` | Admin dashboard with analytics |
| `/admin/rooms` | Room CRUD management |
| `/admin/bookings` | All bookings table |
| `/auth/login` | Login with email or Google OAuth |
| `/auth/register` | Registration |

---

## ⚙️ Environment Variables

See `.env.local.example` for all required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://logaguesthouse.lk
NEXT_PUBLIC_PHONE_NUMBER=+94771234567
NEXT_PUBLIC_WHATSAPP_NUMBER=94771234567
NEXT_PUBLIC_EMAIL=hello@logaguesthouse.lk
RESEND_API_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

---

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql`
3. Set your first admin user:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
   ```
4. Enable **Email Auth** + **Google OAuth** in Supabase Auth settings

---

## 💳 Payment Setup

### Stripe
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

### PayHere (Sri Lanka)
Add your PayHere merchant credentials when ready (see `/api/webhooks/` directory).

---

## 📧 Email Setup (Resend)

1. Create account at [resend.com](https://resend.com)
2. Add your domain and get `RESEND_API_KEY`
3. Update `RESEND_FROM_EMAIL` to your verified domain

---

## 🚀 Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard
# Settings → Environment Variables → add all from .env.local.example
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary | Ocean Blue `#0B3D6B` |
| Secondary | Sand Beige `#C9A96E` |
| Accent | Palm Green `#2D6A4F` |
| Background | Coconut `#FAF7F2` |
| Heading Font | Cormorant Garamond (serif) |
| Body Font | DM Sans |
| Border Radius | xl: 12px, 2xl: 20px, 3xl: 32px |

---

## 🔒 Security

- Supabase Row-Level Security (RLS) on all tables
- Server-side auth checks for protected routes
- Admin role gate on `/admin` layout
- Stripe webhook signature verification
- Security headers (X-Frame-Options, X-Content-Type-Options)
- Environment variables never exposed to client

---

Made with ❤️ for Loga Guest House, Sri Lanka 🌴
