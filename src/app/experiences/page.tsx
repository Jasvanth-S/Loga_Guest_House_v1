import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Car } from "lucide-react";

export const metadata: Metadata = {
    title: "Local Experiences",
    description:
        "Discover nearby attractions from Loga Guest House — Sigiriya, Ella, Galle Fort, Bentota Beach, and more iconic Sri Lankan destinations.",
};

const ATTRACTIONS = [
    {
        id: 1, name: "Sigiriya Rock Fortress",
        location: "Sigiriya, Central Province",
        distance: "~120 km",
        travel_time: "3–4 hours",
        description:
            "A UNESCO World Heritage Site, Sigiriya Lion Rock is Sri Lanka's most iconic landmark. The 5th-century citadel offers breathtaking panoramic views from its summit. Climb through cloud gardens, ancient frescoes, and lion-paw gates to reach the top.",
        image: "https://images.unsplash.com/photo-1580181236-5e26c2f89cdd?w=800&q=80",
        map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d80.7605!3d7.9571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afce00a28b5bfbb%3A0x4c0b98f2e45db5f9!2sSigiriya!5e0!3m2!1sen!2slk!4v1706000000000",
        tags: ["UNESCO Heritage", "Hiking", "History", "Photography"],
    },
    {
        id: 2, name: "Ella & Nine Arch Bridge",
        location: "Ella, Uva Province",
        distance: "~150 km",
        travel_time: "4–5 hours",
        description:
            "Ella is Sri Lanka's most scenic hill country village, famous for the iconic Nine Arch Bridge, Little Adam's Peak hike, and stunning tea plantation landscapes. Take the legendary Kandy–Ella train journey for the most scenic rail route in Asia.",
        image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&q=80",
        map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.2!2d81.0431!3d6.8652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4698dea0bf7d5%3A0xb0a0e4aac4e2d21!2sElla!5e0!3m2!1sen!2slk!4v1706000000000",
        tags: ["Scenic Train", "Hill Country", "Tea Plantations", "Hiking"],
    },
    {
        id: 3, name: "Galle Fort",
        location: "Galle, Southern Province",
        distance: "~90 km",
        travel_time: "2.5 hours",
        description:
            "The Dutch Colonial fortified city of Galle is a living museum of history, art, and culture. Walk the ancient ramparts at sunset, explore boutique shops and cafés in colonial buildings, and discover the city's rich trading history from the port.",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.6!2d80.2170!3d6.0300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173a4fe6ef8c9%3A0x1a1b5e35d3c0a461!2sGalle%20Fort!5e0!3m2!1sen!2slk!4v1706000000000",
        tags: ["UNESCO Heritage", "Shopping", "History", "Sunset Views"],
    },
    {
        id: 4, name: "Bentota Beach",
        location: "Bentota, Western Province",
        distance: "~60 km",
        travel_time: "1.5 hours",
        description:
            "One of Sri Lanka's most beautiful beaches, Bentota offers pristine golden sands, warm turquoise waters, and excellent water sports. Perfect for windsurfing, jet-skiing, and leisurely snorkelling in the calm lagoon.",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        map_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.1!2d80.0012!3d6.4257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae24d98c30c4a5d%3A0x92f42a099b9dc1fb!2sBentota!5e0!3m2!1sen!2slk!4v1706000000000",
        tags: ["Beach", "Water Sports", "Relaxation", "Lagoon"],
    },
];

export default function ExperiencesPage() {
    return (
        <main className="pt-24 pb-section">
            <div className="bg-gradient-tropical pt-10 pb-16">
                <div className="container-luxury">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">Nearby Destinations</p>
                    <h1 className="font-serif text-display-3 text-white">Local Experiences</h1>
                    <p className="font-sans text-base text-white/70 mt-2 max-w-xl">
                        From ancient rock fortresses to pristine beaches — Sri Lanka's finest experiences await just beyond our doors.
                    </p>
                </div>
            </div>

            <div className="container-luxury -mt-4">
                <div className="space-y-16 pt-8">
                    {ATTRACTIONS.map((attr, i) => (
                        <div key={attr.id}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                            {/* Image */}
                            <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-luxury-md ${i % 2 === 1 ? "lg:col-start-2" : ""}`}>
                                <Image src={attr.image} alt={attr.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                                    {attr.tags.map((tag) => (
                                        <span key={tag} className="text-xs font-sans font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-2.5 py-1">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className={i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2 block">
                                    Attraction {String(i + 1).padStart(2, "0")}
                                </span>
                                <h2 className="font-serif text-heading-1 text-ocean-dark mb-3">{attr.name}</h2>
                                <div className="flex flex-wrap gap-4 mb-4 text-sm text-warmgray font-sans">
                                    <div className="flex items-center gap-1.5"><MapPin size={14} className="text-sand" />{attr.location}</div>
                                    <div className="flex items-center gap-1.5"><Car size={14} className="text-sand" />{attr.distance}</div>
                                    <div className="flex items-center gap-1.5"><Clock size={14} className="text-sand" />{attr.travel_time} drive</div>
                                </div>
                                <p className="font-sans text-warmgray leading-relaxed mb-6">{attr.description}</p>

                                {/* Map embed */}
                                <div className="rounded-2xl overflow-hidden shadow-luxury h-44 border border-coconut-darker">
                                    <iframe src={attr.map_embed} width="100%" height="100%"
                                        title={`Map of ${attr.name}`} style={{ border: 0 }}
                                        allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Book transport CTA */}
                <div className="mt-16 bg-gradient-tropical rounded-3xl p-10 text-center text-white">
                    <h3 className="font-serif text-heading-2 mb-3">Need Transport?</h3>
                    <p className="font-sans text-white/75 text-base max-w-lg mx-auto mb-6">
                        We arrange private tuk-tuk tours, driver guides, and air-conditioned van transfers to all Sri Lanka attractions.
                    </p>
                    <Link href="/contact"
                        className="inline-flex items-center gap-2 bg-sand hover:bg-sand-dark text-white font-sans font-medium px-8 py-3.5 rounded-xl transition-colors duration-200">
                        Arrange Transport →
                    </Link>
                </div>
            </div>
        </main>
    );
}
