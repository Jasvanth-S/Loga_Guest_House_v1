import Image from "next/image";
import { BookingWidget } from "@/components/molecules/BookingWidget";
import { MapPin, Star } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col">
            {/* Background image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=85"
                    alt="Loga Guest House Sri Lanka — Tropical luxury accommodation"
                    fill
                    priority
                    quality={90}
                    className="object-cover object-center"
                    sizes="100vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-hero" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-coconut to-transparent" />
            </div>

            {/* Content */}
            <div className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-32 container-luxury">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Location pill */}
                    <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
                        <MapPin size={13} className="text-sand-light" />
                        <span className="font-sans text-xs font-medium text-white/90 tracking-wide">
                            Sri Lanka · Tropical Boutique Guesthouse
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="font-serif text-display-2 md:text-display-1 text-white mb-4 animate-fade-up animate-fade-up-delay-1">
                        Your{" "}
                        <span className="italic text-sand-light">Paradise</span>
                        <br />
                        Awaits in Sri Lanka
                    </h1>

                    {/* Subheading */}
                    <p className="font-sans text-lg md:text-xl text-white/75 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-delay-2">
                        Experience tropical luxury, warm Sri Lankan hospitality, and
                        unforgettable moments at Loga Guest House.
                    </p>

                    {/* Social proof badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-up animate-fade-up-delay-3">
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        size={13}
                                        className="fill-sand-light text-sand-light"
                                    />
                                ))}
                            </div>
                            <span className="font-sans text-sm text-white font-medium">
                                4.9 · Google Reviews
                            </span>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="font-sans text-sm text-white/90">
                                🌿 Eco-Certified
                            </span>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                            <span className="font-sans text-sm text-white/90">
                                ⚡ 100 Mbps WiFi
                            </span>
                        </div>
                    </div>

                    {/* Booking widget */}
                    <div className="animate-fade-up animate-fade-up-delay-4 w-full max-w-2xl mx-auto">
                        <BookingWidget />
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="font-sans text-xs text-white/50 uppercase tracking-widest">
                    Explore
                </span>
                <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
            </div>
        </section>
    );
}
