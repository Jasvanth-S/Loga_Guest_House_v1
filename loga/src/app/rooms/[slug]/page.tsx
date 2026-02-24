import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { StarRating } from "@/components/atoms/StarRating";
import { ReviewCard } from "@/components/molecules/ReviewCard";
import type { Room, Review, AddOnService } from "@/types";
import {
    Users, Wifi, Wind, Zap, CheckCircle, ArrowLeft,
    Share2, Heart
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: room } = await supabase
        .from("rooms")
        .select("title, description")
        .eq("slug", slug)
        .single();

    if (!room) return { title: "Room Not Found" };

    return {
        title: room.title,
        description: room.description?.slice(0, 160),
        openGraph: {
            title: `${room.title} | Loga Guest House`,
            description: room.description?.slice(0, 160),
        },
    };
}

export default async function RoomDetailPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: room } = await supabase
        .from("rooms")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!room) notFound();

    const typedRoom = room as Room;

    const [{ data: reviews }, { data: addOns }] = await Promise.all([
        supabase
            .from("reviews")
            .select("*, user:users(id, name, avatar_url)")
            .eq("room_id", room.id)
            .eq("is_approved", true)
            .order("created_at", { ascending: false })
            .limit(6),
        supabase
            .from("add_on_services")
            .select("*")
            .eq("is_active", true)
            .order("sort_order"),
    ]);

    const typedReviews = (reviews || []) as Review[];
    const typedAddOns = (addOns || []) as AddOnService[];
    const avgRating =
        typedReviews.length > 0
            ? typedReviews.reduce((s, r) => s + r.rating, 0) / typedReviews.length
            : 0;

    const allImages = [
        typedRoom.cover_image,
        ...(typedRoom.gallery || []),
    ].filter(Boolean);

    // JSON-LD schema for this room
    const schema = {
        "@context": "https://schema.org",
        "@type": "HotelRoom",
        name: typedRoom.title,
        description: typedRoom.description,
        image: allImages,
        priceRange: `$${typedRoom.price_usd}`,
        amenityFeature: typedRoom.amenities?.map((a) => ({
            "@type": "LocationFeatureSpecification",
            name: a.label,
            value: true,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <main className="pt-20">
                {/* Image gallery */}
                <section className="bg-ocean-dark">
                    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                        {allImages.length > 0 ? (
                            <Image
                                src={allImages[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600"}
                                alt={typedRoom.title}
                                fill
                                priority
                                quality={90}
                                className="object-cover"
                            />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/50 to-transparent" />

                        {/* Back button */}
                        <Link
                            href="/rooms"
                            className="absolute top-6 left-6 glass-card-dark rounded-xl px-4 py-2 flex items-center gap-2 text-white text-sm font-sans font-medium hover:bg-white/20 transition-colors duration-200"
                        >
                            <ArrowLeft size={16} /> Rooms
                        </Link>

                        {/* Actions */}
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button className="glass-card-dark rounded-xl p-2.5 text-white hover:bg-white/20 transition-colors">
                                <Share2 size={18} />
                            </button>
                            <button className="glass-card-dark rounded-xl p-2.5 text-white hover:bg-white/20 transition-colors">
                                <Heart size={18} />
                            </button>
                        </div>

                        {/* Gallery grid overlay */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                {allImages.slice(1, 4).map((img, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white/40">
                                        <Image src={img} alt={`${typedRoom.title} ${i + 2}`} fill className="object-cover" />
                                    </div>
                                ))}
                                {allImages.length > 4 && (
                                    <div className="w-16 h-16 rounded-xl bg-ocean-dark/70 border-2 border-white/40 flex items-center justify-center text-white text-xs font-sans font-bold">
                                        +{allImages.length - 4}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Detail content */}
                <div className="container-luxury py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left: Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Header */}
                            <div>
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <Badge variant="sand">{typedRoom.category}</Badge>
                                            {typedRoom.eco_friendly && <Badge variant="palm" dot>Eco</Badge>}
                                            {typedRoom.beach_tag && <Badge variant="ocean" dot>Beach Access</Badge>}
                                            {typedRoom.hill_tag && <Badge variant="gray" dot>Hill Country View</Badge>}
                                        </div>
                                        <h1 className="font-serif text-heading-1 text-ocean-dark">
                                            {typedRoom.title}
                                        </h1>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-sans text-xs text-warmgray uppercase tracking-wider">From</p>
                                        <p className="font-serif text-3xl text-ocean-dark font-semibold">
                                            {formatCurrency(typedRoom.price_usd, "USD")}
                                        </p>
                                        <p className="font-sans text-sm text-warmgray">/night</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-warmgray font-sans">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={15} />
                                        <span>Up to {typedRoom.max_guests} guests</span>
                                    </div>
                                    {typedRoom.wifi_speed && (
                                        <div className="flex items-center gap-1.5">
                                            <Wifi size={15} />
                                            <span>{typedRoom.wifi_speed} WiFi</span>
                                        </div>
                                    )}
                                    {typedRoom.has_ac && (
                                        <div className="flex items-center gap-1.5">
                                            <Wind size={15} />
                                            <span>Air Conditioned</span>
                                        </div>
                                    )}
                                    {typedRoom.has_power_backup && (
                                        <div className="flex items-center gap-1.5">
                                            <Zap size={15} />
                                            <span>Power Backup</span>
                                        </div>
                                    )}
                                    {avgRating > 0 && (
                                        <StarRating rating={avgRating} size="sm" showValue />
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose-luxury">
                                <h2 className="font-serif text-heading-3 text-ocean-dark mb-3">About This Room</h2>
                                <p className="font-sans text-warmgray leading-relaxed">{typedRoom.description}</p>
                            </div>

                            {/* Amenities */}
                            {typedRoom.amenities?.length > 0 && (
                                <div>
                                    <h2 className="font-serif text-heading-3 text-ocean-dark mb-4">
                                        Amenities
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {typedRoom.amenities.map((amenity, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2.5 p-3 bg-coconut rounded-xl"
                                            >
                                                <span className="text-xl">{amenity.icon}</span>
                                                <span className="font-sans text-sm text-ocean-dark">{amenity.label}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2.5 p-3 bg-coconut rounded-xl">
                                            <CheckCircle size={18} className="text-palm shrink-0" />
                                            <span className="font-sans text-sm text-ocean-dark">Daily Housekeeping</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 bg-coconut rounded-xl">
                                            <CheckCircle size={18} className="text-palm shrink-0" />
                                            <span className="font-sans text-sm text-ocean-dark">Fresh Towels & Toiletries</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add-on services */}
                            {typedAddOns.length > 0 && (
                                <div>
                                    <h2 className="font-serif text-heading-3 text-ocean-dark mb-2">
                                        Add-on Services
                                    </h2>
                                    <p className="font-sans text-sm text-warmgray mb-4">
                                        Enhance your stay with our curated services
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {typedAddOns.slice(0, 6).map((service) => (
                                            <div
                                                key={service.id}
                                                className="flex items-center justify-between p-4 border border-coconut-darker rounded-2xl bg-white hover:shadow-luxury transition-shadow duration-200"
                                            >
                                                <div>
                                                    <p className="font-sans text-sm font-medium text-ocean-dark">
                                                        {service.name}
                                                    </p>
                                                    <p className="font-sans text-xs text-warmgray line-clamp-1">
                                                        {service.description}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4 shrink-0">
                                                    <p className="font-sans text-sm font-semibold text-ocean">
                                                        {formatCurrency(service.price_usd, "USD")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews */}
                            {typedReviews.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-serif text-heading-3 text-ocean-dark">
                                            Guest Reviews
                                        </h2>
                                        {avgRating > 0 && (
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={avgRating} size="md" showValue />
                                                <span className="font-sans text-sm text-warmgray">
                                                    ({typedReviews.length})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {typedReviews.map((review) => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Booking CTA */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white rounded-3xl shadow-luxury-md p-6 border border-coconut-darker">
                                <div className="mb-5">
                                    <p className="font-sans text-xs text-warmgray uppercase tracking-wider">
                                        Starting from
                                    </p>
                                    <div className="flex items-baseline gap-1.5">
                                        <p className="font-serif text-3xl text-ocean-dark font-semibold">
                                            {formatCurrency(typedRoom.price_usd, "USD")}
                                        </p>
                                        <span className="font-sans text-sm text-warmgray">/night</span>
                                    </div>
                                    <p className="font-sans text-xs text-warmgray mt-0.5">
                                        {formatCurrency(typedRoom.price_lkr, "LKR")} · taxes included
                                    </p>
                                </div>

                                <div className="border border-coconut-darker rounded-2xl overflow-hidden mb-4">
                                    <div className="grid grid-cols-2 divide-x divide-coconut-darker">
                                        <div className="p-3">
                                            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-warmgray">Check-in</p>
                                            <p className="font-sans text-sm font-medium text-ocean-dark">Select date</p>
                                        </div>
                                        <div className="p-3">
                                            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-warmgray">Check-out</p>
                                            <p className="font-sans text-sm font-medium text-ocean-dark">Select date</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-coconut-darker p-3">
                                        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-warmgray">Guests</p>
                                        <p className="font-sans text-sm font-medium text-ocean-dark">2 guests</p>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    className="mb-3"
                                >
                                    <Link
                                        href={`/booking?room=${typedRoom.id}&slug=${typedRoom.slug}`}
                                        className="w-full text-center"
                                    >
                                        Book This Room
                                    </Link>
                                </Button>

                                <a
                                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi! I'm interested in the ${typedRoom.title}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full border border-[#25D366]/30 text-[#25D366] bg-[#25D366]/8 rounded-xl py-2.5 text-sm font-sans font-medium hover:bg-[#25D366]/15 transition-colors duration-200"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Ask on WhatsApp
                                </a>

                                <div className="mt-4 pt-4 border-t border-coconut-darker space-y-2">
                                    {[
                                        "Free cancellation up to 48h",
                                        "No booking fee",
                                        "Instant confirmation",
                                        `Min stay: ${typedRoom.min_stay_nights} night${typedRoom.min_stay_nights > 1 ? "s" : ""}`,
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-xs text-warmgray font-sans">
                                            <CheckCircle size={13} className="text-palm shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
