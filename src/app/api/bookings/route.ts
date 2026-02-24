import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/booking";
import type { Currency } from "@/types";

// POST /api/bookings — create a new booking (auth required)
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const {
        room_id, check_in, check_out, guests, currency = "USD",
        payment_type = "full", coupon_code, add_on_ids, special_requests,
        stripe_payment_intent_id,
    } = body;

    if (!room_id || !check_in || !check_out || !guests) {
        return NextResponse.json(
            { error: "room_id, check_in, check_out, and guests are required" },
            { status: 400 }
        );
    }

    try {
        const booking = await createBooking(user.id, {
            room_id, check_in, check_out,
            guests: parseInt(guests),
            currency: currency as Currency,
            payment_type,
            coupon_code,
            add_on_ids,
            special_requests,
            stripe_payment_intent_id,
        });
        return NextResponse.json({ data: booking }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Booking failed";
        const status = message.includes("not available") ? 409 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}

// GET /api/bookings — list current user's bookings
export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabase
        .from("bookings")
        .select("*, room:rooms(title, cover_image, slug, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (status) query = query.eq("booking_status", status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
}
