import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, Star, X } from 'lucide-react';
import type { MenuItem } from '../types';
import { FoodImage } from './FoodImage';
import { VegBadge } from './VegBadge';

interface FoodModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function FoodModal({ item, onClose, onAddToCart }: FoodModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-ivory-50 border border-cream-200 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-square w-full bg-cream-100 relative">
          <FoodImage src={item.image} alt={item.name} />
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <VegBadge isVeg={item.isVeg} showLabel />
                <span className="text-brown-500 text-xs" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs font-medium text-brown-700">{item.category}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close food details"
                className="p-2 -mr-2 -mt-2 text-brown-700 hover:text-maroon-800 hover:bg-cream-100 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2
              id="food-modal-title"
              className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-brown-900 leading-tight"
            >
              {item.name}
            </h2>

            <div className="mt-2.5 flex items-center gap-4">
              <span className="font-mono text-2xl font-bold text-maroon-800 tabular-nums">
                ₹{item.price}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brown-900 tabular-nums">
                <Star className="w-4 h-4 fill-gold-500 text-gold-500" aria-hidden="true" />
                {item.rating.toFixed(1)} rating
              </span>
            </div>

            <p className="mt-4 text-sm sm:text-base text-brown-700 leading-relaxed">
              {item.fullDescription}
            </p>
          </div>

          <div className="pt-5 border-t border-cream-200 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-brown-900">Quantity</span>
              <div className="inline-flex items-center border border-cream-200 bg-white rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-brown-900 hover:bg-cream-100 rounded-l-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className="w-10 text-center font-mono text-sm font-semibold text-brown-900 tabular-nums"
                  data-testid="modal-quantity"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="p-2.5 text-brown-900 hover:bg-cream-100 rounded-r-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>
                Add to Cart · ₹{item.price * quantity}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
