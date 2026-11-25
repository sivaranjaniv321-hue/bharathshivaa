export type PageId =
  | 'home'
  | 'menu'
  | 'about'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'my-orders'
  | 'reviews'
  | 'contact';

export type MenuCategory =
  | 'All'
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Breakfast'
  | 'Meals'
  | 'Rice'
  | 'Biryani'
  | 'Snacks'
  | 'Sweets'
  | 'Beverages';

export type DishCategory =
  | 'Breakfast'
  | 'Meals'
  | 'Rice'
  | 'Biryani'
  | 'Snacks'
  | 'Sweets'
  | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: DishCategory;
  isVeg: boolean;
  rating: number;
  image: string;
  isPopular?: boolean;
  isTodaysSpecial?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  houseNumber: string;
  streetName: string;
  area: string;
  city: string;
  district: string;
  pinCode: string;
  deliveryInstructions: string;
}

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'GPay'
  | 'PhonePe'
  | 'Paytm'
  | 'UPI';

export interface WhatsAppDeliveryResult {
  sent: boolean;
  mode: 'cloud_api' | 'manual_click_to_chat' | 'validation_error';
  recipient: string;
  messageId?: string;
  waMeUrl: string;
  messageText: string;
  reason?: string;
}

export interface OrderRecord {
  orderNumber: string;
  orderDate: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  isDemoPayment: boolean;
  orderStatus: string;
  estimatedDeliveryTime: string;
  whatsappResult: WhatsAppDeliveryResult;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  isSample: boolean;
}
