import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/booking";

// GET /api/bookings/[id] — single booking detail
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
        .from("users").select("role").eq("id", user.id).single();

    const query = supabase
        .from("bookings")
        .select("*, room:rooms(*), user:users(name, email, phone), booking_addons(*, add_on:add_on_services(*))")
        .eq("id", id);

    if (profile?.role !== "admin") query.eq("user_id", user.id);

    const { data, error } = await query.single();
    if (error || !data) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ data });
}

// PATCH /api/bookings/[id] — admin update booking status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });

    const body = await request.json();
    const { booking_status, payment_status, amount_paid } = body;

    const { data, error } = await supabase
        .from("bookings")
        .update({ booking_status, payment_status, amount_paid })
        .eq("id", id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
}

// DELETE /api/bookings/[id] — cancel booking (guest, within 48h)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reason } = await request.json().catch(() => ({ reason: undefined }));

    try {
        await cancelBooking(id, user.id, reason);
        return NextResponse.json({ message: "Booking cancelled successfully" });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Cancellation failed" },
            { status: 400 }
        );
    }
}
