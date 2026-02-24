import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/organisms/HeroSection";
import { RoomCard } from "@/components/molecules/RoomCard";
import { BlogCard } from "@/components/molecules/BlogCard";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import Image from "next/image";
import {
  Wifi, Wind, Zap, Car, Shield, Leaf, MapPin,
  Star, Phone, ArrowRight, CheckCircle
} from "lucide-react";
import type { Room, BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Loga Guest House | Boutique Stay in Sri Lanka",
  description:
    "Experience tropical luxury at Loga Guest House, Sri Lanka. Book our boutique rooms, explore local experiences, and enjoy authentic island hospitality.",
};

const AMENITIES = [
  { icon: Wifi, label: "100 Mbps Fiber WiFi", desc: "Lightning fast internet" },
  { icon: Wind, label: "Air Conditioned", desc: "All rooms & common areas" },
  { icon: Zap, label: "Power Backup", desc: "Uninterrupted electricity" },
  { icon: Car, label: "Airport Pickup", desc: "Private AC transfer" },
  { icon: Shield, label: "24/7 Security", desc: "CCTV & safe environment" },
  { icon: Leaf, label: "Eco Certified", desc: "Sustainable practices" },
];

const TRUST_STATS = [
  { value: "500+", label: "Happy Guests" },
  { value: "4.9★", label: "Google Rating" },
  { value: "5+", label: "Years Experience" },
  { value: "100%", label: "Verified Reviews" },
];

const GOOGLE_REVIEWS = [
  {
    name: "Sarah M.",
    country: "🇬🇧 UK",
    rating: 5,
    text: "Absolutely stunning stay! The rooms are beautiful, staff incredibly welcoming, and the location perfect for exploring Sri Lanka.",
    avatar: "SM",
  },
  {
    name: "James T.",
    country: "🇺🇸 USA",
    rating: 5,
    text: "Best guesthouse experience in Sri Lanka. The breakfast was amazing, WiFi perfect for working remotely, and the pool was a bonus!",
    avatar: "JT",
  },
  {
    name: "Priya K.",
    country: "🇨🇦 Canada",
    rating: 5,
    text: "A hidden gem in Sri Lanka. Loga is warm, professional and the rooms felt luxurious. Will definitely return on my next visit!",
    avatar: "PK",
  },
];

