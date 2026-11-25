import { useState } from 'react';
import { ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react';
import { HERO_IMAGE, MENU_ITEMS } from '../data/menuData';
import type { MenuCategory, MenuItem, PageId, ReviewItem } from '../types';
import { FoodCard } from '../components/FoodCard';
import { VegBadge } from '../components/VegBadge';

interface HomePageProps {
  reviews: ReviewItem[];
  onNavigate: (page: PageId) => void;
  onNavigateMenuWithFilter: (category: MenuCategory) => void;
  onSelectFood: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function HomePage({
  reviews,
  onNavigate,
  onNavigateMenuWithFilter,
  onSelectFood,
  onAddToCart,
}: HomePageProps) {
  const [showcaseTab, setShowcaseTab] = useState<'popular' | 'specials'>('popular');

  const popularDishes = MENU_ITEMS.filter((item) => item.isPopular).slice(0, 6);
  const specialDishes = MENU_ITEMS.filter((item) => item.isTodaysSpecial).slice(0, 6);
  const displayedDishes = showcaseTab === 'popular' ? popularDishes : specialDishes;

  const vegHighlights = MENU_ITEMS.filter((item) => item.isVeg).slice(0, 3);
  const nonVegHighlights = MENU_ITEMS.filter((item) => !item.isVeg).slice(0, 3);
  const featuredReviews = reviews.slice(0, 3);

  return (
    <div>
      {/* Section 1: Welcome Hero */}
      <section className="bg-ivory-50 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
                Bharath Delights · Tamil Nadu Kitchen
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brown-900 leading-[1.12] text-balance">
                Taste the Tradition of Tamil Nadu
              </h1>
              <p className="text-base text-brown-700 leading-relaxed max-w-lg">
                From crisp ghee-roasted dosas and wholesome banana leaf meals to slow-cooked
                Chettinad curries and Madras filter coffee, every dish is prepared fresh with
                stone-ground spices and time-honored Tamil recipes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
                >
                  <span>View Menu</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <a
                  href="#specials-section"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-maroon-800 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors min-h-[44px]"
                >
                  Today&apos;s Specials
                </a>
              </div>

              <div className="pt-4 border-t border-cream-200 grid grid-cols-3 gap-4 text-left">
                <div>
                  <p className="font-mono text-lg font-bold text-maroon-800 tabular-nums">39</p>
                  <p className="text-xs text-brown-500 mt-0.5">Curated Dishes</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-maroon-800 tabular-nums">100%</p>
                  <p className="text-xs text-brown-500 mt-0.5">Freshly Prepared</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-maroon-800 tabular-nums">7am–10:30pm</p>
                  <p className="text-xs text-brown-500 mt-0.5">Daily Service</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="h-full min-h-[300px] sm:min-h-[380px] rounded-2xl overflow-hidden border border-cream-200 bg-cream-100">
                <img
                  src={HERO_IMAGE}
                  alt="Traditional Tamil Nadu banana leaf feast at Bharath Delights"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Popular Food Items & Today's Specials */}
      <section id="specials-section" className="py-16 lg:py-20 bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
                Kitchen Highlights
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
                {showcaseTab === 'popular' ? 'Popular Food Items' : "Today's Special Dishes"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex p-1 bg-cream-100 rounded-lg border border-cream-200"
                role="tablist"
                aria-label="Highlight collections"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={showcaseTab === 'popular'}
                  onClick={() => setShowcaseTab('popular')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    showcaseTab === 'popular'
                      ? 'bg-maroon-800 text-white'
                      : 'text-brown-700 hover:text-brown-900'
                  }`}
                >
                  Popular Dishes
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={showcaseTab === 'specials'}
                  onClick={() => setShowcaseTab('specials')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    showcaseTab === 'specials'
                      ? 'bg-maroon-800 text-white'
                      : 'text-brown-700 hover:text-brown-900'
                  }`}
                >
                  Today&apos;s Specials
                </button>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-800 hover:text-maroon-900 px-3 py-2"
              >
                <span>See All 39 Dishes</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedDishes.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onSelect={onSelectFood}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Vegetarian & Non-Vegetarian Sections */}
      <section className="py-16 lg:py-20 bg-ivory-50 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
              Two Culinary Traditions
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
              Vegetarian &amp; Non-Vegetarian Favorites
            </h2>
            <p className="mt-3 text-base text-brown-700 leading-relaxed">
              Dedicated preparation stations ensure pure vegetarian tiffin and festive meals
              alongside authentic Chettinad and Madurai non-vegetarian specialties.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Vegetarian Column */}
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-cream-200">
                  <div className="flex items-center gap-2.5">
                    <VegBadge isVeg />
                    <h3 className="font-serif text-2xl font-bold text-brown-900">
                      Vegetarian Selection
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateMenuWithFilter('Vegetarian')}
                    className="text-sm font-semibold text-maroon-800 hover:underline whitespace-nowrap"
                  >
                    Browse Veg Menu
                  </button>
                </div>

                <div className="mt-5 divide-y divide-cream-200">
                  {vegHighlights.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectFood(item)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 shrink-0 border border-cream-200"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectFood(item)}
                          className="text-left font-serif text-base font-semibold text-brown-900 hover:text-maroon-800 block truncate w-full"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs text-brown-700 line-clamp-2 mt-0.5">
                          {item.shortDescription}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-semibold text-maroon-800 tabular-nums">
                            ₹{item.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(item, 1)}
                            className="px-3 py-1.5 text-xs font-semibold bg-cream-100 hover:bg-maroon-800 hover:text-white text-brown-900 rounded-md transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Non-Vegetarian Column */}
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-cream-200">
                  <div className="flex items-center gap-2.5">
                    <VegBadge isVeg={false} />
                    <h3 className="font-serif text-2xl font-bold text-brown-900">
                      Non-Vegetarian Selection
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateMenuWithFilter('Non-Vegetarian')}
                    className="text-sm font-semibold text-maroon-800 hover:underline whitespace-nowrap"
                  >
                    Browse Non-Veg
                  </button>
                </div>

                <div className="mt-5 divide-y divide-cream-200">
                  {nonVegHighlights.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectFood(item)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 shrink-0 border border-cream-200"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectFood(item)}
                          className="text-left font-serif text-base font-semibold text-brown-900 hover:text-maroon-800 block truncate w-full"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs text-brown-700 line-clamp-2 mt-0.5">
                          {item.shortDescription}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="font-mono text-sm font-semibold text-maroon-800 tabular-nums">
                            ₹{item.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(item, 1)}
                            className="px-3 py-1.5 text-xs font-semibold bg-cream-100 hover:bg-maroon-800 hover:text-white text-brown-900 rounded-md transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Customer Reviews & Contact Information */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Customer Reviews */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
                  Guest Feedback
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-brown-900">
                  Customer Reviews
                </h2>
                <p className="mt-1 text-xs text-brown-500">
                  Sample reviews shown for demonstration; submit your own review anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('reviews')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-800 hover:underline self-start sm:self-auto"
              >
                <span>Read &amp; Write Reviews</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredReviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-ivory-50 border border-cream-200 rounded-xl p-6 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-1 mb-3" aria-label={`${review.rating} out of 5 stars`}>
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
                    <p className="text-sm text-brown-700 leading-relaxed">
                      &ldquo;{review.reviewText}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-cream-200 text-xs text-brown-500 flex items-center justify-between gap-2">
                    <span className="font-semibold text-brown-900">{review.customerName}</span>
                    <span>{review.reviewDate}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Contact Information Strip */}
          <div className="bg-cream-100 border border-cream-200 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
                Visit or Reach Out
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900">
                Bharath Delights Contact Details
              </h2>
              <p className="text-sm text-brown-700 leading-relaxed">
                Freshly cooked Tamil Nadu dishes available for quick doorstep delivery and dine-in.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-brown-900">
                  <MapPin className="w-4 h-4 text-maroon-800 shrink-0" aria-hidden="true" />
                  <span>Location</span>
                </div>
                <p className="text-xs text-brown-700">
                  [Restaurant Street Address Placeholder, Tamil Nadu]
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-brown-900">
                  <Phone className="w-4 h-4 text-maroon-800 shrink-0" aria-hidden="true" />
                  <span>Phone &amp; WhatsApp</span>
                </div>
                <p className="text-xs text-brown-700">[Restaurant Phone Placeholder]</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-brown-900">
                  <Clock className="w-4 h-4 text-maroon-800 shrink-0" aria-hidden="true" />
                  <span>Hours</span>
                </div>
                <p className="text-xs text-brown-700">Daily: 7:00 AM – 10:30 PM</p>
              </div>
            </div>

            <div className="lg:col-span-2 flex lg:justify-end">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-5 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
