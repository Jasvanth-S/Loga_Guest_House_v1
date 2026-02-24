-- ============================================================
-- LOGA GUEST HOUSE — Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL editor to initialize all tables,
-- indexes, RLS policies, triggers, and seed data.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── ENUMS ──────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('guest', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid', 'refunded');
CREATE TYPE room_category AS ENUM ('Standard', 'Deluxe', 'Family', 'Suite');
CREATE TYPE currency AS ENUM ('LKR', 'USD', 'EUR');
CREATE TYPE payment_type AS ENUM ('partial', 'full');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE blog_category AS ENUM (
  'Travel Guide', 'Sri Lanka Tips', 'Local Experiences',
  'Wellness', 'Food & Culture', 'News'
);

-- ─── USERS (extends auth.users) ─────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL,
  phone       TEXT,
  role        user_role NOT NULL DEFAULT 'guest',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- ─── ROOMS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.rooms (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  category         room_category NOT NULL DEFAULT 'Standard',
  description      TEXT NOT NULL DEFAULT '',
  price_lkr        NUMERIC(10,2) NOT NULL,
  price_usd        NUMERIC(10,2) NOT NULL,
  max_guests       INTEGER NOT NULL DEFAULT 2,
  amenities        JSONB NOT NULL DEFAULT '[]',
  cover_image      TEXT NOT NULL DEFAULT '',
  gallery          JSONB NOT NULL DEFAULT '[]',
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  wifi_speed       TEXT,
  has_ac           BOOLEAN NOT NULL DEFAULT TRUE,
  has_power_backup BOOLEAN NOT NULL DEFAULT TRUE,
  eco_friendly     BOOLEAN NOT NULL DEFAULT FALSE,
  beach_tag        BOOLEAN NOT NULL DEFAULT FALSE,
  hill_tag         BOOLEAN NOT NULL DEFAULT FALSE,
  min_stay_nights  INTEGER NOT NULL DEFAULT 1,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_slug ON public.rooms(slug);
CREATE INDEX idx_rooms_active ON public.rooms(is_active);
CREATE INDEX idx_rooms_category ON public.rooms(category);

-- ─── BOOKINGS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bookings (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  room_id            UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  check_in           DATE NOT NULL,
  check_out          DATE NOT NULL,
  guests             INTEGER NOT NULL DEFAULT 1,
  total_price        NUMERIC(12,2) NOT NULL,
  currency           currency NOT NULL DEFAULT 'USD',
  payment_status     payment_status NOT NULL DEFAULT 'unpaid',
  booking_status     booking_status NOT NULL DEFAULT 'pending',
  payment_type       payment_type NOT NULL DEFAULT 'full',
  amount_paid        NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount         NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
  coupon_code        TEXT,
  whatsapp_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  special_requests   TEXT,
  stripe_payment_intent_id TEXT,
  cancellation_reason TEXT,
  cancelled_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT bookings_dates_check CHECK (check_out > check_in),
  CONSTRAINT bookings_guests_check CHECK (guests > 0)
);

-- Prevent double bookings: no overlapping confirmed/pending bookings for same room
CREATE UNIQUE INDEX idx_bookings_no_overlap
  ON public.bookings (room_id, check_in, check_out)
  WHERE booking_status IN ('pending', 'confirmed');

CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_room ON public.bookings(room_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);

-- ─── SEASONAL PRICING ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.seasonal_pricing (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  multiplier  NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  label       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT seasonal_dates_check CHECK (end_date >= start_date),
  CONSTRAINT multiplier_check CHECK (multiplier > 0 AND multiplier <= 5)
);

CREATE INDEX idx_seasonal_dates ON public.seasonal_pricing(start_date, end_date);

-- ─── REVIEWS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_id     UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating      INTEGER NOT NULL,
  comment     TEXT NOT NULL,
  images      JSONB NOT NULL DEFAULT '[]',
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT one_review_per_booking UNIQUE (booking_id)
);

CREATE INDEX idx_reviews_room ON public.reviews(room_id);
CREATE INDEX idx_reviews_approved ON public.reviews(is_approved);

-- ─── BLOG POSTS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  content          TEXT NOT NULL DEFAULT '',
  excerpt          TEXT,
  cover_image      TEXT NOT NULL DEFAULT '',
  seo_title        TEXT,
  meta_description TEXT,
  category         blog_category NOT NULL DEFAULT 'Travel Guide',
  author_id        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_published ON public.blog_posts(is_published);
CREATE INDEX idx_blog_category ON public.blog_posts(category);

-- Full-text search index
CREATE INDEX idx_blog_fts ON public.blog_posts
  USING GIN(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')));

-- ─── ADD-ON SERVICES ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.add_on_services (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  price_lkr    NUMERIC(10,2) NOT NULL,
  price_usd    NUMERIC(10,2) NOT NULL,
  icon         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BOOKING ADD-ONS (junction) ──────────────────────────────

CREATE TABLE IF NOT EXISTS public.booking_addons (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id        UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  add_on_id         UUID NOT NULL REFERENCES public.add_on_services(id) ON DELETE RESTRICT,
  quantity          INTEGER NOT NULL DEFAULT 1,
  price_at_booking  NUMERIC(10,2) NOT NULL,

  CONSTRAINT booking_addon_unique UNIQUE (booking_id, add_on_id)
);

CREATE INDEX idx_booking_addons_booking ON public.booking_addons(booking_id);

-- ─── COUPONS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.coupons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT NOT NULL UNIQUE,
  discount_type   discount_type NOT NULL DEFAULT 'percentage',
  discount_value  NUMERIC(10,2) NOT NULL,
  min_stay_nights INTEGER,
  max_uses        INTEGER,
  current_uses    INTEGER NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON public.coupons(code);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_blog_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── AUTO-CREATE USER PROFILE ON SIGNUP ──────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'guest'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_on_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- USERS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admin can manage all users" ON public.users
  FOR ALL USING (get_user_role() = 'admin');

-- ROOMS policies
CREATE POLICY "Anyone can view active rooms" ON public.rooms
  FOR SELECT USING (is_active = TRUE OR get_user_role() = 'admin');

CREATE POLICY "Admin can manage rooms" ON public.rooms
  FOR ALL USING (get_user_role() = 'admin');

-- BOOKINGS policies
CREATE POLICY "Guests can view own bookings" ON public.bookings
  FOR SELECT USING (user_id = auth.uid() OR get_user_role() = 'admin');

CREATE POLICY "Guests can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Guests can cancel own bookings" ON public.bookings
  FOR UPDATE USING (
    user_id = auth.uid() OR get_user_role() = 'admin'
  );

CREATE POLICY "Admin can manage all bookings" ON public.bookings
  FOR ALL USING (get_user_role() = 'admin');

-- SEASONAL PRICING policies
CREATE POLICY "Anyone can read seasonal pricing" ON public.seasonal_pricing
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage seasonal pricing" ON public.seasonal_pricing
  FOR ALL USING (get_user_role() = 'admin');

-- REVIEWS policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = TRUE OR get_user_role() = 'admin');

CREATE POLICY "Guests can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Admin can manage reviews" ON public.reviews
  FOR ALL USING (get_user_role() = 'admin');

-- BLOG POSTS policies
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (is_published = TRUE OR get_user_role() = 'admin');

CREATE POLICY "Admin can manage blog posts" ON public.blog_posts
  FOR ALL USING (get_user_role() = 'admin');

-- ADD-ON SERVICES policies
CREATE POLICY "Anyone can view active add-ons" ON public.add_on_services
  FOR SELECT USING (is_active = TRUE OR get_user_role() = 'admin');

CREATE POLICY "Admin can manage add-ons" ON public.add_on_services
  FOR ALL USING (get_user_role() = 'admin');

-- BOOKING ADD-ONS policies
CREATE POLICY "Users can view own booking add-ons" ON public.booking_addons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND (b.user_id = auth.uid() OR get_user_role() = 'admin')
    )
  );

