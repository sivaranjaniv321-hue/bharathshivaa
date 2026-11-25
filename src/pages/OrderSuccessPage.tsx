import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import type { OrderRecord, PageId } from '../types';
import { FoodImage } from '../components/FoodImage';
import { formatFullAddress } from '../utils/whatsapp';

interface OrderSuccessPageProps {
  order: OrderRecord | null;
  onNavigate: (page: PageId) => void;
}

export function OrderSuccessPage({ order, onNavigate }: OrderSuccessPageProps) {
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <section className="py-16 lg:py-24 bg-ivory-50 min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <h1 className="font-serif text-3xl font-bold text-brown-900">
            No Order Submitted Yet
          </h1>
          <p className="text-base text-brown-700 leading-relaxed">
            This page displays confirmation details after you submit an order through checkout.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('my-orders')}
              className="px-5 py-2.5 text-sm font-semibold text-maroon-800 bg-cream-100 hover:bg-cream-200 rounded-lg min-h-[44px]"
            >
              View My Orders
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg min-h-[44px]"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  const deliveryAddress = formatFullAddress(order.customer);
  const { whatsappResult } = order;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(whatsappResult.messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-ivory-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner */}
        <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
            Order #{order.orderNumber}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 text-balance">
            Thank you for ordering from Bharath Delights! Your order has been received.
          </h1>
          <p className="text-sm text-brown-700">
            Placed for <span className="font-semibold text-brown-900">{order.customer.fullName}</span>{' '}
            · Estimated Delivery Time:{' '}
            <span className="font-semibold text-brown-900">{order.estimatedDeliveryTime}</span>
          </p>
        </div>

        {/* WhatsApp Order Notification Status — Honest API / Manual Verification */}
        <div
          className={`rounded-2xl border p-6 sm:p-8 space-y-4 ${
            whatsappResult.sent
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-gold-100/70 border-gold-500/40'
          }`}
        >
          <div className="flex items-start gap-3">
            {whatsappResult.sent ? (
              <MessageCircle className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-maroon-800 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div className="space-y-1.5">
              <h2 className="font-serif text-xl font-bold text-brown-900">
                {whatsappResult.sent
                  ? `WhatsApp Confirmation Sent to ${whatsappResult.recipient}`
                  : `WhatsApp Confirmation Prepared for ${whatsappResult.recipient} (Manual Send Required)`}
              </h2>

              {whatsappResult.sent ? (
                <p className="text-sm text-brown-700 leading-relaxed">
                  Confirmed by WhatsApp Business Platform Cloud API (Message ID:{' '}
                  <span className="font-mono text-xs">{whatsappResult.messageId}</span>). Your order
                  details have been dispatched to your WhatsApp number.
                </p>
              ) : (
                <p className="text-sm text-brown-700 leading-relaxed">
                  {whatsappResult.reason ||
                    'Automatic WhatsApp sending is not configured on the server.'}{' '}
                  Because automatic delivery was not confirmed by the WhatsApp service, please click
                  below to open your pre-filled order message in WhatsApp to your number (
                  <span className="font-mono font-semibold">{whatsappResult.recipient}</span>) and
                  tap Send manually.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={whatsappResult.waMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Open Order Confirmation in WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brown-900 bg-white border border-cream-200 hover:bg-cream-100 rounded-lg transition-colors min-h-[44px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Copy Order Message</span>
                </>
              )}
            </button>
          </div>

          <details className="pt-2">
            <summary className="text-xs font-semibold text-maroon-800 cursor-pointer hover:underline">
              Preview Formatted WhatsApp Order Message
            </summary>
            <pre className="mt-3 p-4 bg-white border border-cream-200 rounded-xl text-xs text-brown-900 whitespace-pre-wrap font-sans leading-relaxed">
              {whatsappResult.messageText}
            </pre>
          </details>
        </div>

        {/* Order Details & Items */}
        <div className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-6 border-b border-cream-200 text-sm">
            <div>
              <p className="text-xs text-brown-500">Order Number</p>
              <p className="font-mono font-bold text-brown-900 mt-1">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-brown-500">Order Status</p>
              <p className="font-semibold text-maroon-800 mt-1">{order.orderStatus}</p>
            </div>
            <div>
              <p className="text-xs text-brown-500">Payment Method</p>
              <p className="font-semibold text-brown-900 mt-1">
                {order.paymentMethod}
                {order.isDemoPayment ? ' (Demo Only)' : ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-brown-500">Total Amount</p>
              <p className="font-mono font-bold text-maroon-800 mt-1 tabular-nums">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-xs text-brown-500">Delivery Address</p>
            <p className="text-brown-900 font-medium">{deliveryAddress}</p>
            <p className="text-xs text-brown-700 pt-1">
              Mobile: <span className="font-mono">{order.customer.mobileNumber}</span> · WhatsApp:{' '}
              <span className="font-mono">{order.customer.whatsappNumber}</span>
            </p>
          </div>

          <div className="pt-4 border-t border-cream-200">
            <h3 className="font-serif text-lg font-bold text-brown-900 mb-4">Ordered Food Items</h3>
            <div className="divide-y divide-cream-200">
              {order.items.map(({ item, quantity }) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
                    <FoodImage src={item.image} alt={item.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-semibold text-brown-900">{item.name}</p>
                    <p className="text-xs text-brown-500 font-mono tabular-nums">
                      Qty: {quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="font-mono font-semibold text-brown-900 tabular-nums">
                    ₹{item.price * quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-cream-200 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onNavigate('my-orders')}
              className="px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
            >
              View My Orders
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-6 py-3 text-sm font-semibold text-maroon-800 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors min-h-[44px]"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
