"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { Input, Textarea, Select } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import {
    User, Mail, Phone, MessageSquare, CreditCard,
    CheckCircle, ChevronRight, Tag, Shield
} from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { parseISO } from "date-fns";
import toast from "react-hot-toast";

const guestSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(7, "Valid phone number required"),
    nationality: z.string().optional(),
    special_requests: z.string().optional(),
    payment_type: z.enum(["full", "partial"]),
    whatsapp_summary: z.boolean().optional(),
});
type GuestFormData = z.infer<typeof guestSchema>;

const TAX_RATE = 0.15;

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const roomSlug = searchParams.get("slug") || "";
    const roomId = searchParams.get("room") || "";
    const checkIn = searchParams.get("check_in") || "";
    const checkOut = searchParams.get("check_out") || "";
    const guestsStr = searchParams.get("guests") || "2";

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [roomData, setRoomData] = useState<{ title: string; price_usd: number } | null>(null);

    const nights = checkIn && checkOut
        ? differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
        : 2;

    const basePrice = (roomData?.price_usd || 60) * nights;
    const discountAmount = couponApplied ? discount : 0;
    const subtotal = basePrice - discountAmount;
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));
    const partialAmount = parseFloat((total * 0.3).toFixed(2));

    const { register, handleSubmit, watch, formState: { errors } } = useForm<GuestFormData>({
        resolver: zodResolver(guestSchema),
        defaultValues: { payment_type: "full" },
    });

    const paymentType = watch("payment_type");

    useEffect(() => {
        if (roomSlug) {
            fetch(`/api/rooms/${roomSlug}`)
                .then((r) => r.json())
                .then((data) => setRoomData(data.data))
                .catch(() => { });
        }
    }, [roomSlug]);

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            const res = await fetch(`/api/pricing?coupon=${couponCode}&subtotal=${basePrice}&nights=${nights}`);
            const data = await res.json();
            if (data.valid) {
                setDiscount(data.discount_amount);
                setCouponApplied(true);
                toast.success(`Coupon applied! You save ${formatCurrency(data.discount_amount, "USD")}`);
            } else {
                toast.error(data.message || "Invalid coupon");
            }
        } catch {
            toast.error("Failed to apply coupon");
        }
    };

    const onSubmit = async (data: GuestFormData) => {
        setLoading(true);
        try {
            const bookingRes = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    room_id: roomId,
                    check_in: checkIn,
                    check_out: checkOut,
                    guests: parseInt(guestsStr),
                    currency: "USD",
                    payment_type: data.payment_type,
                    coupon_code: couponApplied ? couponCode : undefined,
                    special_requests: data.special_requests,
                }),
            });
            const bookingData = await bookingRes.json();
            if (!bookingRes.ok) throw new Error(bookingData.error);

            if (data.whatsapp_summary) {
                const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94000000000";
                const msg = encodeURIComponent(
                    `Hi! I just booked ${roomData?.title || "a room"} at Loga Guest House.\nBooking ID: ${bookingData.data?.id?.slice(0, 8).toUpperCase()}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}`
                );
                window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
            }

            toast.success("Booking confirmed! Redirecting...");
            router.push(`/dashboard?booking=${bookingData.data?.id}`);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    const STEPS = ["Review", "Guest Details", "Payment"];

    return (
        <main className="pt-24 pb-section bg-coconut min-h-screen">
            <div className="container-luxury max-w-5xl">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-10">
                    {STEPS.map((s, i) => {
                        const num = (i + 1) as 1 | 2 | 3;
                        const active = step === num;
                        const done = step > num;
                        return (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-sans font-bold
                  transition-all duration-300
                  ${done ? "bg-palm text-white" : active ? "bg-ocean text-white" : "bg-coconut-darker text-warmgray"}
                `}>
                                    {done ? <CheckCircle size={14} /> : num}
                                </div>
                                <span className={`font-sans text-sm ${active ? "text-ocean-dark font-medium" : "text-warmgray"}`}>{s}</span>
                                {i < STEPS.length - 1 && <ChevronRight size={14} className="text-warmgray mx-1" />}
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Review */}
                        {step === 1 && (
                            <div className="bg-white rounded-3xl p-6 shadow-luxury">
                                <h2 className="font-serif text-heading-3 text-ocean-dark mb-5">Confirm Your Stay</h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {[
                                        { label: "Check-in", value: checkIn ? formatDate(checkIn) : "—" },
                                        { label: "Check-out", value: checkOut ? formatDate(checkOut) : "—" },
                                        { label: "Duration", value: `${nights} night${nights !== 1 ? "s" : ""}` },
                                        { label: "Guests", value: `${guestsStr} guest${parseInt(guestsStr) !== 1 ? "s" : ""}` },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-coconut rounded-2xl p-4">
                                            <p className="font-sans text-xs text-warmgray uppercase tracking-wider mb-1">{label}</p>
                                            <p className="font-sans text-sm font-semibold text-ocean-dark">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon */}
                                <div className="border-t border-coconut-darker pt-5">
                                    <p className="font-sans text-sm font-medium text-ocean-dark mb-2">Have a coupon code?</p>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray" />
                                            <input
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="e.g. LOGA10"
                                                className="w-full pl-9 pr-3 py-2.5 border border-coconut-darker rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-sand/40 focus:border-sand"
                                            />
                                        </div>
                                        <Button variant="sand" size="md" onClick={applyCoupon} disabled={couponApplied}>
                                            {couponApplied ? "Applied ✓" : "Apply"}
                                        </Button>
                                    </div>
                                </div>

                                <Button variant="primary" size="lg" fullWidth className="mt-6"
                                    onClick={() => setStep(2)} icon={<ChevronRight size={16} />} iconPosition="right">
                                    Continue to Guest Details
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Guest Details */}
                        {step === 2 && (
                            <div className="bg-white rounded-3xl p-6 shadow-luxury">
                                <h2 className="font-serif text-heading-3 text-ocean-dark mb-5">Your Details</h2>
                                <form id="booking-form" onSubmit={handleSubmit(() => setStep(3))} className="space-y-4">
                                    <Input label="Full Name" {...register("name")} error={errors.name?.message}
                                        icon={<User size={16} />} placeholder="Jane Smith" required />
                                    <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message}
                                        icon={<Mail size={16} />} placeholder="you@example.com" required />
                                    <Input label="Phone / WhatsApp" type="tel" {...register("phone")} error={errors.phone?.message}
                                        icon={<Phone size={16} />} placeholder="+1 234 567 8900" required />
                                    <Textarea label="Special Requests" {...register("special_requests")}
                                        placeholder="Early check-in, dietary requirements, celebration setup..." />

                                    <div className="flex items-center gap-3 pt-2">
                                        <input id="whatsapp" type="checkbox" {...register("whatsapp_summary")}
                                            className="w-4 h-4 accent-ocean rounded" />
                                        <label htmlFor="whatsapp" className="font-sans text-sm text-warmgray cursor-pointer">
                                            Send me a booking summary on WhatsApp
                                        </label>
                                    </div>
                                </form>

                                <div className="flex gap-3 mt-6">
                                    <Button variant="ghost" size="lg" onClick={() => setStep(1)}>Back</Button>
                                    <Button variant="primary" size="lg" className="flex-1" type="submit" form="booking-form"
                                        icon={<ChevronRight size={16} />} iconPosition="right">
                                        Continue to Payment
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-3xl p-6 shadow-luxury">
                                <h2 className="font-serif text-heading-3 text-ocean-dark mb-5">Payment</h2>

                                <div className="space-y-3 mb-6">
                                    {[
                                        {
                                            id: "full",
                                            label: "Pay Full Amount",
                                            sub: `Pay ${formatCurrency(total, "USD")} now`,
                                            badge: null,
                                        },
                                        {
                                            id: "partial",
                                            label: "Pay 30% Deposit",
                                            sub: `Pay ${formatCurrency(partialAmount, "USD")} now, rest at check-in`,
                                            badge: "Flexible",
                                        },
                                    ].map((opt) => (
                                        <label key={opt.id} className={`
                      flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200
                      ${paymentType === opt.id ? "border-ocean bg-ocean/5" : "border-coconut-darker hover:border-ocean/30"}
                    `}>
                                            <input type="radio" value={opt.id} {...register("payment_type")}
                                                className="accent-ocean w-4 h-4" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-sans text-sm font-medium text-ocean-dark">{opt.label}</p>
                                                    {opt.badge && <Badge variant="palm" size="sm">{opt.badge}</Badge>}
                                                </div>
                                                <p className="font-sans text-xs text-warmgray">{opt.sub}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Stripe placeholder */}
                                <div className="border border-coconut-darker rounded-2xl p-4 mb-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CreditCard size={16} className="text-ocean" />
                                        <p className="font-sans text-sm font-medium text-ocean-dark">Card Details</p>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                                            alt="Stripe" className="h-5 ml-auto" />
                                    </div>
                                    <div className="bg-coconut rounded-xl p-3 text-center">
                                        <p className="font-sans text-xs text-warmgray">
                                            🔒 Stripe payment form will load here. Configure your{" "}
                                            <code className="text-ocean">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 bg-palm/5 border border-palm/20 rounded-xl p-3 mb-5">
                                    <Shield size={15} className="text-palm shrink-0 mt-0.5" />
                                    <p className="font-sans text-xs text-warmgray leading-relaxed">
                                        Your payment is processed securely via Stripe. We never store your card details.
                                        All transactions are 256-bit SSL encrypted.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button variant="ghost" size="lg" onClick={() => setStep(2)}>Back</Button>
                                    <Button variant="primary" size="lg" className="flex-1" loading={loading}
                                        onClick={handleSubmit(onSubmit)}
                                        icon={<CheckCircle size={16} />} iconPosition="right">
                                        Confirm Booking · {formatCurrency(paymentType === "partial" ? partialAmount : total, "USD")}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-3xl shadow-luxury p-5 border border-coconut-darker">
                            <h3 className="font-serif text-lg text-ocean-dark mb-4">Price Summary</h3>
                            <div className="space-y-2.5 text-sm font-sans">
                                <div className="flex justify-between text-warmgray">
                                    <span>{formatCurrency(roomData?.price_usd || 60, "USD")} × {nights} nights</span>
                                    <span>{formatCurrency(basePrice, "USD")}</span>
                                </div>
                                {couponApplied && (
                                    <div className="flex justify-between text-palm">
                                        <span>Coupon discount</span>
                                        <span>−{formatCurrency(discountAmount, "USD")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-warmgray">
                                    <span>Tax (15% VAT)</span>
                                    <span>{formatCurrency(tax, "USD")}</span>
                                </div>
                                <div className="border-t border-coconut-darker pt-2.5 mt-2.5 flex justify-between font-semibold text-ocean-dark">
                                    <span>Total</span>
                                    <span>{formatCurrency(total, "USD")}</span>
                                </div>
                                {paymentType === "partial" && (
                                    <div className="flex justify-between text-sand-dark font-medium">
                                        <span>Due now (30%)</span>
                                        <span>{formatCurrency(partialAmount, "USD")}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-coconut-darker space-y-1.5">
                                {["Free cancellation up to 48h", "Instant confirmation", "No hidden fees"].map((item) => (
                                    <div key={item} className="flex items-center gap-1.5 text-xs text-warmgray">
                                        <CheckCircle size={12} className="text-palm" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="skeleton w-32 h-8" /></div>}>
            <BookingContent />
        </Suspense>
    );
}