CREATE POLICY "Users can add to own bookings" ON public.booking_addons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.user_id = auth.uid()
    )
  );

-- COUPONS policies
CREATE POLICY "Admin can manage coupons" ON public.coupons
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "Authenticated users can validate coupons" ON public.coupons
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── SEED DATA ───────────────────────────────────────────────

-- Add-on services
INSERT INTO public.add_on_services (name, description, price_lkr, price_usd, icon, sort_order) VALUES
  ('Airport Pickup', 'Private transfer from Colombo/Bandaranaike Airport', 8500, 28, 'car', 1),
  ('Breakfast Package', 'Full Sri Lankan breakfast for 2 (daily)', 2500, 8, 'coffee', 2),
  ('Ayurveda Massage', '60-minute traditional Ayurvedic oil massage', 6000, 20, 'heart', 3),
  ('Tuk-Tuk Day Tour', 'Guided local sightseeing by tuk-tuk (4 hours)', 4500, 15, 'map', 4),
  ('Candlelight Dinner', 'Private romantic dinner setup on terrace', 12000, 40, 'star', 5),
  ('Yoga Session', 'Morning yoga class (1 hour)', 3000, 10, 'activity', 6),
  ('Laundry Service', 'Full laundry wash and press per bag', 1500, 5, 'droplets', 7),
  ('Late Checkout', 'Extend checkout to 3pm (subject to availability)', 3500, 12, 'clock', 8);

-- Seasonal pricing
INSERT INTO public.seasonal_pricing (start_date, end_date, multiplier, label) VALUES
  ('2025-12-15', '2026-01-05', 1.5, 'Christmas & New Year Peak'),
  ('2026-04-01', '2026-04-30', 1.3, 'Sinhala New Year'),
  ('2026-07-01', '2026-08-31', 1.2, 'European Summer'),
  ('2025-11-01', '2025-11-30', 1.1, 'November High Season'),
  ('2026-02-01', '2026-03-31', 0.9, 'Low Season Discount');

-- Sample coupon
INSERT INTO public.coupons (code, discount_type, discount_value, min_stay_nights, max_uses, expires_at) VALUES
  ('LOGA10', 'percentage', 10, 3, 100, '2026-12-31'),
  ('WELCOME15', 'percentage', 15, 2, 50, '2026-06-30'),
  ('HONEYMOON', 'fixed', 5000, 5, 20, '2026-12-31');
