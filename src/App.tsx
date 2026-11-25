import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { CartItem, MenuCategory, MenuItem, OrderRecord, PageId, ReviewItem } from './types';
import { loadCart, loadOrders, loadReviews, saveCart, saveOrder, saveReviews } from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FoodModal } from './components/FoodModal';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';

const VALID_PAGES: PageId[] = [
  'home',
  'menu',
  'about',
  'cart',
  'checkout',
  'order-success',
  'my-orders',
  'reviews',
  'contact',
];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace(/^#/, '') as PageId;
  if (VALID_PAGES.includes(hash) && hash !== 'order-success') {
    return hash;
  }
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [orders, setOrders] = useState<OrderRecord[]>(loadOrders);
  const [reviews, setReviews] = useState<ReviewItem[]>(loadReviews);
  const [submittedOrder, setSubmittedOrder] = useState<OrderRecord | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '') as PageId;
      if (VALID_PAGES.includes(hash)) {
        if (hash === 'order-success' && !submittedOrder) {
          setCurrentPage('home');
          return;
        }
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [submittedOrder]);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateMenuWithFilter = (category: MenuCategory) => {
    setSelectedCategory(category);
    navigate('menu');
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 'menu') {
      navigate('menu');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { item, quantity }];
    });
    showToast(`Added ${quantity} × ${item.name} to cart`);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((entry) => (entry.item.id === itemId ? { ...entry, quantity } : entry))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const handleOrderPlaced = (order: OrderRecord) => {
    const updatedOrders = saveOrder(order);
    setOrders(updatedOrders);
    setSubmittedOrder(order);
    setCart([]);
    navigate('order-success');
  };

  const handleAddReview = (review: ReviewItem) => {
    setReviews((prev) => {
      const updated = [review, ...prev];
      saveReviews(updated);
      return updated;
    });
  };

  const totalCartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-brown-900">
      <Navbar
        currentPage={currentPage}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onNavigate={navigate}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            reviews={reviews}
            onNavigate={navigate}
            onNavigateMenuWithFilter={navigateMenuWithFilter}
            onSelectFood={setModalItem}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onSelectFood={setModalItem}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigate} />}

        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            onNavigate={navigate}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage order={submittedOrder} onNavigate={navigate} />
        )}

        {currentPage === 'my-orders' && (
          <MyOrdersPage orders={orders} onNavigate={navigate} />
        )}

        {currentPage === 'reviews' && (
          <ReviewsPage reviews={reviews} onAddReview={handleAddReview} />
        )}

        {currentPage === 'contact' && <ContactPage />}
      </main>

      <Footer onNavigate={navigate} />

      <FoodModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAddToCart={handleAddToCart}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-brown-900 text-ivory-50 text-sm font-medium rounded-xl shadow-lg border border-gold-500/40"
        >
          <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
