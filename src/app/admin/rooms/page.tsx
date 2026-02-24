import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { formatCurrency } from "@/lib/currency";
import { Plus, Edit, Eye, ToggleLeft } from "lucide-react";
import type { Room } from "@/types";

export default async function AdminRoomsPage() {
    const supabase = await createClient();
    const { data: rooms } = await supabase
        .from("rooms")
        .select("*")
        .order("sort_order", { ascending: true });

    const typedRooms = (rooms || []) as Room[];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-1">Management</p>
                    <h1 className="font-serif text-heading-1 text-ocean-dark">Rooms</h1>
                </div>
                <Button variant="primary" size="md" icon={<Plus size={15} />} iconPosition="left">
                    <Link href="/admin/rooms/new">Add Room</Link>
                </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-luxury overflow-hidden">
                <table className="w-full font-sans text-sm">
                    <thead className="bg-coconut">
                        <tr>
                            {["Room", "Category", "Price/night", "Guests", "Status", "Actions"].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-warmgray">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-coconut-darker">
                        {typedRooms.map((room) => (
                            <tr key={room.id} className="hover:bg-coconut/40 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        {room.cover_image && (
                                            <img src={room.cover_image} alt={room.title}
                                                className="w-12 h-10 rounded-lg object-cover shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium text-ocean-dark">{room.title}</p>
                                            <p className="text-xs text-warmgray font-mono">{room.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <Badge variant="sand" size="sm">{room.category}</Badge>
                                </td>
                                <td className="px-5 py-4">
                                    <div>
                                        <p className="font-medium text-ocean-dark">{formatCurrency(room.price_usd, "USD")}</p>
                                        <p className="text-xs text-warmgray">{formatCurrency(room.price_lkr, "LKR")}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-ocean-dark">{room.max_guests}</td>
                                <td className="px-5 py-4">
                                    <Badge variant={room.is_active ? "palm" : "gray"} size="sm" dot>
                                        {room.is_active ? "Active" : "Hidden"}
                                    </Badge>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-2">
                                        <Link href={`/rooms/${room.slug}`}
                                            className="p-1.5 rounded-lg text-warmgray hover:bg-ocean/8 hover:text-ocean transition-colors">
                                            <Eye size={15} />
                                        </Link>
                                        <Link href={`/admin/rooms/${room.id}/edit`}
                                            className="p-1.5 rounded-lg text-warmgray hover:bg-sand/10 hover:text-sand-dark transition-colors">
                                            <Edit size={15} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {typedRooms.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-warmgray">
                                    No rooms yet. Add your first room.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
