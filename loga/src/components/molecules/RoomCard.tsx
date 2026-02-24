"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import type { Room, Currency } from "@/types";
import { Badge } from "@/components/atoms/Badge";
import { StarRating } from "@/components/atoms/StarRating";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface RoomCardProps {
    room: Room;
    currency?: Currency;
    avgRating?: number;
    reviewCount?: number;
    className?: string;
    priority?: boolean;
}

const CATEGORY_VARIANTS: Record<string, "ocean" | "sand" | "palm" | "gray"> = {
    Suite: "ocean",
    Deluxe: "sand",
    Family: "palm",
    Standard: "gray",
};

export function RoomCard({
    room,
    currency = "USD",
    avgRating = 0,
    reviewCount = 0,
    className,
    priority = false,
}: RoomCardProps) {
    const price = currency === "LKR" ? room.price_lkr : room.price_usd;

    return (
        <Link
            href={`/rooms/${room.slug}`}
            className={cn(
                "group block bg-white rounded-3xl overflow-hidden shadow-luxury",
                "hover:shadow-luxury-lg hover:-translate-y-1",
                "transition-all duration-300 ease-luxury",
                className
            )}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={room.cover_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
                    alt={room.title}
                    fill
                    priority={priority}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant={CATEGORY_VARIANTS[room.category] || "gray"} size="sm">
                        {room.category}
                    </Badge>
                </div>

                {/* Tags */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                    {room.eco_friendly && (
                        <Badge variant="glass" size="sm">🌿 Eco</Badge>
                    )}
                    {room.beach_tag && (
                        <Badge variant="glass" size="sm">🌊 Beach</Badge>
                    )}
                    {room.hill_tag && (
                        <Badge variant="glass" size="sm">⛰️ Hill</Badge>
                    )}
                </div>

                {/* Arrow on hover */}
                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full glass-card flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={16} className="text-ocean" />
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Rating */}
                {avgRating > 0 && (
                    <div className="mb-2">
                        <StarRating rating={avgRating} size="sm" showValue />
                        {reviewCount > 0 && (
                            <span className="text-xs text-warmgray ml-1">
                                ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                            </span>
                        )}
                    </div>
                )}

                {/* Title */}
                <h3 className="font-serif text-xl text-ocean-dark mb-1 group-hover:text-ocean transition-colors duration-200">
                    {room.title}
                </h3>

                {/* Guests */}
                <div className="flex items-center gap-1.5 text-warmgray mb-4">
                    <Users size={14} />
                    <span className="font-sans text-sm">Up to {room.max_guests} guests</span>
                    {room.wifi_speed && (
                        <>
                            <span className="text-coconut-dark">·</span>
                            <span className="font-sans text-sm">WiFi {room.wifi_speed}</span>
                        </>
                    )}
                </div>

                {/* Amenities preview */}
                {room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {room.amenities.slice(0, 4).map((amenity, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 text-xs text-warmgray bg-coconut rounded-lg px-2 py-1"
                            >
                                <span>{amenity.icon}</span>
                                <span>{amenity.label}</span>
                            </span>
                        ))}
                        {room.amenities.length > 4 && (
                            <span className="text-xs text-ocean-light">
                                +{room.amenities.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Price */}
                <div className="flex items-end justify-between">
                    <div>
                        <span className="font-sans text-xs text-warmgray uppercase tracking-wider">
                            From
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-serif text-2xl font-semibold text-ocean-dark">
                                {formatCurrency(price, currency)}
                            </span>
                            <span className="font-sans text-sm text-warmgray">/night</span>
                        </div>
                    </div>

                    <span className="font-sans text-sm font-medium text-ocean border border-ocean/20 bg-ocean/5 rounded-xl px-3 py-1.5 group-hover:bg-ocean group-hover:text-white transition-all duration-200">
                        View Room
                    </span>
                </div>
            </div>
        </Link>
    );
}
