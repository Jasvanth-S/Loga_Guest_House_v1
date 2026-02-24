import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/atoms/Badge";
import {
    TrendingUp, Users, BedDouble, DollarSign,
    Calendar, Star, ArrowUpRight
} from "lucide-react";

const STATUS_BADGE: Record<string, "palm" | "sand" | "red" | "gray"> = {
    confirmed: "palm", pending: "sand", cancelled: "red", completed: "gray",
};

export default async function AdminPage() {
    const supabase = await createClient();

    const [{ data: rooms }, { data: bookings }, { data: reviews }, { data: users }] = await Promise.all([
        supabase.from("rooms").select("id, title, is_active").order("sort_order"),
        supabase.from("bookings")
            .select("*, room:rooms(title, slug), user:users(name, email)")
            .order("created_at", { ascending: false })
            .limit(10),
        supabase.from("reviews").select("id, rating, is_approved").eq("is_approved", false),
        supabase.from("users").select("id").eq("role", "guest"),
    ]);

    const allBookings = bookings || [];
    const totalRevenue = allBookings
        .filter(b => b.payment_status === "paid")
        .reduce((s: number, b) => s + (b.total_price || 0), 0);

    const confirmedCount = allBookings.filter(b => b.booking_status === "confirmed").length;
    const pendingCount = allBookings.filter(b => b.booking_status === "pending").length;

    const stats = [
        { label: "Total Revenue", value: formatCurrency(totalRevenue, "USD"), icon: DollarSign, color: "bg-ocean/8 text-ocean", change: "+12% this month" },
        { label: "Total Bookings", value: allBookings.length, icon: Calendar, color: "bg-sand/10 text-sand-dark", change: `${confirmedCount} confirmed` },
        { label: "Active Guests", value: (users || []).length, icon: Users, color: "bg-palm/10 text-palm", change: `${pendingCount} pending reviews` },
        { label: "Pending Reviews", value: (reviews || []).length, icon: Star, color: "bg-red-50 text-red-500", change: "Awaiting approval" },
    ];

    return (
        <div>
            <div className="mb-8">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-1">Admin Panel</p>
                <h1 className="font-serif text-heading-1 text-ocean-dark">Dashboard Overview</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                {stats.map(({ label, value, icon: Icon, color, change }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-luxury">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                                <Icon size={20} />
                            </div>
                            <span className="flex items-center gap-1 text-xs text-palm font-sans">
                                <ArrowUpRight size={12} /> {change}
                            </span>
                        </div>
                        <p className="font-serif text-3xl text-ocean-dark font-medium mb-0.5">{value}</p>
                        <p className="font-sans text-xs text-warmgray">{label}</p>
                    </div>
                ))}
            </div>

            {/* Revenue chart placeholder */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-luxury p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-serif text-heading-3 text-ocean-dark">Revenue Overview</h2>
                        <span className="font-sans text-xs text-warmgray">Last 6 months</span>
                    </div>
                    {/* Simulated bar chart */}
                    <div className="flex items-end gap-3 h-40">
                        {[
                            { m: "Sep", v: 60 }, { m: "Oct", v: 75 }, { m: "Nov", v: 85 },
                            { m: "Dec", v: 100 }, { m: "Jan", v: 70 }, { m: "Feb", v: 90 },
                        ].map(({ m, v }) => (
                            <div key={m} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-xl bg-gradient-ocean transition-all duration-500"
                                    style={{ height: `${v}%`, minHeight: "8px" }}
                                />
                                <span className="font-sans text-xs text-warmgray">{m}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-coconut-darker flex gap-6">
                        <div>
                            <p className="font-sans text-xs text-warmgray">This Month</p>
                            <p className="font-sans font-semibold text-ocean-dark text-sm">{formatCurrency(totalRevenue, "USD")}</p>
                        </div>
                        <div>
                            <p className="font-sans text-xs text-warmgray">Occupancy</p>
                            <p className="font-sans font-semibold text-palm text-sm">72%</p>
                        </div>
                    </div>
                </div>

                {/* Room status */}
                <div className="bg-white rounded-3xl shadow-luxury p-6">
                    <h2 className="font-serif text-heading-3 text-ocean-dark mb-5">Room Status</h2>
                    <div className="space-y-3">
                        {(rooms || []).map((room) => (
                            <div key={room.id} className="flex items-center justify-between">
                                <p className="font-sans text-sm text-ocean-dark truncate flex-1 mr-3">{room.title}</p>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${room.is_active ? "bg-palm" : "bg-warmgray/40"}`} />
                            </div>
                        ))}
                        {(rooms || []).length === 0 && (
                            <p className="font-sans text-sm text-warmgray">No rooms added yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-3xl shadow-luxury overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-coconut-darker">
                    <h2 className="font-serif text-heading-3 text-ocean-dark">Recent Bookings</h2>
                    <span className="font-sans text-xs text-warmgray">{allBookings.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full font-sans text-sm">
                        <thead className="bg-coconut">
                            <tr>
                                {["Booking ID", "Guest", "Room", "Check-in", "Check-out", "Total", "Status"].map(h => (
                                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-warmgray">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coconut-darker">
                            {allBookings.slice(0, 8).map((b: any) => (
                                <tr key={b.id} className="hover:bg-coconut/50 transition-colors">
                                    <td className="px-5 py-3 text-ocean font-mono text-xs">{b.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="px-5 py-3">
                                        <div>
                                            <p className="text-ocean-dark font-medium">{b.user?.name || "—"}</p>
                                            <p className="text-xs text-warmgray">{b.user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-ocean-dark">{b.room?.title || "—"}</td>
                                    <td className="px-5 py-3 text-warmgray">{formatDate(b.check_in)}</td>
                                    <td className="px-5 py-3 text-warmgray">{formatDate(b.check_out)}</td>
                                    <td className="px-5 py-3 font-medium text-ocean-dark">
                                        {formatCurrency(b.total_price, b.currency)}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge variant={STATUS_BADGE[b.booking_status] || "gray"} size="sm" dot>
                                            {b.booking_status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {allBookings.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-warmgray font-sans">
                                        No bookings yet. Once guests book, they will appear here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
