import Image from "next/image";
import type { Review } from "@/types";
import { StarRating } from "@/components/atoms/StarRating";
import { getInitials, timeAgo } from "@/lib/utils";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    const name = review.user?.name || "Guest";
    const initials = getInitials(name);

    return (
        <div className="bg-white rounded-2xl p-5 shadow-luxury hover:shadow-luxury-md transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {review.user?.avatar_url ? (
                        <Image
                            src={review.user.avatar_url}
                            alt={name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-ocean flex items-center justify-center text-white text-sm font-sans font-semibold">
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className="font-sans font-medium text-ocean-dark text-sm">{name}</p>
                        <p className="font-sans text-xs text-warmgray">{timeAgo(review.created_at)}</p>
                    </div>
                </div>

                <StarRating rating={review.rating} size="sm" showValue={false} />
            </div>

            {/* Comment */}
            <p className="font-sans text-sm text-warmgray leading-relaxed line-clamp-4">
                &ldquo;{review.comment}&rdquo;
            </p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-hidden">
                    {review.images.slice(0, 3).map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <Image
                                src={img}
                                alt={`Review photo ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
