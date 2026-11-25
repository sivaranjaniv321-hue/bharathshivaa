import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import type { CartItem, PageId } from '../types';
import { FoodImage } from '../components/FoodImage';
import { VegBadge } from '../components/VegBadge';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (page: PageId) => void;
}

export const DELIVERY_FEE = 40;
export const FREE_DELIVERY_THRESHOLD = 500;

export function calculateCartTotals(cart: CartItem[]) {
  const subtotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const deliveryCharge =
    subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const grandTotal = subtotal + deliveryCharge;
  return { subtotal, deliveryCharge, grandTotal };
}

export function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
}: CartPageProps) {
  const { subtotal, deliveryCharge, grandTotal } = calculateCartTotals(cart);

  if (cart.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-ivory-50 min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center text-maroon-800">
            <ShoppingBag className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brown-900">Your Cart is Empty</h1>
          <p className="text-base text-brown-700 leading-relaxed">
            Explore our freshly prepared Tamil Nadu breakfast, banana leaf meals, biryanis, and
            filter coffee to start your order.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
          >
            <span>View Menu</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-ivory-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
            Your Order Bag
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white border border-cream-200 rounded-2xl divide-y divide-cream-200">
            {cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
                  <FoodImage src={item.image} alt={item.name} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <VegBadge isVeg={item.isVeg} />
                    <span className="text-xs text-brown-500">{item.category}</span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-brown-900">{item.name}</h2>
                  <p className="font-mono text-sm text-brown-700 tabular-nums">
                    ₹{item.price} each
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                  <div className="inline-flex items-center border border-cream-200 bg-ivory-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="p-2 text-brown-900 hover:bg-cream-100 rounded-l-lg min-w-[38px] min-h-[38px] flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-9 text-center font-mono text-sm font-semibold text-brown-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                      className="p-2 text-brown-900 hover:bg-cream-100 rounded-r-lg min-w-[38px] min-h-[38px] flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right min-w-[72px]">
                    <p className="font-mono text-base font-bold text-brown-900 tabular-nums">
                      ₹{item.price * quantity}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="p-2 text-brown-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-cream-200 rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-xl font-bold text-brown-900 pb-3 border-b border-cream-200">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-brown-700">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-brown-900 tabular-nums">
                  ₹{subtotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-brown-700">
                <span>Delivery Charge</span>
                <span className="font-mono font-semibold text-brown-900 tabular-nums">
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                </span>
              </div>
              {subtotal < FREE_DELIVERY_THRESHOLD && (
                <p className="text-xs text-brown-500">
                  Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} more for free delivery.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <span className="font-semibold text-brown-900">Grand Total</span>
              <span className="font-mono text-xl font-bold text-maroon-800 tabular-nums">
                ₹{grandTotal}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('checkout')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('menu')}
                className="w-full px-6 py-2.5 text-sm font-semibold text-maroon-800 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors min-h-[44px]"
              >
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
