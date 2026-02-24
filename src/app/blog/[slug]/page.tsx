import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowLeft, Calendar } from "lucide-react";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase
        .from("blog_posts")
        .select("seo_title, meta_description, cover_image, title")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!post) return { title: "Post Not Found" };

    return {
        title: post.seo_title || post.title,
        description: post.meta_description || "",
        openGraph: {
            title: post.seo_title || post.title,
            description: post.meta_description || "",
            images: post.cover_image ? [{ url: post.cover_image }] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("blog_posts")
        .select("*, author:users(id, name, avatar_url)")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (!post) notFound();

    const typedPost = post as BlogPost;
    const readTime = Math.max(1, Math.ceil((typedPost.content?.length || 500) / 1000));

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: typedPost.title,
        description: typedPost.meta_description || typedPost.excerpt,
        image: typedPost.cover_image,
        author: { "@type": "Person", name: typedPost.author?.name || "Loga Team" },
        publisher: {
            "@type": "Organization",
            name: "Loga Guest House",
            logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` },
        },
        datePublished: typedPost.created_at,
        dateModified: typedPost.updated_at,
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <main className="pt-20">
                {/* Hero */}
                <div className="relative h-[50vh] md:h-[60vh] bg-ocean-dark">
                    {typedPost.cover_image && (
                        <Image src={typedPost.cover_image} alt={typedPost.title} fill priority quality={90}
                            className="object-cover opacity-70" />
                    )}
                    <div className="absolute inset-0 bg-gradient-hero" />
                    <div className="absolute bottom-0 left-0 right-0 container-luxury pb-10">
                        <Link href="/blog"
                            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-sans mb-4 transition-colors">
                            <ArrowLeft size={14} /> Back to Blog
                        </Link>
                        <Badge variant="glass" size="sm" className="mb-3">{typedPost.category}</Badge>
                        <h1 className="font-serif text-display-3 md:text-heading-1 text-white max-w-3xl">
                            {typedPost.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-white/60 text-sm font-sans">
                            <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(typedPost.created_at)}</span>
                            <span className="flex items-center gap-1.5"><Clock size={13} />{readTime} min read</span>
                            {typedPost.author && <span>By {typedPost.author.name}</span>}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container-luxury max-w-3xl py-12">
                    {typedPost.excerpt && (
                        <p className="font-serif text-xl text-ocean-dark/80 italic leading-relaxed mb-8 border-l-4 border-sand pl-5">
                            {typedPost.excerpt}
                        </p>
                    )}

                    <div className="prose-luxury space-y-4">
                        {typedPost.content ? (
                            <div dangerouslySetInnerHTML={{ __html: typedPost.content.replace(/\n/g, "<br>") }} />
                        ) : (
                            <p className="font-sans text-warmgray leading-relaxed">
                                This article is being prepared. Please check back soon for our full story.
                            </p>
                        )}
                    </div>

                    {/* Internal CTA */}
                    <div className="mt-12 bg-gradient-tropical rounded-3xl p-8 text-center text-white">
                        <h3 className="font-serif text-heading-3 mb-2">Ready to Visit Sri Lanka?</h3>
                        <p className="font-sans text-sm text-white/75 mb-5">
                            Book your stay at Loga Guest House and experience the island firsthand.
                        </p>
                        <Button variant="secondary" size="lg">
                            <Link href="/rooms">Browse Our Rooms</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}
