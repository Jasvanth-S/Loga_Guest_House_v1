import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { calculatePrice, validateCoupon } from "@/lib/booking";
import type { Currency } from "@/types";

// GET /api/pricing?room_id=xxx&check_in=xxx&check_out=xxx&currency=USD
// GET /api/pricing?coupon=xxx&subtotal=xxx&nights=xxx
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Coupon validation mode
    const coupon = searchParams.get("coupon");
    const subtotal = searchParams.get("subtotal");
    const nights = searchParams.get("nights");
    if (coupon && subtotal && nights) {
        try {
            const result = await validateCoupon(coupon, parseFloat(subtotal), parseInt(nights));
            return NextResponse.json(result);
        } catch (err: unknown) {
            return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 500 });
        }
    }

    // Price calculation mode
    const room_id = searchParams.get("room_id");
    const check_in = searchParams.get("check_in");
    const check_out = searchParams.get("check_out");
    const currency = (searchParams.get("currency") || "USD") as Currency;
    const coupon_code = searchParams.get("coupon_code") || undefined;

    if (!room_id || !check_in || !check_out) {
        return NextResponse.json({ error: "room_id, check_in, check_out required" }, { status: 400 });
    }

    try {
        const breakdown = await calculatePrice(room_id, check_in, check_out, currency, coupon_code);
        return NextResponse.json({ data: breakdown });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Pricing error" },
            { status: 500 }
        );
    }
}
