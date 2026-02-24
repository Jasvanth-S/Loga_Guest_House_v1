import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/reviews?room_id=xxx — approved reviews for a room
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const room_id = searchParams.get("room_id");

    const supabase = await createClient();

    let query = supabase
        .from("reviews")
        .select("*, user:users(id, name, avatar_url)")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

    if (room_id) query = query.eq("room_id", room_id);

    const { data, error } = await query.limit(20);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
}

// POST /api/reviews — submit a review (auth required + must have completed booking)
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { room_id, booking_id, rating, comment, images } = await request.json();

    if (!room_id || !rating || !comment) {
        return NextResponse.json({ error: "room_id, rating, and comment are required" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    // Validate the user completed a booking for this room
    if (booking_id) {
        const { data: booking } = await supabase
            .from("bookings")
            .select("id, booking_status")
            .eq("id", booking_id)
            .eq("user_id", user.id)
            .single();
        if (!booking || booking.booking_status !== "completed") {
            return NextResponse.json({ error: "You can only review after a completed stay" }, { status: 403 });
        }
    }

    const { data, error } = await supabase
        .from("reviews")
        .insert({ user_id: user.id, room_id, booking_id, rating, comment, images: images || [], is_approved: false })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, message: "Review submitted for approval" }, { status: 201 });
}
