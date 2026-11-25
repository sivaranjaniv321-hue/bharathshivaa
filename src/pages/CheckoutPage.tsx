import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Info, Loader2, ShieldAlert } from 'lucide-react';
import type {
  CartItem,
  CustomerDetails,
  OrderRecord,
  PageId,
  PaymentMethod,
  WhatsAppDeliveryResult,
} from '../types';
import { calculateCartTotals } from './CartPage';
import { FoodImage } from '../components/FoodImage';
import {
  buildClientOrderMessage,
  buildCustomerWhatsAppUrl,
  formatFullAddress,
  formatWhatsAppE164,
  validateWhatsAppNumber,
} from '../utils/whatsapp';

interface CheckoutPageProps {
  cart: CartItem[];
  onNavigate: (page: PageId) => void;
  onOrderPlaced: (order: OrderRecord) => void;
}

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethod;
  label: string;
  isDemo: boolean;
  description: string;
}> = [
  {
    id: 'Cash on Delivery',
    label: 'Cash on Delivery',
    isDemo: false,
    description: 'Pay in cash when your order arrives at your doorstep.',
  },
  {
    id: 'GPay',
    label: 'GPay (Demo)',
    isDemo: true,
    description: 'Demonstration option only. No live GPay gateway or money transfer.',
  },
  {
    id: 'PhonePe',
    label: 'PhonePe (Demo)',
    isDemo: true,
    description: 'Demonstration option only. No live PhonePe gateway or money transfer.',
  },
  {
    id: 'Paytm',
    label: 'Paytm (Demo)',
    isDemo: true,
    description: 'Demonstration option only. No live Paytm gateway or money transfer.',
  },
  {
    id: 'UPI',
    label: 'UPI (Demo)',
    isDemo: true,
    description: 'Demonstration option only. No UPI PIN or banking credentials collected.',
  },
];

const COUNTRY_CODES = [
  { code: '+91', label: '+91 (India)' },
  { code: '+1', label: '+1 (US/CA)' },
  { code: '+44', label: '+44 (UK)' },
  { code: '+65', label: '+65 (SG)' },
  { code: '+971', label: '+971 (UAE)' },
  { code: '+60', label: '+60 (MY)' },
];

