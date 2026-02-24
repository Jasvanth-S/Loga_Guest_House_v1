import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/webhooks/stripe — Stripe payment lifecycle events
// Stripe is loaded lazily so the module doesn't break at build time without STRIPE_SECRET_KEY
export async function POST(request: NextRequest) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecretKey || !webhookSecret) {
        console.warn("[Stripe Webhook] Stripe keys not configured — skipping.");
        return NextResponse.json({ received: true, note: "Stripe not configured" });
    }

    // Lazily import Stripe to avoid module-init errors during build
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" as any });

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: import("stripe").Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error("[Stripe Webhook] Signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
        case "payment_intent.succeeded": {
            const pi = event.data.object as import("stripe").Stripe.PaymentIntent;
            const booking_id = pi.metadata?.booking_id;
            if (booking_id) {
                await supabase.from("bookings").update({
                    payment_status: "paid",
                    booking_status: "confirmed",
                    amount_paid: pi.amount_received / 100,
                    stripe_payment_intent_id: pi.id,
                }).eq("id", booking_id);
                console.log(`[Stripe Webhook] Booking ${booking_id} confirmed — paid ${pi.amount_received / 100}`);
            }
            break;
        }

        case "payment_intent.payment_failed": {
            const pi = event.data.object as import("stripe").Stripe.PaymentIntent;
            const booking_id = pi.metadata?.booking_id;
            if (booking_id) {
                await supabase.from("bookings").update({
                    payment_status: "unpaid",
                    booking_status: "cancelled",
                }).eq("id", booking_id);
                console.warn(`[Stripe Webhook] Payment failed for booking ${booking_id}`);
            }
            break;
        }

        case "charge.refunded": {
            const charge = event.data.object as import("stripe").Stripe.Charge;
            if (charge.payment_intent) {
                await supabase.from("bookings").update({
                    payment_status: "refunded",
                    refund_amount: (charge.amount_refunded || 0) / 100,
                }).eq("stripe_payment_intent_id", charge.payment_intent as string);
            }
            break;
        }

        default:
            console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
