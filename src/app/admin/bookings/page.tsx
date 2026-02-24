import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/atoms/Badge";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE: Record<string, "palm" | "sand" | "red" | "gray"> = {
    confirmed: "palm", pending: "sand", cancelled: "red", completed: "gray",
};

export default async function AdminBookingsPage() {
    const supabase = await createClient();
    const { data: bookings } = await supabase
        .from("bookings")
        .select("*, room:rooms(title, slug), user:users(name, email)")
        .order("created_at", { ascending: false })
        .limit(50);

    const allBookings = (bookings || []) as any[];
    const totalRevenue = allBookings.filter(b => b.payment_status === "paid")
        .reduce((s, b) => s + (b.total_price || 0), 0);

    return (
        <div>
            <div className="mb-8">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-1">Management</p>
                <h1 className="font-serif text-heading-1 text-ocean-dark">All Bookings</h1>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
                {[
                    { label: "Total", value: allBookings.length, color: "bg-ocean/8 text-ocean" },
                    { label: "Confirmed", value: allBookings.filter(b => b.booking_status === "confirmed").length, color: "bg-palm/10 text-palm" },
                    { label: "Pending", value: allBookings.filter(b => b.booking_status === "pending").length, color: "bg-sand/10 text-sand-dark" },
                    { label: "Revenue (paid)", value: formatCurrency(totalRevenue, "USD"), color: "bg-ocean/8 text-ocean" },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 shadow-luxury">
                        <p className="font-sans text-xs text-warmgray uppercase tracking-wider mb-1">{label}</p>
                        <p className={`font-serif text-2xl font-medium ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-luxury overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full font-sans text-sm min-w-[800px]">
                        <thead className="bg-coconut">
                            <tr>
                                {["ID", "Guest", "Room", "Check-in", "Check-out", "Nights", "Total", "Status", "Payment"].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-warmgray">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-coconut-darker">
                            {allBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-coconut/40 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-ocean">{b.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-ocean-dark truncate max-w-[120px]">{b.user?.name || "—"}</p>
                                        <p className="text-xs text-warmgray truncate max-w-[120px]">{b.user?.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-ocean-dark max-w-[120px] truncate">{b.room?.title || "—"}</td>
                                    <td className="px-4 py-3 text-warmgray whitespace-nowrap">{formatDate(b.check_in)}</td>
                                    <td className="px-4 py-3 text-warmgray whitespace-nowrap">{formatDate(b.check_out)}</td>
                                    <td className="px-4 py-3 text-ocean-dark">{b.nights}</td>
                                    <td className="px-4 py-3 font-medium text-ocean-dark whitespace-nowrap">
                                        {formatCurrency(b.total_price, b.currency)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={STATUS_BADGE[b.booking_status] || "gray"} size="sm" dot>
                                            {b.booking_status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={b.payment_status === "paid" ? "palm" : b.payment_status === "partial" ? "sand" : "gray"} size="sm">
                                            {b.payment_status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {allBookings.length === 0 && (
                                <tr><td colSpan={9} className="px-5 py-12 text-center text-warmgray">No bookings yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