async function getFeaturedRooms(): Promise<Room[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(3);
    return (data as Room[]) || [];
  } catch {
    return [];
  }
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return (data as BlogPost[]) || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featuredRooms, latestPosts] = await Promise.all([
    getFeaturedRooms(),
    getLatestPosts(),
  ]);

  // Demo rooms for when DB is empty
  const displayRooms =
    featuredRooms.length > 0
      ? featuredRooms
      : ([
        {
          id: "1",
          title: "Deluxe Tropical Room",
          slug: "deluxe-tropical",
          category: "Deluxe",
          description: "Spacious room with garden view",
          price_lkr: 18000,
          price_usd: 60,
          max_guests: 2,
          amenities: [
            { icon: "📶", label: "WiFi" },
            { icon: "❄️", label: "AC" },
            { icon: "🛁", label: "En-suite Bath" },
          ],
          cover_image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
          gallery: [],
          is_active: true,
          has_ac: true,
          has_power_backup: true,
          eco_friendly: true,
          beach_tag: false,
          hill_tag: true,
          min_stay_nights: 1,
          wifi_speed: "100 Mbps",
          sort_order: 1,
          created_at: "",
        },
        {
          id: "2",
          title: "Garden Suite",
          slug: "garden-suite",
          category: "Suite",
          description: "Private garden suite with plunge pool",
          price_lkr: 30000,
          price_usd: 100,
          max_guests: 3,
          amenities: [
            { icon: "🏊", label: "Pool" },
            { icon: "📶", label: "WiFi" },
            { icon: "🌿", label: "Garden" },
          ],
          cover_image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
          gallery: [],
          is_active: true,
          has_ac: true,
          has_power_backup: true,
          eco_friendly: true,
          beach_tag: false,
          hill_tag: false,
          min_stay_nights: 2,
          wifi_speed: "100 Mbps",
          sort_order: 2,
          created_at: "",
        },
        {
          id: "3",
          title: "Standard Room",
          slug: "standard-room",
          category: "Standard",
          description: "Cozy room with all essentials",
          price_lkr: 12000,
          price_usd: 40,
          max_guests: 2,
          amenities: [
            { icon: "📶", label: "WiFi" },
            { icon: "❄️", label: "AC" },
          ],
          cover_image:
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
          gallery: [],
          is_active: true,
          has_ac: true,
          has_power_backup: true,
          eco_friendly: false,
          beach_tag: true,
          hill_tag: false,
          min_stay_nights: 1,
          wifi_speed: "100 Mbps",
          sort_order: 3,
          created_at: "",
        },
      ] as unknown as Room[]);

  return (
    <div>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Amenities strip */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          {/* Heading */}
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
              Why Choose Loga
            </p>
            <h2 className="font-serif text-heading-1 text-ocean-dark">
              Every Comfort, Thoughtfully Provided
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {AMENITIES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-coconut transition-colors duration-200 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-ocean/8 flex items-center justify-center mb-3 group-hover:bg-ocean/15 transition-colors duration-200">
                  <Icon size={22} className="text-ocean" />
                </div>
                <p className="font-sans text-sm font-semibold text-ocean-dark mb-0.5">
                  {label}
                </p>
                <p className="font-sans text-xs text-warmgray">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Rooms */}
      <section className="section-padding bg-coconut">
        <div className="container-luxury">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
                Accommodations
              </p>
              <h2 className="font-serif text-heading-1 text-ocean-dark">
                Rooms Crafted for Serenity
              </h2>
            </div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ocean hover:gap-3 transition-all duration-200"
            >
              View All Rooms <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRooms.map((room, i) => (
              <RoomCard
                key={room.id}
                room={room}
                currency="USD"
                avgRating={4.9}
                reviewCount={24}
                priority={i === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats / Social proof */}
      <section className="py-16 bg-gradient-tropical text-white">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {TRUST_STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-serif text-4xl font-medium text-sand-light mb-1">
                  {value}
                </p>
                <p className="font-sans text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Google Reviews */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="text-center mb-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
              Guest Stories
            </p>
            <h2 className="font-serif text-heading-1 text-ocean-dark mb-2">
              What Our Guests Say
            </h2>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} className="fill-sand text-sand" />
              ))}
              <span className="font-sans text-sm font-medium text-warmgray ml-1">
                4.9 out of 5 on Google
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GOOGLE_REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-coconut rounded-3xl p-6 hover:shadow-luxury transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-sand text-sand" />
                  ))}
                </div>
                <p className="font-sans text-sm text-warmgray leading-relaxed mb-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-ocean flex items-center justify-center text-white text-xs font-bold font-sans">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-ocean-dark">
                      {review.name}
                    </p>
                    <p className="font-sans text-xs text-warmgray">
                      {review.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sri Lanka UX specifics */}
      <section className="section-padding bg-coconut">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
                Local Expertise
              </p>
              <h2 className="font-serif text-heading-1 text-ocean-dark mb-6">
                Everything You Need in Sri Lanka
              </h2>
              <div className="space-y-4">
                {[
                  { icon: "🏧", text: "ATM nearby — within 200m walk" },
                  { icon: "🚕", text: "Tuk-tuk & taxi on call — 24/7 availability" },
                  { icon: "🌊", text: "Beach access — 15 min drive to coast" },
                  { icon: "⛰️", text: "Hill country views from select rooms" },
                  { icon: "🌿", text: "Eco-friendly & sustainable operations" },
                  { icon: "💊", text: "Ayurveda center — on-site wellness" },
                  { icon: "🏥", text: "Nearest hospital — 5 km away" },
                  { icon: "✈️", text: "Airport pickup — all terminals covered" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-base shadow-luxury shrink-0">
                      {icon}
                    </div>
                    <p className="font-sans text-sm text-warmgray">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1602152294186-5b1a00be3499?w=800&q=80"
                  alt="Sri Lanka tropical experience at Loga Guest House"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/40 to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-luxury-md max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-sand" />
                  <span className="font-sans text-xs font-semibold text-ocean-dark">
                    Perfect Location
                  </span>
                </div>
                <p className="font-sans text-xs text-warmgray">
                  Close to Sigiriya, Ella & Galle Fort
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Blog teaser */}
      {latestPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-luxury">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
                  Travel Journal
                </p>
                <h2 className="font-serif text-heading-1 text-ocean-dark">
                  Stories from Sri Lanka
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-ocean hover:gap-3 transition-all duration-200"
              >
                All Stories <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CTA Banner */}
      <section className="section-padding bg-gradient-tropical text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {/* Decorative pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3c.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
        </div>

        <div className="container-luxury relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display-3 text-white mb-4">
              Ready for Your Sri Lanka Adventure?
            </h2>
            <p className="font-sans text-lg text-white/75 mb-8 leading-relaxed">
              Book your room today and receive a complimentary welcome drink,
              early check-in (subject to availability), and our local
              experiences guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" size="xl" className="rounded-xl">
                <Link href="/rooms">Browse Rooms</Link>
              </Button>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94000000000"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-sans font-medium px-8 py-4 rounded-xl text-base transition-colors duration-200"
              >
                <Phone size={18} />
                WhatsApp Us
              </a>
            </div>

            {/* Micro trust signals */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/60">
              {[
                "✓ Free cancellation up to 48h",
                "✓ Best price guarantee",
                "✓ Instant confirmation",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
