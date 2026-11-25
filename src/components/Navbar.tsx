import { useState, type FormEvent } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import type { PageId } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentPage: PageId;
  cartCount: number;
  searchQuery: string;
  onNavigate: (page: PageId) => void;
  onSearchSubmit: (query: string) => void;
}

const NAV_LINKS: Array<{ id: PageId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'menu', label: 'Menu' },
  { id: 'about', label: 'About Us' },
  { id: 'my-orders', label: 'My Orders' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({
  currentPage,
  cartCount,
  searchQuery,
  onNavigate,
  onSearchSubmit,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localSearch);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur-sm border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800 rounded-md py-1"
          aria-label="Bharath Delights Home"
        >
          <Logo variant="dark" />
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-brown-700"
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-maroon-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800 rounded ${
                  isActive ? 'text-maroon-800 font-semibold' : ''
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-maroon-800 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search Trigger + Cart Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-1.5">
              <label htmlFor="navbar-search-input" className="sr-only">
                Search dishes
              </label>
              <input
                id="navbar-search-input"
                type="search"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (currentPage === 'menu') {
                    onSearchSubmit(e.target.value);
                  }
                }}
                placeholder="Search idli, biryani..."
                autoFocus
                className="w-44 md:w-56 px-3 py-1.5 text-sm bg-white border border-cream-200 rounded-lg text-brown-900 placeholder:text-brown-500 focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-maroon-800 text-white rounded-lg hover:bg-maroon-900 transition-colors"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-1.5 text-brown-700 hover:text-maroon-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setLocalSearch(searchQuery);
                setSearchOpen(true);
              }}
              aria-label="Search menu"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brown-700 hover:text-maroon-800 hover:bg-cream-100 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleNavClick('cart')}
            aria-label={`View cart with ${cartCount} items`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-800 focus-visible:ring-offset-2"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Cart</span>
            <span
              className="font-mono text-xs font-semibold bg-gold-500 text-brown-900 px-1.5 py-0.5 rounded tabular-nums min-w-[20px] text-center"
              data-testid="cart-count"
            >
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center p-2 text-brown-900 hover:bg-cream-100 rounded-lg min-w-[44px] min-h-[44px]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-ivory-50 px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <label htmlFor="mobile-search-input" className="sr-only">
              Search dishes
            </label>
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-brown-500 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="mobile-search-input"
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-cream-200 rounded-lg text-brown-900 placeholder:text-brown-500 focus:outline-none focus:ring-2 focus:ring-maroon-800"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-semibold bg-maroon-800 text-white rounded-lg min-h-[44px]"
            >
              Search
            </button>
          </form>

          <nav aria-label="Mobile Navigation" className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                    isActive
                      ? 'bg-maroon-800 text-white'
                      : 'bg-cream-100 text-brown-900 hover:bg-cream-200'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
