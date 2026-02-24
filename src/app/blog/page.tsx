import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/molecules/BlogCard";
import type { BlogPost, BlogCategory } from "@/types";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Travel Blog",
    description:
        "Discover Sri Lanka through our travel guides, local tips, wellness stories, and cultural insights from Loga Guest House.",
};

const CATEGORIES: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "Travel Guide", label: "Travel Guide" },
    { value: "Sri Lanka Tips", label: "Sri Lanka Tips" },
    { value: "Local Experiences", label: "Experiences" },
    { value: "Wellness", label: "Wellness" },
    { value: "Food & Culture", label: "Food & Culture" },
];

interface Props {
    searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
    const params = await searchParams;
    const supabase = await createClient();

    let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (params.category) {
        query = query.eq("category", params.category as BlogCategory);
    }

    const { data: posts } = await query;
    const typedPosts = (posts || []) as BlogPost[];

    // Demo posts while DB is empty
    const displayPosts =
        typedPosts.length > 0
            ? typedPosts
            : [
                {
                    id: "1", title: "The Ultimate Guide to Visiting Sigiriya", slug: "sigiriya-guide",
                    content: "", excerpt: "Everything you need to know about Sri Lanka's iconic Lion Rock fortress — the best time to climb, what to bring, and hidden viewpoints most tourists miss.",
                    cover_image: "https://images.unsplash.com/photo-1580181236-5e26c2f89cdd?w=800&q=80",
                    category: "Travel Guide", is_published: true, created_at: "2026-01-15T00:00:00Z", updated_at: "2026-01-15T00:00:00Z",
                },
                {
                    id: "2", title: "Ella: The Hill Country Gem You Can't Miss", slug: "ella-travel-guide",
                    content: "", excerpt: "From the famous Nine Arch Bridge to tea plantation hikes, Ella is Sri Lanka's most photogenic village. Here's your complete guide.",
                    cover_image: "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800&q=80",
                    category: "Sri Lanka Tips", is_published: true, created_at: "2026-01-08T00:00:00Z", updated_at: "2026-01-08T00:00:00Z",
                },
                {
                    id: "3", title: "Traditional Ayurveda Wellness in Sri Lanka", slug: "ayurveda-sri-lanka",
                    content: "", excerpt: "Ancient Sri Lankan healing traditions, from oil massages to herbal steam baths. A guide to authentic Ayurveda experiences near Loga.",
                    cover_image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
                    category: "Wellness", is_published: true, created_at: "2025-12-20T00:00:00Z", updated_at: "2025-12-20T00:00:00Z",
                },
                {
                    id: "4", title: "Sri Lankan Breakfast: A Complete Guide", slug: "sri-lankan-breakfast",
                    content: "", excerpt: "Hoppers, string hoppers, pol sambol, and kade egg — everything you'll find on a authentic Sri Lankan breakfast table.",
                    cover_image: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=800&q=80",
                    category: "Food & Culture", is_published: true, created_at: "2025-12-05T00:00:00Z", updated_at: "2025-12-05T00:00:00Z",
                },
                {
                    id: "5", title: "Galle Fort: History, Art & Sunset", slug: "galle-fort-guide",
                    content: "", excerpt: "Explore the Dutch Colonial fortified city of Galle — its boutique shops, cafés, art galleries, and the most beautiful sunset in Sri Lanka.",
                    cover_image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
                    category: "Local Experiences", is_published: true, created_at: "2025-11-28T00:00:00Z", updated_at: "2025-11-28T00:00:00Z",
                },
                {
                    id: "6", title: "Digital Nomad Guide to Sri Lanka 2026", slug: "digital-nomad-sri-lanka-2026",
                    content: "", excerpt: "Fast WiFi, low cost of living, year-round sunshine — Sri Lanka is the digital nomad's best-kept secret. Here's everything you need to know.",
                    cover_image: "https://images.unsplash.com/photo-1498758536662-35b82cd15e29?w=800&q=80",
                    category: "Sri Lanka Tips", is_published: true, created_at: "2025-11-10T00:00:00Z", updated_at: "2025-11-10T00:00:00Z",
                },
            ] as unknown as BlogPost[];

    return (
        <main className="pt-24 pb-section">
            {/* Header */}
            <div className="bg-gradient-tropical pt-10 pb-16">
                <div className="container-luxury">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-sand mb-2">
                        Travel Journal
                    </p>
                    <h1 className="font-serif text-display-3 text-white">
                        Stories from Sri Lanka
                    </h1>
                    <p className="font-sans text-base text-white/70 mt-2 max-w-xl">
                        Travel guides, local tips, wellness insights, and cultural discoveries from our island paradise.
                    </p>
                </div>
            </div>

            <div className="container-luxury -mt-4">
                {/* Category filter */}
                <div className="glass-card rounded-2xl p-3 mb-10 flex flex-wrap gap-2">
                    {CATEGORIES.map(({ value, label }) => {
                        const isActive = (params.category || "") === value;
                        const href = value ? `/blog?category=${encodeURIComponent(value)}` : "/blog";
                        return (
                            <Link key={label} href={href}
                                className={`font-sans text-sm px-4 py-1.5 rounded-full border transition-all duration-200
                  ${isActive ? "bg-ocean text-white border-ocean" : "bg-white text-ocean-dark border-coconut-darker hover:border-ocean/40"}`}>
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Featured post */}
                {displayPosts.length > 0 && (
                    <div className="mb-8">
                        <BlogCard post={displayPosts[0]} className="md:col-span-2" />
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayPosts.slice(1).map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {displayPosts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="font-serif text-2xl text-ocean-dark mb-2">No posts yet</p>
                        <p className="font-sans text-warmgray">We're working on amazing content — check back soon!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
