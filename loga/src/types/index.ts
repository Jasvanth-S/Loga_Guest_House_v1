// ============================================================
// LOGA GUEST HOUSE — Core TypeScript Types
// ============================================================

export type UserRole = "guest" | "admin";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";
export type RoomCategory = "Standard" | "Deluxe" | "Family" | "Suite";
export type Currency = "LKR" | "USD" | "EUR";
export type PaymentType = "partial" | "full"; // 30% or 100%

// ─── User ───────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    avatar_url?: string;
    created_at: string;
}

// ─── Amenity ────────────────────────────────────────────────
export interface Amenity {
    icon: string;
    label: string;
}

// ─── Room ───────────────────────────────────────────────────
export interface Room {
    id: string;
    title: string;
    slug: string;
    category: RoomCategory;
    description: string;
    price_lkr: number;
    price_usd: number;
    max_guests: number;
    amenities: Amenity[];
    cover_image: string;
    gallery: string[];
    is_active: boolean;
    wifi_speed?: string;
    has_ac: boolean;
    has_power_backup: boolean;
    eco_friendly: boolean;
    beach_tag: boolean;
    hill_tag: boolean;
    min_stay_nights: number;
    created_at: string;
}

// ─── Booking ─────────────────────────────────────────────────
export interface Booking {
    id: string;
    user_id: string;
    room_id: string;
    check_in: string; // ISO date
    check_out: string; // ISO date
    guests: number;
    total_price: number;
    currency: Currency;
    payment_status: PaymentStatus;
    booking_status: BookingStatus;
    payment_type: PaymentType;
    amount_paid: number;
    coupon_code?: string;
    discount_amount?: number;
    tax_amount: number;
    add_on_ids?: string[];
    whatsapp_confirmed: boolean;
    special_requests?: string;
    created_at: string;
    // Joined
    room?: Room;
    user?: User;
}

// ─── Seasonal Pricing ────────────────────────────────────────
export interface SeasonalPricing {
    id: string;
    start_date: string;
    end_date: string;
    multiplier: number; // e.g. 1.5 for peak season
    label?: string;
}

// ─── Review ──────────────────────────────────────────────────
export interface Review {
    id: string;
    user_id: string;
    room_id: string;
    rating: number; // 1–5
    comment: string;
    images?: string[];
    is_approved: boolean;
    created_at: string;
    // Joined
    user?: Pick<User, "id" | "name" | "avatar_url">;
}

// ─── Blog Post ────────────────────────────────────────────────
export type BlogCategory =
    | "Travel Guide"
    | "Sri Lanka Tips"
    | "Local Experiences"
    | "Wellness"
    | "Food & Culture"
    | "News";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown
    excerpt?: string;
    cover_image: string;
    seo_title?: string;
    meta_description?: string;
    category: BlogCategory;
    author_id?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    // Joined
    author?: Pick<User, "id" | "name" | "avatar_url">;
}

// ─── Add-on Service ──────────────────────────────────────────
export interface AddOnService {
    id: string;
    name: string;
    description: string;
    price_lkr: number;
    price_usd: number;
    icon?: string;
    is_active: boolean;
}

// ─── Booking Add-on (junction) ───────────────────────────────
export interface BookingAddOn {
    id: string;
    booking_id: string;
    add_on_id: string;
    quantity: number;
    price_at_booking: number;
    // Joined
    add_on?: AddOnService;
}

// ─── Coupon ──────────────────────────────────────────────────
export interface Coupon {
    id: string;
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_stay_nights?: number;
    max_uses?: number;
    current_uses: number;
    expires_at?: string;
    is_active: boolean;
}

// ─── Price Breakdown ─────────────────────────────────────────
export interface PriceBreakdown {
    room_id: string;
    check_in: string;
    check_out: string;
    nights: number;
    base_price_per_night: number;
    seasonal_multiplier: number;
    adjusted_price_per_night: number;
    subtotal: number;
    discount_amount: number;
    tax_rate: number;
    tax_amount: number;
    grand_total: number;
    currency: Currency;
    partial_amount: number; // 30%
}

// ─── Availability ────────────────────────────────────────────
export interface AvailabilityResult {
    available: boolean;
    blocked_dates: string[];
}

// ─── Experience / Attraction ─────────────────────────────────
export interface Attraction {
    id: string;
    name: string;
    location: string;
    distance: string;
    travel_time: string;
    description: string;
    image: string;
    map_embed_url: string;
    tags: string[];
}

// ─── API Response Wrappers ───────────────────────────────────
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

// ─── Filter / Search params ──────────────────────────────────
export interface RoomFilters {
    category?: RoomCategory;
    min_guests?: number;
    max_price_usd?: number;
    check_in?: string;
    check_out?: string;
}

// ─── Admin Analytics ─────────────────────────────────────────
export interface RevenueData {
    month: string;
    revenue_lkr: number;
    revenue_usd: number;
    bookings: number;
}

export interface OccupancyData {
    room_id: string;
    room_title: string;
    occupancy_rate: number;
    total_nights: number;
    booked_nights: number;
}
