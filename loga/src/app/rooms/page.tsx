import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { RoomCard } from "@/components/molecules/RoomCard";
import type { Room, RoomCategory } from "@/types";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Our Rooms",
    description:
        "Browse all rooms at Loga Guest House. Standard, Deluxe, Family, and Suite options available. Filter by guests and price.",
};

interface Props {
    searchParams: Promise<{
        category?: string;
        guests?: string;
        max_price?: string;
        check_in?: string;
        check_out?: string;
    }>;
}

const CATEGORIES: { value: string; label: string }[] = [
    { value: "", label: "All Rooms" },
    { value: "Standard", label: "Standard" },
    { value: "Deluxe", label: "Deluxe" },
    { value: "Family", label: "Family" },
    { value: "Suite", label: "Suite" },
];

export default async function RoomsPage({ searchParams }: Props) {
    const params = await searchParams;
    const supabase = await createClient();

    let query = supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (params.category) {
        query = query.eq("category", params.category as RoomCategory);
    }
    if (params.guests) {
        query = query.gte("max_guests", parseInt(params.guests));
    }
    if (params.max_price) {
        query = query.lte("price_usd", parseFloat(params.max_price));
    }

    const { data: rooms } = await query;
    const displayRooms = (rooms || []) as Room[];

    return (
        <main className="pt-24 pb-section">
            {/* Page header */}
            <div className="bg-gradient-tropical pt-10 pb-16">
                <div className="container-luxury">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
                        Accommodations
                    </p>
                    <h1 className="font-serif text-display-3 text-white">
                        Our Rooms & Suites
                    </h1>
                    <p className="font-sans text-base text-white/70 mt-2 max-w-xl">
                        Each room is thoughtfully designed to balance tropical character with
                        modern comfort.
                    </p>
                </div>
            </div>

            <div className="container-luxury -mt-6">
                {/* Filters */}
                <div className="glass-card rounded-2xl p-4 mb-10 flex flex-wrap items-center gap-3">
                    <span className="font-sans text-sm font-medium text-ocean-dark shrink-0">
                        Filter:
                    </span>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(({ value, label }) => {
                            const isActive = (params.category || "") === value;
                            const href = value
                                ? `/rooms?category=${value}${params.guests ? `&guests=${params.guests}` : ""}`
                                : `/rooms${params.guests ? `?guests=${params.guests}` : ""}`;
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`
                    font-sans text-sm px-4 py-1.5 rounded-full border transition-all duration-200
                    ${isActive
                                            ? "bg-ocean text-white border-ocean"
                                            : "bg-white text-ocean-dark border-coconut-darker hover:border-ocean/40"
                                        }
                  `}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Guests filter */}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="font-sans text-sm text-warmgray">Min guests:</span>
                        {[1, 2, 3, 4].map((n) => {
                            const isActive = params.guests === String(n);
                            return (
                                <Link
                                    key={n}
                                    href={`/rooms?guests=${n}${params.category ? `&category=${params.category}` : ""}`}
                                    className={`
                    font-sans text-sm w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200
                    ${isActive
                                            ? "bg-sand text-white border-sand"
                                            : "bg-white text-ocean-dark border-coconut-darker hover:border-sand/50"
                                        }
                  `}
                                >
                                    {n}
                                </Link>
                            );
                        })}
                        {params.guests && (
                            <Link href="/rooms" className="font-sans text-xs text-warmgray hover:text-red-500 transition-colors">
                                Clear
                            </Link>
                        )}
                    </div>
                </div>

                {/* Results count */}
                <p className="font-sans text-sm text-warmgray mb-6">
                    {displayRooms.length === 0
                        ? "No rooms match your filters"
                        : `${displayRooms.length} room${displayRooms.length !== 1 ? "s" : ""} available`}
                    {params.check_in && params.check_out && (
                        <span className="font-medium text-ocean ml-1">
                            · {params.check_in} to {params.check_out}
                        </span>
                    )}
                </p>

                {/* Rooms grid */}
                {displayRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayRooms.map((room, i) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                currency="USD"
                                avgRating={4.8}
                                reviewCount={18}
                                priority={i < 3}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="font-serif text-2xl text-ocean-dark mb-2">
                            No rooms found
                        </p>
                        <p className="font-sans text-warmgray mb-6">
                            Try adjusting your filters or contact us directly.
                        </p>
                        <Button variant="primary">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
