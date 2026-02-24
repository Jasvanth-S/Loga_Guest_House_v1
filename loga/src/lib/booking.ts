import { createClient } from "@/lib/supabase/server";
import type {
    PriceBreakdown,
    Currency,
    AvailabilityResult,
    Booking,
} from "@/types";
import { differenceInCalendarDays, parseISO, eachDayOfInterval, format } from "date-fns";

const TAX_RATE = 0.15; // 15% VAT
const PARTIAL_PAYMENT_PERCENTAGE = 0.30; // 30% deposit

// ─── Check Availability ──────────────────────────────────────

export async function checkAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string
): Promise<AvailabilityResult> {
    const supabase = await createClient();

    // Get all booked date ranges for this room
    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq("room_id", roomId)
        .in("booking_status", ["pending", "confirmed"])
        .or(`check_in.lt.${checkOut},check_out.gt.${checkIn}`);

    if (error) throw new Error(`Availability check failed: ${error.message}`);

    const blocked_dates: string[] = [];
    if (bookings) {
        for (const booking of bookings) {
            const days = eachDayOfInterval({
                start: parseISO(booking.check_in),
                end: parseISO(booking.check_out),
            });
            days.forEach((d) => blocked_dates.push(format(d, "yyyy-MM-dd")));
        }
    }

    const requestedDays = eachDayOfInterval({
        start: parseISO(checkIn),
        end: parseISO(checkOut),
    });

    const available = !requestedDays.some((d) =>
        blocked_dates.includes(format(d, "yyyy-MM-dd"))
    );

    return { available, blocked_dates };
}

// ─── Get Blocked Dates for a Room ────────────────────────────

export async function getBlockedDates(roomId: string): Promise<string[]> {
    const supabase = await createClient();

    const { data: bookings } = await supabase
        .from("bookings")
        .select("check_in, check_out")
        .eq("room_id", roomId)
        .in("booking_status", ["pending", "confirmed"]);

    const blocked: string[] = [];
    if (bookings) {
        for (const booking of bookings) {
            const days = eachDayOfInterval({
                start: parseISO(booking.check_in),
                end: parseISO(booking.check_out),
            });
            days.forEach((d) => blocked.push(format(d, "yyyy-MM-dd")));
        }
    }

    return [...new Set(blocked)];
}

// ─── Seasonal Pricing Multiplier ─────────────────────────────

async function getSeasonalMultiplier(
    checkIn: string,
    checkOut: string
): Promise<number> {
    const supabase = await createClient();

    const { data: seasons } = await supabase
        .from("seasonal_pricing")
        .select("*")
        .lte("start_date", checkOut)
        .gte("end_date", checkIn);

    if (!seasons || seasons.length === 0) return 1.0;

    // Average multiplier across overlapping seasons
    const avg =
        seasons.reduce((sum, s) => sum + s.multiplier, 0) / seasons.length;
    return parseFloat(avg.toFixed(2));
}

// ─── Calculate Price ──────────────────────────────────────────

export async function calculatePrice(
    roomId: string,
    checkIn: string,
    checkOut: string,
    currency: Currency = "USD",
    couponCode?: string
): Promise<PriceBreakdown> {
    const supabase = await createClient();

    const { data: room, error } = await supabase
        .from("rooms")
        .select("price_lkr, price_usd")
        .eq("id", roomId)
        .single();

    if (error || !room) throw new Error("Room not found");

    const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
    if (nights < 1) throw new Error("Check-out must be after check-in");

    const base_price_per_night =
        currency === "LKR" ? room.price_lkr : room.price_usd;

    const seasonal_multiplier = await getSeasonalMultiplier(checkIn, checkOut);
    const adjusted_price_per_night = parseFloat(
        (base_price_per_night * seasonal_multiplier).toFixed(2)
    );
    const subtotal = parseFloat((adjusted_price_per_night * nights).toFixed(2));

    // Apply coupon
    let discount_amount = 0;
    if (couponCode) {
        const { data: coupon } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", couponCode.toUpperCase())
            .eq("is_active", true)
            .single();

        if (coupon) {
            const validExpiry =
                !coupon.expires_at || new Date(coupon.expires_at) > new Date();
            const validUses =
                !coupon.max_uses || coupon.current_uses < coupon.max_uses;
            const validStay =
                !coupon.min_stay_nights || nights >= coupon.min_stay_nights;

            if (validExpiry && validUses && validStay) {
                if (coupon.discount_type === "percentage") {
                    discount_amount = parseFloat(
                        ((subtotal * coupon.discount_value) / 100).toFixed(2)
                    );
                } else {
                    discount_amount = Math.min(coupon.discount_value, subtotal);
                }
            }
        }
    }

    const discounted_subtotal = subtotal - discount_amount;
    const tax_amount = parseFloat((discounted_subtotal * TAX_RATE).toFixed(2));
    const grand_total = parseFloat((discounted_subtotal + tax_amount).toFixed(2));
    const partial_amount = parseFloat((grand_total * PARTIAL_PAYMENT_PERCENTAGE).toFixed(2));

    return {
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        nights,
        base_price_per_night,
        seasonal_multiplier,
        adjusted_price_per_night,
        subtotal,
        discount_amount,
        tax_rate: TAX_RATE,
        tax_amount,
        grand_total,
        currency,
        partial_amount,
    };
}

