import { Search, X } from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import type { MenuCategory, MenuItem } from '../types';
import { FoodCard } from '../components/FoodCard';

interface MenuPageProps {
  selectedCategory: MenuCategory;
  searchQuery: string;
  onCategoryChange: (category: MenuCategory) => void;
  onSearchChange: (query: string) => void;
  onSelectFood: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function MenuPage({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onSelectFood,
  onAddToCart,
}: MenuPageProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Vegetarian'
          ? item.isVeg
          : selectedCategory === 'Non-Vegetarian'
            ? !item.isVeg
            : item.category === selectedCategory;

    const matchesSearch =
      !normalizedQuery ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.shortDescription.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 lg:py-16 bg-ivory-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
              Bharath Delights Menu
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
              Authentic Tamil Nadu Kitchen
            </h1>
            <p className="mt-2 text-sm sm:text-base text-brown-700 max-w-2xl">
              Explore 39 freshly crafted dishes across breakfast, traditional meals, biryanis,
              varieties of rice, snacks, sweets, and beverages.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80">
            <label htmlFor="menu-search" className="sr-only">
              Search dishes by name
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-brown-500 absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="menu-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search food by name..."
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-cream-200 rounded-lg text-brown-900 placeholder:text-brown-500 focus:outline-none focus:ring-2 focus:ring-maroon-800 min-h-[44px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-brown-500 hover:text-maroon-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-cream-200">
          {MENU_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-maroon-800 text-white'
                    : 'bg-white border border-cream-200 text-brown-700 hover:border-maroon-800/40 hover:text-maroon-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-brown-500">
          <span className="tabular-nums">
            Showing {filteredItems.length} of {MENU_ITEMS.length} dishes
          </span>
          {(selectedCategory !== 'All' || normalizedQuery) && (
            <button
              type="button"
              onClick={() => {
                onCategoryChange('All');
                onSearchChange('');
              }}
              className="font-semibold text-maroon-800 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onSelect={onSelectFood}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-cream-200 rounded-2xl p-12 text-center space-y-4">
            <h2 className="font-serif text-2xl font-bold text-brown-900">No matching dishes found</h2>
            <p className="text-sm text-brown-700 max-w-md mx-auto">
              Try clearing your search term or selecting &ldquo;All&rdquo; to browse all 39 Tamil
              Nadu dishes and beverages.
            </p>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('All');
                onSearchChange('');
              }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors"
            >
              Show All Dishes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
