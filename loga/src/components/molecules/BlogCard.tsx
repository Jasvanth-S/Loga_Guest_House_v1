import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types";
import { Badge } from "@/components/atoms/Badge";
import { formatDate, truncate } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: BlogPost;
    className?: string;
    variant?: "default" | "horizontal";
}

export function BlogCard({ post, className, variant = "default" }: BlogCardProps) {
    const readTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000));

    if (variant === "horizontal") {
        return (
            <Link
                href={`/blog/${post.slug}`}
                className={cn(
                    "group flex gap-4 bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-md transition-all duration-300",
                    className
                )}
            >
                <div className="relative w-32 sm:w-48 shrink-0 overflow-hidden">
                    <Image
                        src={post.cover_image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div className="flex flex-col justify-center py-4 pr-4">
                    <Badge variant="sand" size="sm" className="w-fit mb-2">{post.category}</Badge>
                    <h3 className="font-serif text-lg text-ocean-dark group-hover:text-ocean transition-colors duration-200 line-clamp-2 mb-1">
                        {post.title}
                    </h3>
                    {post.excerpt && (
                        <p className="font-sans text-sm text-warmgray line-clamp-2 mb-2">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-warmgray">
                        <span>{formatDate(post.created_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                            <Clock size={12} /> {readTime} min read
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/blog/${post.slug}`}
            className={cn(
                "group block bg-white rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-md hover:-translate-y-1 transition-all duration-300",
                className
            )}
        >
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={post.cover_image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3">
                    <Badge variant="glass" size="sm">{post.category}</Badge>
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-warmgray mb-3">
                    <span>{formatDate(post.created_at)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                        <Clock size={11} /> {readTime} min read
                    </span>
                </div>

                <h3 className="font-serif text-xl text-ocean-dark group-hover:text-ocean transition-colors duration-200 mb-2">
                    {post.title}
                </h3>

                {post.excerpt && (
                    <p className="font-sans text-sm text-warmgray line-clamp-3 leading-relaxed mb-4">
                        {truncate(post.excerpt, 120)}
                    </p>
                )}

                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean group-hover:gap-2.5 transition-all duration-200">
                    Read story <ArrowRight size={14} />
                </span>
            </div>
        </Link>
    );
}
