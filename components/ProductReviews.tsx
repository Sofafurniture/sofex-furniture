import Image from 'next/image';
import { Star } from 'lucide-react';

export interface ReviewView {
  id: string;
  author: string;
  title: string;
  body: string;
  rating: number;
  imageUrls?: string[];
}

interface ProductReviewsProps {
  reviews: ReviewView[];
  reviewCount: number;
  averageRating: number;
  ratingBreakdown: { stars: number; count: number; percent: number }[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-500 text-amber-500' : 'text-[#EBEAE6]'}`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ reviews, reviewCount, averageRating, ratingBreakdown }: ProductReviewsProps) {
  return (
    <section className="border-t border-[#EBEAE6] pt-16">
      <div className="grid lg:grid-cols-3 gap-12">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-[#64625D] mt-2">Based on {reviewCount.toLocaleString()} reviews</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight">{averageRating}</span>
            <div className="pb-1">
              <StarRating rating={Math.round(averageRating)} />
              <p className="text-xs text-[#8A8782] mt-1">out of 5</p>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-mono text-[#64625D]">{row.stars} ★</span>
                <div className="flex-1 h-2 bg-[#F4F3EF] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="w-10 text-right font-mono text-[#8A8782]">{row.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {reviews.map((review) => (
            <article key={review.id} className="bg-white border border-[#EBEAE6] rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1C1B1A] text-white flex items-center justify-center text-sm font-semibold">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{review.author}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              {review.title && <h3 className="text-sm font-medium mt-3">{review.title}</h3>}
              <p className="text-sm text-[#64625D] mt-3 leading-relaxed">{review.body}</p>
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {review.imageUrls.map((url) => (
                    <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#EBEAE6]">
                      <Image src={url} alt="Customer photo" fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
