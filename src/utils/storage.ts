import type { CartItem, OrderRecord, ReviewItem } from '../types';
import { INITIAL_SAMPLE_REVIEWS } from '../data/reviewsData';

const CART_KEY = 'bharath_delights_cart_v1';
const ORDERS_KEY = 'bharath_delights_orders_v1';
const LAST_ORDER_KEY = 'bharath_delights_last_order_v1';
const REVIEWS_KEY = 'bharath_delights_reviews_v1';

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord): OrderRecord[] {
  const existing = loadOrders();
  const updated = [order, ...existing];
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function loadLastOrder(): OrderRecord | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OrderRecord;
  } catch {
    return null;
  }
}

export function loadReviews(): ReviewItem[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return INITIAL_SAMPLE_REVIEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_REVIEWS;
  } catch {
    return INITIAL_SAMPLE_REVIEWS;
  }
}

export function saveReviews(reviews: ReviewItem[]): void {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch {
    // Ignore storage quota errors
  }
}
