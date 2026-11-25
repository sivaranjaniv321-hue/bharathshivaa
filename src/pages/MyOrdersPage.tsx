import { ExternalLink, MessageCircle, ShoppingBag } from 'lucide-react';
import type { OrderRecord, PageId } from '../types';
import { FoodImage } from '../components/FoodImage';
import { formatFullAddress } from '../utils/whatsapp';

interface MyOrdersPageProps {
  orders: OrderRecord[];
  onNavigate: (page: PageId) => void;
}

export function MyOrdersPage({ orders, onNavigate }: MyOrdersPageProps) {
  if (orders.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-ivory-50 min-h-[70vh] flex items-center">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-cream-100 border border-cream-200 flex items-center justify-center text-maroon-800">
            <ShoppingBag className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brown-900">No Orders Yet</h1>
          <p className="text-base text-brown-700 leading-relaxed">
            Once you place an order at Bharath Delights, your order history and delivery details
            will appear here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="px-6 py-3 text-sm font-semibold text-white bg-maroon-800 hover:bg-maroon-900 rounded-lg transition-colors min-h-[44px]"
          >
            Browse Menu
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-ivory-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-wider text-maroon-800 uppercase">
            Order History
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-brown-900">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-brown-700">
            Orders placed in this browser are saved locally for easy reference.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order.orderNumber}
              className="bg-white border border-cream-200 rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-mono text-lg font-bold text-brown-900">
                      Order #{order.orderNumber}
                    </h2>
                    <span className="text-xs text-brown-500">·</span>
                    <span className="text-xs text-brown-700">{order.orderDate}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-maroon-800">{order.orderStatus}</p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-mono text-xl font-bold text-maroon-800 tabular-nums">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-xs text-brown-500">
                    {order.paymentMethod}
                    {order.isDemoPayment ? ' (Demo)' : ''}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.items.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-ivory-50 border border-cream-200"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-cream-100 border border-cream-200 shrink-0">
                      <FoodImage src={item.image} alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-semibold text-brown-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-brown-700 font-mono tabular-nums mt-0.5">
                        Qty {quantity} · ₹{item.price * quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brown-700">
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold text-brown-900">Delivered to:</span>{' '}
                    {order.customer.fullName} — {formatFullAddress(order.customer)}
                  </p>
                  <p>
                    <span className="font-semibold text-brown-900">WhatsApp:</span>{' '}
                    <span className="font-mono">{order.customer.whatsappNumber}</span> (
                    {order.whatsappResult.sent
                      ? 'Sent via WhatsApp Cloud API'
                      : 'Manual WhatsApp Send Available'}
                    )
                  </p>
                </div>

                <a
                  href={order.whatsappResult.waMeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg whitespace-nowrap self-start sm:self-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Open WhatsApp Receipt</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
