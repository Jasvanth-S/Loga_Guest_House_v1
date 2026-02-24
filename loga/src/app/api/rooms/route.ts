import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { RoomFilters } from "@/types";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const guests = searchParams.get("guests");
    const max_price = searchParams.get("max_price");

    let query = supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (category) query = query.eq("category", category);
    if (guests) query = query.gte("max_guests", parseInt(guests));
    if (max_price) query = query.lte("price_usd", parseFloat(max_price));

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
        { data },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
}
