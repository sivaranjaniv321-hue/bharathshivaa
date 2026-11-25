import { Plus, Star } from 'lucide-react';
import type { MenuItem } from '../types';
import { FoodImage } from './FoodImage';
import { VegBadge } from './VegBadge';

interface FoodCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function FoodCard({ item, onSelect, onAddToCart }: FoodCardProps) {
  return (
    <article className="group bg-white border border-cream-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="relative aspect-square w-full overflow-hidden bg-cream-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800"
        aria-label={`View details for ${item.name}`}
      >
        <FoodImage
          src={item.image}
          alt={item.name}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-brown-500 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <VegBadge isVeg={item.isVeg} />
              <span className="truncate">{item.category}</span>
            </div>
            <span className="inline-flex items-center gap-1 font-medium text-brown-900 tabular-nums shrink-0">
              <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" aria-hidden="true" />
              {item.rating.toFixed(1)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect(item)}
            className="text-left w-full focus-visible:outline-none focus-visible:underline"
          >
            <h3 className="font-serif text-lg font-semibold text-brown-900 group-hover:text-maroon-800 transition-colors leading-snug">
              {item.name}
            </h3>
          </button>

          <p className="mt-1.5 text-sm text-brown-700 leading-relaxed line-clamp-2">
            {item.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-cream-200/80 flex items-center justify-between gap-3">
          <span className="font-mono text-base font-semibold text-brown-900 tabular-nums">
            ₹{item.price}
          </span>

          <button
            type="button"
            onClick={() => onAddToCart(item, 1)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800 focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
