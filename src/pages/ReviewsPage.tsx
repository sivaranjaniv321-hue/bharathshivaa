import { useState, type FormEvent } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import type { ReviewItem } from '../types';

interface ReviewsPageProps {
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
}

export function ReviewsPage({ reviews, onAddReview }: ReviewsPageProps) {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) {
      setError('Please enter both your name and review message.');
      return;
    }

    const newReview: ReviewItem = {
      id: `user-${Date.now()}`,
      customerName: customerName.trim(),
      rating,
      reviewText: reviewText.trim(),
      reviewDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      isSample: false,
    };

    onAddReview(newReview);
    setCustomerName('');
    setRating(5);
    setReviewText('');
    setError('');
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 4000);
  };

  return (
    <section className="py-12 lg:py-16 bg-ivory-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Review List */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
              Guest Testimonials
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
              Customer Reviews
            </h1>
            <p className="mt-2 text-sm text-brown-700">
              Sample reviews are clearly marked below. Submit your own dining feedback using the
              form.
            </p>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-cream-200 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < review.rating
                            ? 'fill-gold-500 text-gold-500'
                            : 'text-cream-200'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-brown-500">
                    {review.isSample ? 'Sample Review' : 'Submitted Review'} · {review.reviewDate}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
                  &ldquo;{review.reviewText}&rdquo;
                </p>

                <p className="text-sm font-semibold text-brown-900 pt-1">{review.customerName}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Right: Write a Review Form */}
        <aside className="lg:col-span-5 bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
            Write a Review
          </h2>

          {submittedNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Thank you! Your review has been added.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="reviewName" className="block text-sm font-semibold text-brown-900 mb-1.5">
                Your Name *
              </label>
              <input
                id="reviewName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-brown-900 mb-1.5">
                Rating *
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    aria-label={`Rate ${starValue} out of 5 stars`}
                    className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starValue <= rating
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-cream-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono text-sm font-semibold text-brown-700 tabular-nums">
                  {rating}/5
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="reviewText" className="block text-sm font-semibold text-brown-900 mb-1.5">
                Your Review *
              </label>
              <textarea
                id="reviewText"
                rows={4}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your dishes, taste, and ordering experience..."
                className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>

            {error && <p className="text-xs font-medium text-red-700">{error}</p>}

            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
            >
              Submit Review
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