// ─── Apply Coupon (standalone) ────────────────────────────────

export async function validateCoupon(
    code: string,
    subtotal: number,
    nights: number
) {
    const supabase = await createClient();

    const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

    if (error || !coupon) return { valid: false, message: "Invalid coupon code" };

    if (coupon.expires_at && new Date(coupon.expires_at) <= new Date()) {
        return { valid: false, message: "Coupon has expired" };
    }
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        return { valid: false, message: "Coupon usage limit reached" };
    }
    if (coupon.min_stay_nights && nights < coupon.min_stay_nights) {
        return {
            valid: false,
            message: `Minimum stay of ${coupon.min_stay_nights} nights required`,
        };
    }

    const discount_amount =
        coupon.discount_type === "percentage"
            ? parseFloat(((subtotal * coupon.discount_value) / 100).toFixed(2))
            : Math.min(coupon.discount_value, subtotal);

    return { valid: true, coupon, discount_amount };
}

// ─── Create Booking (atomic) ──────────────────────────────────

export interface CreateBookingPayload {
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    currency: Currency;
    payment_type: "partial" | "full";
    coupon_code?: string;
    add_on_ids?: string[];
    special_requests?: string;
    stripe_payment_intent_id?: string;
}

export async function createBooking(
    userId: string,
    payload: CreateBookingPayload
): Promise<Booking> {
    const supabase = await createClient();

    // 1. Check availability
    const { available } = await checkAvailability(
        payload.room_id,
        payload.check_in,
        payload.check_out
    );
    if (!available) throw new Error("Room is not available for selected dates");

    // 2. Get price breakdown
    const priceBreakdown = await calculatePrice(
        payload.room_id,
        payload.check_in,
        payload.check_out,
        payload.currency,
        payload.coupon_code
    );

    // 3. Validate min stay
    const { data: room } = await supabase
        .from("rooms")
        .select("min_stay_nights, max_guests")
        .eq("id", payload.room_id)
        .single();

    if (room && priceBreakdown.nights < room.min_stay_nights) {
        throw new Error(`Minimum stay is ${room.min_stay_nights} nights`);
    }
    if (room && payload.guests > room.max_guests) {
        throw new Error(`Maximum guests for this room is ${room.max_guests}`);
    }

    const amount_paid =
        payload.payment_type === "partial"
            ? priceBreakdown.partial_amount
            : priceBreakdown.grand_total;

    // 4. Insert booking
    const { data: booking, error } = await supabase
        .from("bookings")
        .insert({
            user_id: userId,
            room_id: payload.room_id,
            check_in: payload.check_in,
            check_out: payload.check_out,
            guests: payload.guests,
            total_price: priceBreakdown.grand_total,
            currency: payload.currency,
            payment_status: "unpaid",
            booking_status: "pending",
            payment_type: payload.payment_type,
            amount_paid: 0, // Updated after payment confirmation
            tax_amount: priceBreakdown.tax_amount,
            discount_amount: priceBreakdown.discount_amount,
            coupon_code: payload.coupon_code,
            special_requests: payload.special_requests,
            stripe_payment_intent_id: payload.stripe_payment_intent_id,
        })
        .select()
        .single();

    if (error) throw new Error(`Booking creation failed: ${error.message}`);

    // 5. Insert add-ons if any
    if (payload.add_on_ids?.length && booking) {
        const { data: addOns } = await supabase
            .from("add_on_services")
            .select("id, price_usd, price_lkr")
            .in("id", payload.add_on_ids);

        if (addOns) {
            await supabase.from("booking_addons").insert(
                addOns.map((a) => ({
                    booking_id: booking.id,
                    add_on_id: a.id,
                    quantity: 1,
                    price_at_booking:
                        payload.currency === "LKR" ? a.price_lkr : a.price_usd,
                }))
            );
        }
    }

    return booking as Booking;
}

// ─── Cancel Booking ───────────────────────────────────────────

export async function cancelBooking(
    bookingId: string,
    userId: string,
    reason?: string
): Promise<void> {
    const supabase = await createClient();

    const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .eq("user_id", userId)
        .single();

    if (fetchError || !booking) throw new Error("Booking not found");

    const checkInDate = parseISO(booking.check_in);
    const now = new Date();
    const hoursUntilCheckIn =
        (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 48) {
        throw new Error(
            "Cancellations must be made at least 48 hours before check-in"
        );
    }

    const { error } = await supabase
        .from("bookings")
        .update({
            booking_status: "cancelled",
            cancellation_reason: reason,
            cancelled_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .eq("user_id", userId);

    if (error) throw new Error(`Cancellation failed: ${error.message}`);
}
