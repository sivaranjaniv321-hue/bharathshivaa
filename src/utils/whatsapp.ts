import type { CartItem, CustomerDetails, PaymentMethod } from '../types';

export function formatWhatsAppE164(countryCode: string, localNumber: string): string {
  const codeDigits = countryCode.replace(/[^\d]/g, '');
  const phoneDigits = localNumber.replace(/[^\d]/g, '');
  return `+${codeDigits}${phoneDigits}`;
}

export function validateWhatsAppNumber(fullNumber: string): {
  valid: boolean;
  error?: string;
  normalized: string;
} {
  const trimmed = fullNumber.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'WhatsApp number with country code is required.',
      normalized: '',
    };
  }
  if (!trimmed.startsWith('+')) {
    return {
      valid: false,
      error: 'Include country code starting with + (e.g., +919876543210).',
      normalized: trimmed,
    };
  }

  const digits = trimmed.replace(/[^\d]/g, '');
  if (digits.startsWith('91')) {
    if (digits.length !== 12) {
      return {
        valid: false,
        error: 'Indian WhatsApp numbers (+91) must have exactly 10 digits after +91.',
        normalized: `+${digits}`,
      };
    }
    if (!/^[6-9]/.test(digits.slice(2))) {
      return {
        valid: false,
        error: 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
        normalized: `+${digits}`,
      };
    }
  } else if (digits.length < 10 || digits.length > 15) {
    return {
      valid: false,
      error: 'Enter a valid international WhatsApp number (10 to 15 digits including country code).',
      normalized: `+${digits}`,
    };
  }

  return {
    valid: true,
    normalized: `+${digits}`,
  };
}

export function formatFullAddress(customer: CustomerDetails): string {
  const parts = [
    customer.houseNumber,
    customer.streetName,
    customer.area,
    customer.city,
    `${customer.district} - ${customer.pinCode}`,
  ]
    .map((p) => p.trim())
    .filter(Boolean);

  const base = parts.join(', ');
  if (customer.deliveryInstructions.trim()) {
    return `${base} (Note: ${customer.deliveryInstructions.trim()})`;
  }
  return base;
}

export function buildClientOrderMessage(params: {
  orderNumber: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  orderStatus: string;
}): string {
  const itemLines = params.items
    .map(
      (entry, index) =>
        `${index + 1}. ${entry.item.name} x ${entry.quantity} — ₹${entry.item.price * entry.quantity} (₹${entry.item.price} each)`
    )
    .join('\n');

  const deliveryAddress = formatFullAddress(params.customer);

  return [
    '*Bharath Delights — Order Confirmation*',
    '',
    `Order Number: ${params.orderNumber}`,
    `Order Status: ${params.orderStatus}`,
    `Customer Name: ${params.customer.fullName}`,
    `Mobile Number: ${params.customer.mobileNumber}`,
    `WhatsApp Number: ${params.customer.whatsappNumber}`,
    '',
    '*Ordered Food Items:*',
    itemLines,
    '',
    `Subtotal: ₹${params.subtotal}`,
    `Delivery Charge: ₹${params.deliveryCharge}`,
    `*Total Amount: ₹${params.totalAmount}*`,
    `Payment Method: ${params.paymentMethod}`,
    '',
    '*Delivery Address:*',
    deliveryAddress,
    '',
    'Thank you for ordering from Bharath Delights!',
  ].join('\n');
}

export function buildCustomerWhatsAppUrl(whatsappNumber: string, messageText: string): string {
  const digits = whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(messageText)}`;
}
