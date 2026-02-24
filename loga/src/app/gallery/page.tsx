import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
    title: "Gallery",
    description:
        "Browse stunning photographs of Loga Guest House — rooms, pool, gardens, and tropical surroundings in Sri Lanka.",
};

const DEMO_IMAGES = [
    { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", alt: "Tropical pool view", category: "Pool" },
    { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", alt: "Deluxe room interior", category: "Rooms" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", alt: "Garden suite", category: "Rooms" },
    { src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80", alt: "Tropical garden", category: "Nature" },
    { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80", alt: "Cozy bedroom", category: "Rooms" },
    { src: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80", alt: "Beachfront dining", category: "Dining" },
    { src: "https://images.unsplash.com/photo-1602152294186-5b1a00be3499?w=800&q=80", alt: "Sri Lankan landscape", category: "Nature" },
    { src: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", alt: "Beach nearby", category: "Beach" },
    { src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80", alt: "Galle Fort nearby", category: "Experiences" },
    { src: "https://images.unsplash.com/photo-1580181236-5e26c2f89cdd?w=800&q=80", alt: "Sigiriya nearby", category: "Experiences" },
    { src: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80", alt: "Sri Lankan breakfast", category: "Dining" },
    { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", alt: "Spa treatment", category: "Wellness" },
];

const CATEGORIES = ["All", "Rooms", "Pool", "Dining", "Nature", "Beach", "Wellness", "Experiences"];

export default async function GalleryPage() {
    // Try to load images from Supabase rooms gallery
    let images = DEMO_IMAGES;
    try {
        const supabase = await createClient();
        const { data: rooms } = await supabase.from("rooms").select("gallery, cover_image, title").eq("is_active", true);
        if (rooms && rooms.length > 0) {
            const dbImages = rooms.flatMap((r) => [
                r.cover_image && { src: r.cover_image, alt: r.title, category: "Rooms" },
                ...(r.gallery || []).map((img: string) => ({ src: img, alt: r.title, category: "Rooms" })),
            ]).filter(Boolean) as typeof DEMO_IMAGES;
            if (dbImages.length >= 4) images = dbImages;
        }
    } catch { }

    return (
        <main className="pt-24 pb-section">
            <div className="bg-gradient-tropical pt-10 pb-16">
                <div className="container-luxury">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">Visual Story</p>
                    <h1 className="font-serif text-display-3 text-white">Gallery</h1>
                    <p className="font-sans text-base text-white/70 mt-2 max-w-xl">
                        A glimpse into the Loga experience — captured in moments of tropical beauty.
                    </p>
                </div>
            </div>

            <div className="container-luxury -mt-4 pt-6">
                {/* Category tabs (client-side filtering via JS approach) */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATEGORIES.map((cat) => (
                        <span key={cat}
                            className="font-sans text-sm px-4 py-1.5 rounded-full border border-coconut-darker bg-white text-ocean-dark hover:border-ocean/40 hover:bg-ocean/5 cursor-pointer transition-all duration-200 first:bg-ocean first:text-white first:border-ocean">
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Masonry-style gallery grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {images.map((img, i) => (
                        <div key={i}
                            className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-300 cursor-pointer">
                            <div className="relative" style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "3/2" : "1/1" }}>
                                <Image
                                    src={img.src} alt={img.alt} fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    loading={i < 4 ? "eager" : "lazy"}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="font-sans text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-2.5 py-1">
                                        {img.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
