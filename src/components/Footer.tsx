import type { PageId } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-maroon-900 text-ivory-50 border-t border-maroon-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
            >
              <Logo variant="light" showTagline />
            </button>
            <p className="text-sm text-cream-200 leading-relaxed max-w-xs">
              Traditional Tamil Nadu dining crafted from stone-ground spices, cold-pressed oils, and
              time-honored family recipes.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-gold-500 mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm text-cream-200">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('menu')}
                  className="hover:text-white transition-colors"
                >
                  Full Menu
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-base font-semibold text-gold-500 mb-4">Ordering</h3>
            <ul className="space-y-2.5 text-sm text-cream-200">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="hover:text-white transition-colors"
                >
                  Your Cart
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('my-orders')}
                  className="hover:text-white transition-colors"
                >
                  My Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact &amp; Hours
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 text-sm text-cream-200">
            <h3 className="font-serif text-base font-semibold text-gold-500 mb-4">
              Visit &amp; Hours
            </h3>
            <p>[Restaurant Street Address Placeholder, Tamil Nadu]</p>
            <p>Phone: [Restaurant Phone Placeholder]</p>
            <p>WhatsApp: [Restaurant WhatsApp Placeholder]</p>
            <p className="pt-1 text-ivory-50 font-medium">Open Daily: 7:00 AM – 10:30 PM</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-200">
          <p>© {new Date().getFullYear()} Bharath Delights. All rights reserved.</p>
          <p>Authentic Tamil Nadu Vegetarian &amp; Non-Vegetarian Kitchen</p>
        </div>
      </div>
    </footer>
  );
}
