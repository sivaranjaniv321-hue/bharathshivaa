import { ArrowRight, Award, Flame, Leaf, ShieldCheck } from 'lucide-react';
import { HERO_IMAGE } from '../data/menuData';
import type { PageId } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="bg-ivory-50">
      <section className="py-12 lg:py-20 border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
              About Bharath Delights
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brown-900 leading-tight text-balance">
              Rooted in Tamil Nadu Hospitality &amp; Honest Cooking
            </h1>
            <p className="text-base text-brown-700 leading-relaxed">
              Bharath Delights brings together the comfort of home-style Tamil Nadu tiffin and the
              richness of festive Chettinad and Madurai cuisine. Whether it is steamed morning idlis,
              a full banana leaf meal at noon, or aromatic biryani in the evening, every plate is
              prepared to honor authentic regional flavors.
            </p>
            <p className="text-base text-brown-700 leading-relaxed">
              We roast and grind whole spices in small batches, ferment dosa and idli batters
              naturally overnight, and brew fresh filter coffee decoction throughout the day.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[300px] rounded-2xl overflow-hidden border border-cream-200 bg-cream-100">
              <img
                src={HERO_IMAGE}
                alt="Traditional Tamil Nadu spread at Bharath Delights"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
              Our Philosophy
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-brown-900">
              Why Guests Choose Bharath Delights
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-ivory-50 border border-cream-200 rounded-xl p-6 space-y-3">
              <Leaf className="w-6 h-6 text-maroon-800" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-brown-900">Fresh Ingredients</h3>
              <p className="text-sm text-brown-700 leading-relaxed">
                Daily sourced farm vegetables, freshly grated coconut, cold-pressed gingelly oil,
                and pure cow ghee with zero artificial colors.
              </p>
            </div>

            <div className="bg-ivory-50 border border-cream-200 rounded-xl p-6 space-y-3">
              <Flame className="w-6 h-6 text-maroon-800" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-brown-900">
                Hand-Roasted Spices
              </h3>
              <p className="text-sm text-brown-700 leading-relaxed">
                Our Chettinad, sambar, and biryani masalas are toasted slowly and ground in-house
                to preserve natural aroma and warmth.
              </p>
            </div>

            <div className="bg-ivory-50 border border-cream-200 rounded-xl p-6 space-y-3">
              <ShieldCheck className="w-6 h-6 text-maroon-800" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-brown-900">
                Separate Veg &amp; Non-Veg Prep
              </h3>
              <p className="text-sm text-brown-700 leading-relaxed">
                Dedicated cookware and prep stations ensure complete respect for traditional
                vegetarian dining alongside meat and seafood dishes.
              </p>
            </div>

            <div className="bg-ivory-50 border border-cream-200 rounded-xl p-6 space-y-3">
              <Award className="w-6 h-6 text-maroon-800" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-brown-900">
                Careful Packaging
              </h3>
              <p className="text-sm text-brown-700 leading-relaxed">
                Every takeaway and delivery order is packed cleanly so dosas stay crisp and curries
                arrive piping hot at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