export function CheckoutPage({ cart, onNavigate, onOrderPlaced }: CheckoutPageProps) {
  const { subtotal, deliveryCharge, grandTotal } = calculateCartTotals(cart);

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('+91');
  const [whatsappLocalNumber, setWhatsappLocalNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [demoAcknowledged, setDemoAcknowledged] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-ivory-50 min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold text-brown-900">No Items to Checkout</h1>
          <p className="text-base text-brown-700">
            Please add dishes from our menu before proceeding to checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg"
          >
            Browse Menu
          </button>
        </div>
      </section>
    );
  }

  const selectedPaymentOption = PAYMENT_OPTIONS.find((opt) => opt.id === paymentMethod);
  const isDemoPayment = Boolean(selectedPaymentOption?.isDemo);

  const copyMobileToWhatsApp = () => {
    const cleaned = mobileNumber.replace(/[^\d]/g, '').slice(-10);
    setWhatsappCountryCode('+91');
    setWhatsappLocalNumber(cleaned);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.whatsappNumber;
      return next;
    });
  };

  const validateForm = (): { valid: boolean; normalizedWhatsApp: string } => {
    const nextErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const mobileDigits = mobileNumber.replace(/[^\d]/g, '');
    if (mobileDigits.length !== 10 || !/^[6-9]/.test(mobileDigits)) {
      nextErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number.';
    }

    const combinedWhatsApp = formatWhatsAppE164(whatsappCountryCode, whatsappLocalNumber);
    const waCheck = validateWhatsAppNumber(combinedWhatsApp);
    if (!waCheck.valid) {
      nextErrors.whatsappNumber = waCheck.error || 'Enter a valid WhatsApp number with country code.';
    }

    if (!houseNumber.trim()) {
      nextErrors.houseNumber = 'House / Flat number is required.';
    }
    if (!streetName.trim()) {
      nextErrors.streetName = 'Street name is required.';
    }
    if (!area.trim()) {
      nextErrors.area = 'Area / Locality is required.';
    }
    if (!city.trim()) {
      nextErrors.city = 'City / Town is required.';
    }
    if (!district.trim()) {
      nextErrors.district = 'District is required.';
    }

    const pinDigits = pinCode.replace(/[^\d]/g, '');
    if (!/^\d{6}$/.test(pinDigits)) {
      nextErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    }

    if (isDemoPayment && !demoAcknowledged) {
      nextErrors.paymentDemo =
        'Please acknowledge that this online payment option is for demonstration only, or choose Cash on Delivery.';
    }

    setErrors(nextErrors);
    return {
      valid: Object.keys(nextErrors).length === 0,
      normalizedWhatsApp: waCheck.normalized,
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { valid, normalizedWhatsApp } = validateForm();
    if (!valid) return;

    setIsSubmitting(true);

    const orderNumber = `BD-${Date.now().toString().slice(-6)}`;
    const orderStatus = isDemoPayment
      ? 'Order Received (Demo Payment Selected — Unverified)'
      : 'Order Received';

    const customer: CustomerDetails = {
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.replace(/[^\d]/g, ''),
      whatsappNumber: normalizedWhatsApp,
      houseNumber: houseNumber.trim(),
      streetName: streetName.trim(),
      area: area.trim(),
      city: city.trim(),
      district: district.trim(),
      pinCode: pinCode.replace(/[^\d]/g, ''),
      deliveryInstructions: deliveryInstructions.trim(),
    };

    const fullAddress = formatFullAddress(customer);
    const fallbackMessageText = buildClientOrderMessage({
      orderNumber,
      customer,
      items: cart,
      subtotal,
      deliveryCharge,
      totalAmount: grandTotal,
      paymentMethod,
      orderStatus,
    });
    const fallbackWaUrl = buildCustomerWhatsAppUrl(normalizedWhatsApp, fallbackMessageText);

    let whatsappResult: WhatsAppDeliveryResult = {
      sent: false,
      mode: 'manual_click_to_chat',
      recipient: normalizedWhatsApp,
      waMeUrl: fallbackWaUrl,
      messageText: fallbackMessageText,
      reason: 'Could not reach server for automatic WhatsApp delivery.',
    };

    try {
      const response = await fetch('/api/orders/whatsapp-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customerName: customer.fullName,
          customerMobile: customer.mobileNumber,
          customerWhatsApp: customer.whatsappNumber,
          deliveryAddress: fullAddress,
          items: cart.map((entry) => ({
            name: entry.item.name,
            quantity: entry.quantity,
            price: entry.item.price,
          })),
          subtotal,
          deliveryCharge,
          totalAmount: grandTotal,
          paymentMethod,
          orderStatus,
        }),
      });

      const data = (await response.json().catch(() => null)) as WhatsAppDeliveryResult | null;
      if (data) {
        whatsappResult = {
          sent: Boolean(data.sent),
          mode: data.mode || 'manual_click_to_chat',
          recipient: data.recipient || normalizedWhatsApp,
          messageId: data.messageId,
          waMeUrl: data.waMeUrl || fallbackWaUrl,
          messageText: data.messageText || fallbackMessageText,
          reason: data.reason,
        };
      }
    } catch {
      // Keep honest fallback state
    }

    const orderRecord: OrderRecord = {
      orderNumber,
      orderDate: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      customer,
      items: cart,
      subtotal,
      deliveryCharge,
      totalAmount: grandTotal,
      paymentMethod,
      isDemoPayment,
      orderStatus,
      estimatedDeliveryTime: '35–45 minutes',
      whatsappResult,
    };

    setIsSubmitting(false);
    onOrderPlaced(orderRecord);
  };

  return (
    <section className="py-12 lg:py-16 bg-ivory-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate('cart')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-800 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Cart</span>
        </button>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
            Customer Details &amp; Payment
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Details + Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Customer Contact & WhatsApp */}
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
                1. Contact &amp; WhatsApp Confirmation Number
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label htmlFor="whatsappLocalNumber" className="block text-sm font-semibold text-brown-900">
                      WhatsApp Number *
                    </label>
                    <button
                      type="button"
                      onClick={copyMobileToWhatsApp}
                      className="text-xs font-semibold text-maroon-800 hover:underline"
                    >
                      Same as Mobile
                    </button>
                  </div>
                  <div className="flex items-stretch gap-2">
                    <select
                      aria-label="WhatsApp Country Code"
                      value={whatsappCountryCode}
                      onChange={(e) => setWhatsappCountryCode(e.target.value)}
                      className="px-2.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="whatsappLocalNumber"
                      type="tel"
                      inputMode="numeric"
                      required
                      value={whatsappLocalNumber}
                      onChange={(e) => setWhatsappLocalNumber(e.target.value)}
                      placeholder="10-digit WhatsApp number"
                      className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                    />
                  </div>
                  <p className="mt-1 text-xs text-brown-500">
                    Your order confirmation will target your WhatsApp number ({whatsappCountryCode}
                    {whatsappLocalNumber.replace(/[^\d]/g, '') || 'XXXXXXXXXX'}).
                  </p>
                  {errors.whatsappNumber && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.whatsappNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
                2. Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="houseNumber" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    House Number / Flat *
                  </label>
                  <input
                    id="houseNumber"
                    type="text"
                    required
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    placeholder="e.g., 14B"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.houseNumber && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.houseNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="streetName" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    Street Name *
                  </label>
                  <input
                    id="streetName"
                    type="text"
                    required
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder="e.g., Bharathi Salai"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.streetName && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.streetName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    Area / Locality *
                  </label>
                  <input
                    id="area"
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g., Anna Nagar"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.area && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.area}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Chennai"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    District *
                  </label>
                  <input
                    id="district"
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g., Chennai"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.district}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="pinCode" className="block text-sm font-semibold text-brown-900 mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    id="pinCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="6-digit PIN code"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 font-mono focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                  {errors.pinCode && (
                    <p className="mt-1 text-xs text-red-700 font-medium">{errors.pinCode}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="deliveryInstructions"
                    className="block text-sm font-semibold text-brown-900 mb-1.5"
                  >
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="deliveryInstructions"
                    rows={2}
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="Landmark, gate code, or spice preference"
                    className="w-full px-3.5 py-2.5 text-sm bg-ivory-50 border border-cream-200 rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-maroon-800"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
                3. Payment Option
              </h2>

              <div className="space-y-3" role="radiogroup" aria-label="Payment method">
                {PAYMENT_OPTIONS.map((option) => {
                  const isSelected = paymentMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-maroon-800 bg-cream-100/70'
                          : 'border-cream-200 bg-ivory-50 hover:border-maroon-800/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => {
                          setPaymentMethod(option.id);
                          setDemoAcknowledged(false);
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.paymentDemo;
                            return next;
                          });
                        }}
                        className="mt-1 accent-maroon-800"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-brown-900">
                            {option.label}
                          </span>
                          <span className="text-xs font-medium text-brown-500">
                            {option.isDemo ? 'Demo Only' : 'Pay at Door'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-brown-700">{option.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {isDemoPayment && (
                <div className="p-4 rounded-xl bg-gold-100 border border-gold-500/40 space-y-3">
                  <div className="flex items-start gap-2.5 text-brown-900">
                    <ShieldAlert className="w-5 h-5 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-xs leading-relaxed space-y-1">
                      <p className="font-semibold">
                        Demonstration Payment Notice ({paymentMethod})
                      </p>
                      <p>
                        This online payment option is for demonstration only because a live
                        payment gateway is not connected. No money will be charged, and we never
                        collect UPI PINs, passwords, or bank credentials.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs font-medium text-brown-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={demoAcknowledged}
                      onChange={(e) => setDemoAcknowledged(e.target.checked)}
                      className="mt-0.5 accent-maroon-800"
                    />
                    <span>
                      I understand this {paymentMethod} option is a demonstration only (unverified
                      payment) and would like to submit my order for confirmation.
                    </span>
                  </label>
                  {errors.paymentDemo && (
                    <p className="text-xs text-red-700 font-semibold">{errors.paymentDemo}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Complete Order Summary */}
          <aside className="lg:col-span-5 bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-serif text-2xl font-bold text-brown-900 pb-3 border-b border-cream-200">
              Order Summary
            </h2>

            <div className="divide-y divide-cream-200 max-h-80 overflow-y-auto pr-1">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
                    <FoodImage src={item.image} alt={item.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brown-900 truncate">{item.name}</p>
                    <p className="text-xs text-brown-500 font-mono tabular-nums">
                      {quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-semibold text-brown-900 tabular-nums shrink-0">
                    ₹{item.price * quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-cream-200 space-y-2.5 text-sm">
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
              <div className="pt-2.5 border-t border-cream-200 flex items-center justify-between">
                <span className="font-semibold text-brown-900">Grand Total</span>
                <span className="font-mono text-xl font-bold text-maroon-800 tabular-nums">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-ivory-50 border border-cream-200 flex items-start gap-2.5 text-xs text-brown-700 leading-relaxed">
              <Info className="w-4 h-4 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Order confirmation will be prepared for your WhatsApp number via our backend
                WhatsApp Business Cloud API service (or manual WhatsApp click-to-chat if API
                credentials are not configured).
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 disabled:opacity-60 rounded-lg transition-colors min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>Confirm Order · ₹{grandTotal}</span>
                </>
              )}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
}
