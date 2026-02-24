import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import type { Booking } from "@/types";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import {
    Calendar, Download, XCircle, Clock,
    CheckCircle, User, LogOut
} from "lucide-react";

export const metadata: Metadata = {
    title: "My Dashboard",
    description: "Manage your bookings at Loga Guest House.",
};

const STATUS_BADGE: Record<string, "palm" | "sand" | "red" | "gray" | "ocean"> = {
    confirmed: "palm",
    pending: "sand",
    cancelled: "red",
    completed: "gray",
};

const PAYMENT_BADGE: Record<string, "palm" | "sand" | "red" | "gray"> = {
    paid: "palm",
    partial: "sand",
    unpaid: "red",
    refunded: "gray",
};

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login?redirect=/dashboard");

    const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    const { data: bookings } = await supabase
        .from("bookings")
        .select("*, room:rooms(title, cover_image, slug, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    const typedBookings = (bookings || []) as (Booking & { room: { title: string; cover_image: string; slug: string; category: string } })[];

    const upcoming = typedBookings.filter(b => ["pending", "confirmed"].includes(b.booking_status));
    const past = typedBookings.filter(b => ["completed", "cancelled"].includes(b.booking_status));

    async function signOut() {
        "use server";
        const sb = await createClient();
        await sb.auth.signOut();
        redirect("/");
    }

    return (
        <main className="pt-24 pb-section bg-coconut min-h-screen">
            <div className="container-luxury max-w-5xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-1">
                            Guest Portal
                        </p>
                        <h1 className="font-serif text-heading-1 text-ocean-dark">
                            Welcome, {profile?.name?.split(" ")[0] || "Guest"}
                        </h1>
                        <p className="font-sans text-sm text-warmgray mt-1">{user.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="sand" size="md" icon={<User size={15} />} iconPosition="left">
                            <Link href="/dashboard/profile">Edit Profile</Link>
                        </Button>
                        <form action={signOut}>
                            <Button type="submit" variant="ghost" size="md" icon={<LogOut size={15} />} iconPosition="left">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Total Bookings", value: typedBookings.length, icon: Calendar, color: "bg-ocean/8 text-ocean" },
                        { label: "Upcoming", value: upcoming.length, icon: Clock, color: "bg-sand/10 text-sand-dark" },
                        { label: "Completed", value: past.filter(b => b.booking_status === "completed").length, icon: CheckCircle, color: "bg-palm/10 text-palm" },
                        { label: "Cancelled", value: past.filter(b => b.booking_status === "cancelled").length, icon: XCircle, color: "bg-red-50 text-red-600" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-2xl p-5 shadow-luxury">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                                <Icon size={20} />
                            </div>
                            <p className="font-serif text-3xl text-ocean-dark font-medium">{value}</p>
                            <p className="font-sans text-xs text-warmgray mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Upcoming Bookings */}
                {upcoming.length > 0 && (
                    <section className="mb-10">
                        <h2 className="font-serif text-heading-3 text-ocean-dark mb-4">Upcoming Stays</h2>
                        <div className="space-y-4">
                            {upcoming.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} upcoming />
                            ))}
                        </div>
                    </section>
                )}

                {/* Past Bookings */}
                {past.length > 0 && (
                    <section>
                        <h2 className="font-serif text-heading-3 text-ocean-dark mb-4">Past Stays</h2>
                        <div className="space-y-4">
                            {past.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} upcoming={false} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty state */}
                {typedBookings.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-sand/15 flex items-center justify-center mx-auto mb-5">
                            <Calendar size={32} className="text-sand" />
                        </div>
                        <h3 className="font-serif text-heading-3 text-ocean-dark mb-2">No bookings yet</h3>
                        <p className="font-sans text-warmgray mb-6">
                            Start planning your perfect Sri Lanka escape today.
                        </p>
                        <Button variant="primary" size="lg">
                            <Link href="/rooms">Browse Rooms</Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}

function BookingCard({
    booking,
    upcoming,
}: {
    booking: Booking & { room: { title: string; cover_image: string; slug: string; category: string } };
    upcoming: boolean;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-luxury p-5 flex flex-col sm:flex-row gap-5">
            {/* Room image */}
            {booking.room?.cover_image && (
                <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
                    <img
                        src={booking.room.cover_image}
                        alt={booking.room.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h3 className="font-sans font-semibold text-ocean-dark text-base">
                        {booking.room?.title || "Room"}
                    </h3>
                    <Badge variant={STATUS_BADGE[booking.booking_status] || "gray"} size="sm">
                        {booking.booking_status}
                    </Badge>
                    <Badge variant={PAYMENT_BADGE[booking.payment_status] || "gray"} size="sm">
                        {booking.payment_status}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 text-xs font-sans text-warmgray">
                    <div>
                        <p className="uppercase tracking-wider font-semibold mb-0.5">Check-in</p>
                        <p className="text-ocean-dark font-medium">{formatDate(booking.check_in)}</p>
                    </div>
                    <div>
                        <p className="uppercase tracking-wider font-semibold mb-0.5">Check-out</p>
                        <p className="text-ocean-dark font-medium">{formatDate(booking.check_out)}</p>
                    </div>
                    <div>
                        <p className="uppercase tracking-wider font-semibold mb-0.5">Total</p>
                        <p className="text-ocean-dark font-medium">
                            {formatCurrency(booking.total_price, booking.currency)}
                        </p>
                    </div>
                </div>

                <p className="font-sans text-xs text-warmgray">
                    Booking #{booking.id.slice(0, 8).toUpperCase()} · Booked {formatDate(booking.created_at)}
                </p>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0">
                <a
                    href={`/dashboard/invoice/${booking.id}`}
                    className="flex items-center gap-1.5 text-xs font-sans font-medium text-ocean border border-ocean/20 bg-ocean/5 rounded-xl px-3 py-2 hover:bg-ocean/10 transition-colors"
                >
                    <Download size={13} /> Invoice
                </a>
                {upcoming && booking.booking_status !== "cancelled" && (
                    <form action={`/api/bookings/${booking.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 text-xs font-sans font-medium text-red-600 border border-red-200 bg-red-50 rounded-xl px-3 py-2 hover:bg-red-100 transition-colors w-full"
                        >
                            <XCircle size={13} /> Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
