import Link from "next/link";
import {
    MapPin, Phone, Mail, Instagram, Facebook, Twitter,
    Shield, Star, Leaf, Wifi
} from "lucide-react";

const ROOMS = ["Standard Room", "Deluxe Room", "Family Suite", "Luxury Suite"];
const QUICK_LINKS = [
    { label: "Our Rooms", href: "/rooms" },
    { label: "Experiences", href: "/experiences" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
];
const POLICIES = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Cookie Policy", href: "/cookies" },
];

const TRUST_BADGES = [
    { icon: Shield, label: "Secure Booking" },
    { icon: Star, label: "Top Rated" },
    { icon: Leaf, label: "Eco Certified" },
    { icon: Wifi, label: "100 Mbps WiFi" },
];

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-ocean-dark text-white/80">
            {/* Trust badges strip */}
            <div className="border-b border-white/10">
                <div className="container-luxury py-6">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
                        {TRUST_BADGES.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-2 text-sand-light">
                                <Icon size={16} />
                                <span className="font-sans text-sm font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="container-luxury py-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <p className="font-serif text-3xl text-white mb-1">
                            <span className="italic">Loga</span>
                        </p>
                        <p className="font-sans text-xs uppercase tracking-widest text-sand/70 mb-4">
                            Guest House · Sri Lanka
                        </p>
                        <p className="font-sans text-sm leading-relaxed text-white/60 mb-5">
                            A boutique tropical retreat where Sri Lankan warmth meets modern luxury.
                            Your perfect island escape awaits.
                        </p>
                        {/* Social */}
                        <div className="flex gap-3">
                            {[
                                { Icon: Instagram, href: "#", label: "Instagram" },
                                { Icon: Facebook, href: "#", label: "Facebook" },
                                { Icon: Twitter, href: "#", label: "Twitter" },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-sand hover:bg-sand/10 transition-all duration-200"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Rooms */}
                    <div>
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-4">
                            Our Rooms
                        </p>
                        <ul className="space-y-2.5">
                            {ROOMS.map((room) => (
                                <li key={room}>
                                    <Link
                                        href="/rooms"
                                        className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-200"
                                    >
                                        {room}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-4">
                            Quick Links
                        </p>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="font-sans text-sm text-white/60 hover:text-white transition-colors duration-200"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-4">
                            Get In Touch
                        </p>
                        <div className="space-y-3">
                            <a
                                href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
                                className="flex items-start gap-2.5 text-white/60 hover:text-white transition-colors duration-200 group"
                            >
                                <Phone size={15} className="shrink-0 mt-0.5 group-hover:text-sand transition-colors" />
                                <span className="font-sans text-sm">
                                    {process.env.NEXT_PUBLIC_PHONE_NUMBER || "+94 77 123 4567"}
                                </span>
                            </a>
                            <a
                                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                                className="flex items-start gap-2.5 text-white/60 hover:text-white transition-colors duration-200 group"
                            >
                                <Mail size={15} className="shrink-0 mt-0.5 group-hover:text-sand transition-colors" />
                                <span className="font-sans text-sm">
                                    {process.env.NEXT_PUBLIC_EMAIL || "hello@logaguesthouse.lk"}
                                </span>
                            </a>
                            <div className="flex items-start gap-2.5 text-white/60">
                                <MapPin size={15} className="shrink-0 mt-0.5" />
                                <span className="font-sans text-sm">Sri Lanka</span>
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94000000000"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] rounded-xl px-4 py-2 text-sm font-sans font-medium hover:bg-[#25D366]/25 transition-colors duration-200"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="container-luxury py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="font-sans text-xs text-white/40">
                        © {year} Loga Guest House. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {POLICIES.map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                className="font-sans text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
