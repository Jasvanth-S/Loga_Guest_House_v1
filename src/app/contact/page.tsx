import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Get in touch with Loga Guest House. WhatsApp, call, or email us for enquiries and bookings.",
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94000000000";
const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+94 77 123 4567";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "hello@logaguesthouse.lk";

const CHANNELS = [
    {
        icon: "💬",
        label: "WhatsApp (Fastest)",
        value: "+94 77 123 4567",
        href: `https://wa.me/${WHATSAPP}`,
        cta: "Chat Now",
        color: "bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366]",
    },
    {
        icon: "📞",
        label: "Direct Call",
        value: PHONE,
        href: `tel:${PHONE.replace(/\s/g, "")}`,
        cta: "Call Now",
        color: "bg-ocean/8 border-ocean/30 text-ocean",
    },
    {
        icon: "✉️",
        label: "Email",
        value: EMAIL,
        href: `mailto:${EMAIL}`,
        cta: "Send Email",
        color: "bg-sand/10 border-sand/30 text-sand-dark",
    },
    {
        icon: "📍",
        label: "Location",
        value: "Sri Lanka",
        href: "https://maps.google.com/?q=Sri+Lanka",
        cta: "View Map",
        color: "bg-palm/8 border-palm/20 text-palm",
    },
];

export default function ContactPage() {
    return (
        <main className="pt-24 pb-section">
            {/* Hero */}
            <div className="bg-gradient-tropical pt-10 pb-16">
                <div className="container-luxury">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
                        Get In Touch
                    </p>
                    <h1 className="font-serif text-display-3 text-white">Contact Us</h1>
                    <p className="font-sans text-base text-white/70 mt-2 max-w-xl">
                        We're here to help you plan the perfect Sri Lanka stay. Reach out via any channel.
                    </p>
                </div>
            </div>

            <div className="container-luxury -mt-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact channel cards */}
                    <div className="lg:col-span-1 space-y-4">
                        {CHANNELS.map(({ icon, label, value, href, cta, color }) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="block p-5 rounded-2xl border border-coconut-darker bg-white shadow-luxury hover:shadow-luxury-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{icon}</span>
                                    <div>
                                        <p className="font-sans text-xs text-warmgray uppercase tracking-wider mb-1">
                                            {label}
                                        </p>
                                        <p className="font-sans text-sm font-medium text-ocean-dark">{value}</p>
                                        <span
                                            className={`inline-block mt-2 text-xs font-sans font-semibold px-3 py-1 rounded-full border ${color}`}
                                        >
                                            {cta} →
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}

                        {/* Google Maps preview */}
                        <div className="rounded-2xl overflow-hidden shadow-luxury h-48 bg-coconut-darker">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4049968.0295890584!2d80.7718!3d7.8731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slk!4v1706000000000"
                                width="100%"
                                height="100%"
                                title="Loga Guest House location — Sri Lanka"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Client-side contact form */}
                    <ContactForm />
                </div>
            </div>
        </main>
    );
}
