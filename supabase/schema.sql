-- ============================================================
-- LOGA GUEST HOUSE — Supabase Database Schema
-- Run this SQL in your Supabase > SQL Editor
-- ============================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── users table (extends Supabase auth.users) ───────────────
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── rooms ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('Standard', 'Deluxe', 'Family', 'Suite')),
    description TEXT,
    price_lkr NUMERIC(10,2) NOT NULL,
    price_usd NUMERIC(10,2) NOT NULL,
    max_guests INTEGER NOT NULL DEFAULT 2,
    amenities JSONB DEFAULT '[]',
    cover_image TEXT,
    gallery JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    wifi_speed TEXT,
    has_ac BOOLEAN DEFAULT TRUE,
    has_power_backup BOOLEAN DEFAULT TRUE,
    eco_friendly BOOLEAN DEFAULT FALSE,
    beach_tag BOOLEAN DEFAULT FALSE,
    hill_tag BOOLEAN DEFAULT FALSE,
    min_stay_nights INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 99,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE RESTRICT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    nights INTEGER GENERATED ALWAYS AS (check_out - check_in) STORED,
    total_price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('LKR', 'USD', 'EUR')),
    tax_amount NUMERIC(10,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    amount_paid NUMERIC(10,2) DEFAULT 0,
    payment_type TEXT DEFAULT 'full' CHECK (payment_type IN ('full', 'partial')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
    booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    seasonal_multiplier NUMERIC(4,2) DEFAULT 1.0,
    coupon_code TEXT,
    special_requests TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    refund_amount NUMERIC(10,2) DEFAULT 0,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (check_out > check_in),
    CONSTRAINT check_guests CHECK (guests > 0)
);

-- Index for availability queries
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates ON public.bookings(room_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);

-- ─── seasonal_pricing ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seasonal_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0 CHECK (multiplier > 0),
    CONSTRAINT check_season_dates CHECK (end_date >= start_date)
);

-- Seed default seasons for Sri Lanka
INSERT INTO public.seasonal_pricing (label, start_date, end_date, multiplier) VALUES
    ('Peak Season - Yala', '2026-04-01', '2026-09-30', 1.3),
    ('High Season - Year End', '2026-11-15', '2027-01-15', 1.5),
    ('Off-Peak', '2026-02-01', '2026-03-31', 0.9)
ON CONFLICT DO NOTHING;

-- ─── reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_room ON public.reviews(room_id, is_approved);

-- ─── blog_posts ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    seo_title TEXT,
    meta_description TEXT,
    category TEXT DEFAULT 'Travel Guide',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(is_published, created_at DESC);

-- ─── add_on_services ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.add_on_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_lkr NUMERIC(10,2) NOT NULL,
    price_usd NUMERIC(10,2) NOT NULL,
    icon TEXT DEFAULT '🌴',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 99,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed add-on services
INSERT INTO public.add_on_services (name, description, price_lkr, price_usd, icon, sort_order) VALUES
    ('Airport Transfer', 'Private AC vehicle from/to Bandaranaike Airport', 8500, 28, '✈️', 1),
    ('Sri Lankan Breakfast', 'Authentic hoppers, string hoppers & Ceylon tea for 2', 2500, 8, '🍳', 2),
    ('Ayurveda Massage', '60-minute traditional oil massage', 6000, 20, '🌿', 3),
    ('City Tour by Tuk-tuk', '3-hour guided local sightseeing tour', 4500, 15, '🛺', 4),
    ('Late Checkout (3PM)', 'Extend your checkout to 3:00 PM', 2000, 7, '🕒', 5),
    ('Early Check-in (10AM)', 'Access your room from 10:00 AM', 2000, 7, '🔑', 6)
ON CONFLICT DO NOTHING;

-- ─── coupons ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    min_stay_nights INTEGER,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    max_discount_amount NUMERIC(10,2),
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed example coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_stay_nights, is_active) VALUES
    ('LOGA10', 'percentage', 10, 2, TRUE),
    ('WELCOME20', 'percentage', 20, 3, TRUE),
    ('HONEYMOON', 'fixed', 50, 3, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Helper function to increment coupon usage
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(coupon_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.coupons
    SET current_uses = current_uses + 1
    WHERE code = coupon_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── booking_addons (junction) ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.booking_addons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    add_on_id UUID REFERENCES public.add_on_services(id) ON DELETE RESTRICT,
    quantity INTEGER DEFAULT 1,
    price_at_booking NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id, add_on_id)
);

-- ─── Row-Level Security (RLS) ─────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_on_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Rooms: public read, admin write
CREATE POLICY "Anyone can read active rooms" ON public.rooms
    FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage rooms" ON public.rooms
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Bookings: users see own, admins see all
CREATE POLICY "Users see own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all bookings" ON public.bookings
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Reviews: anyone sees approved, users manage own
CREATE POLICY "Anyone can read approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Authenticated can submit reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage reviews" ON public.reviews
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Blog: public read published, admin write
CREATE POLICY "Anyone reads published posts" ON public.blog_posts
    FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Admins manage blog" ON public.blog_posts
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Add-ons: public read active
CREATE POLICY "Anyone reads active add-ons" ON public.add_on_services
    FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins manage add-ons" ON public.add_on_services
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Seasonal pricing: public read
CREATE POLICY "Anyone reads seasonal pricing" ON public.seasonal_pricing
    FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage seasonal pricing" ON public.seasonal_pricing
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Coupons: admins only (validated server-side via API)
CREATE POLICY "Admins manage coupons" ON public.coupons
    FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Set first user as admin helper (run manually):
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-admin@email.com';
