import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getBlockedDates, checkAvailability } from "@/lib/booking";

// GET /api/availability?room_id=xxx — returns blocked dates for calendar
// GET /api/availability?room_id=xxx&check_in=xxx&check_out=xxx — validates availability
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const room_id = searchParams.get("room_id");
    const check_in = searchParams.get("check_in");
    const check_out = searchParams.get("check_out");

    if (!room_id) {
        return NextResponse.json({ error: "room_id is required" }, { status: 400 });
    }

    try {
        if (check_in && check_out) {
            const result = await checkAvailability(room_id, check_in, check_out);
            return NextResponse.json({ data: result });
        }

        const blocked_dates = await getBlockedDates(room_id);
        return NextResponse.json(
            { data: { blocked_dates } },
            { headers: { "Cache-Control": "public, s-maxage=30" } }
        );
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Failed to check availability" },
            { status: 500 }
        );
    }
}
