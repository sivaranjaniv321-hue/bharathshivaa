import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

interface OrderItemInput {
  name: string;
  quantity: number;
  price: number;
}

interface WhatsAppNotifyBody {
  orderNumber?: string;
  customerName?: string;
  customerMobile?: string;
  customerWhatsApp?: string;
  deliveryAddress?: string;
  items?: OrderItemInput[];
  subtotal?: number;
  deliveryCharge?: number;
  totalAmount?: number;
  paymentMethod?: string;
  orderStatus?: string;
}

function normalizeWhatsAppDigits(input: string): string {
  return input.replace(/[^\d]/g, '');
}

function isValidWhatsAppE164(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed.startsWith('+')) {
    return false;
  }
  const digits = normalizeWhatsAppDigits(trimmed);
  if (digits.length < 10 || digits.length > 15) {
    return false;
  }
  if (digits.startsWith('91') && digits.length !== 12) {
    return false;
  }
  return true;
}

function buildOrderMessage(payload: {
  orderNumber: string;
  customerName: string;
  customerMobile: string;
  customerWhatsApp: string;
  deliveryAddress: string;
  items: OrderItemInput[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
}): string {
  const itemLines = payload.items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} x ${item.quantity} — ₹${item.price * item.quantity} (₹${item.price} each)`
    )
    .join('\n');

  return [
    '*Bharath Delights — Order Confirmation*',
    '',
    `Order Number: ${payload.orderNumber}`,
    `Order Status: ${payload.orderStatus}`,
    `Customer Name: ${payload.customerName}`,
    `Mobile Number: ${payload.customerMobile}`,
    `WhatsApp Number: ${payload.customerWhatsApp}`,
    '',
    '*Ordered Food Items:*',
    itemLines,
    '',
    `Subtotal: ₹${payload.subtotal}`,
    `Delivery Charge: ₹${payload.deliveryCharge}`,
    `*Total Amount: ₹${payload.totalAmount}*`,
    `Payment Method: ${payload.paymentMethod}`,
    '',
    `*Delivery Address:*`,
    payload.deliveryAddress,
    '',
    'Thank you for ordering from Bharath Delights!',
  ].join('\n');
}

app.get('/api/whatsapp/status', (_req: Request, res: Response) => {
  const hasToken = Boolean(process.env.WHATSAPP_CLOUD_API_TOKEN?.trim());
  const hasPhoneId = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID?.trim());
  res.json({
    configured: hasToken && hasPhoneId,
    templateName: process.env.WHATSAPP_TEMPLATE_NAME?.trim() || 'order_confirmation',
  });
});

app.post('/api/orders/whatsapp-notify', async (req: Request, res: Response) => {
  try {
    const body = (req.body || {}) as WhatsAppNotifyBody;

    const orderNumber = typeof body.orderNumber === 'string' ? body.orderNumber.trim() : '';
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const customerMobile = typeof body.customerMobile === 'string' ? body.customerMobile.trim() : '';
    const customerWhatsApp =
      typeof body.customerWhatsApp === 'string' ? body.customerWhatsApp.trim() : '';
    const deliveryAddress =
      typeof body.deliveryAddress === 'string' ? body.deliveryAddress.trim() : '';
    const paymentMethod = typeof body.paymentMethod === 'string' ? body.paymentMethod.trim() : '';
    const orderStatus =
      typeof body.orderStatus === 'string' && body.orderStatus.trim()
        ? body.orderStatus.trim()
        : 'Order Received';

    const items = Array.isArray(body.items)
      ? body.items.filter(
          (item): item is OrderItemInput =>
            Boolean(item) &&
            typeof item.name === 'string' &&
            typeof item.quantity === 'number' &&
            Number.isFinite(item.quantity) &&
            item.quantity > 0 &&
            typeof item.price === 'number' &&
            Number.isFinite(item.price) &&
            item.price >= 0
        )
      : [];

    if (!orderNumber || !customerName || !deliveryAddress || !paymentMethod || items.length === 0) {
      res.status(400).json({
        sent: false,
        mode: 'validation_error',
        reason: 'Missing required order fields for WhatsApp notification.',
      });
      return;
    }

    if (!isValidWhatsAppE164(customerWhatsApp)) {
      res.status(400).json({
        sent: false,
        mode: 'validation_error',
        reason:
          'Invalid customer WhatsApp number. Please include a valid country code (for example, +91 followed by 10 digits).',
      });
      return;
    }

    const subtotal =
      typeof body.subtotal === 'number' && Number.isFinite(body.subtotal)
        ? body.subtotal
        : items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge =
      typeof body.deliveryCharge === 'number' && Number.isFinite(body.deliveryCharge)
        ? body.deliveryCharge
        : 0;
    const totalAmount =
      typeof body.totalAmount === 'number' && Number.isFinite(body.totalAmount)
        ? body.totalAmount
        : subtotal + deliveryCharge;

    const messageText = buildOrderMessage({
      orderNumber,
      customerName,
      customerMobile,
      customerWhatsApp,
      deliveryAddress,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      orderStatus,
    });

    const recipientDigits = normalizeWhatsAppDigits(customerWhatsApp);
    const waMeUrl = `https://wa.me/${recipientDigits}?text=${encodeURIComponent(messageText)}`;

    const accessToken = process.env.WHATSAPP_CLOUD_API_TOKEN?.trim();
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
    const templateLang = process.env.WHATSAPP_TEMPLATE_LANG?.trim() || 'en';
    const useFreeformText = process.env.WHATSAPP_USE_FREEFORM_TEXT === 'true';

    if (!accessToken || !phoneNumberId) {
      res.json({
        sent: false,
        mode: 'manual_click_to_chat',
        recipient: customerWhatsApp,
        waMeUrl,
        messageText,
        reason:
          'WhatsApp Business Platform Cloud API credentials (WHATSAPP_CLOUD_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID) are not configured on the server.',
      });
      return;
    }

    const graphEndpoint = `https://graph.facebook.com/v21.0/${encodeURIComponent(phoneNumberId)}/messages`;

    const itemsSummary = items
      .map((item) => `${item.name} x${item.quantity} (₹${item.price * item.quantity})`)
      .join(', ');

    const graphBody =
      !useFreeformText && templateName
        ? {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientDigits,
            type: 'template',
            template: {
              name: templateName,
              language: { code: templateLang },
              components: [
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: customerName },
                    { type: 'text', text: orderNumber },
                    { type: 'text', text: itemsSummary.slice(0, 1000) },
                    { type: 'text', text: `₹${totalAmount}` },
                    { type: 'text', text: paymentMethod },
                    { type: 'text', text: deliveryAddress.slice(0, 1000) },
                    { type: 'text', text: orderStatus },
                  ],
                },
              ],
            },
          }
        : {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: recipientDigits,
            type: 'text',
            text: {
              preview_url: false,
              body: messageText,
            },
          };

    const apiResponse = await fetch(graphEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphBody),
    });

    const apiData = (await apiResponse.json().catch(() => ({}))) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string };
    };

    const confirmedMessageId = apiData.messages?.[0]?.id;

    if (apiResponse.ok && confirmedMessageId) {
      res.json({
        sent: true,
        mode: 'cloud_api',
        recipient: customerWhatsApp,
        messageId: confirmedMessageId,
        waMeUrl,
        messageText,
      });
      return;
    }

    res.status(200).json({
      sent: false,
      mode: 'manual_click_to_chat',
      recipient: customerWhatsApp,
      waMeUrl,
      messageText,
      reason:
        apiData.error?.message ||
        'WhatsApp Business Cloud API did not confirm delivery. You can send the confirmation manually via WhatsApp.',
    });
  } catch (error) {
    res.status(500).json({
      sent: false,
      mode: 'manual_click_to_chat',
      reason:
        error instanceof Error
          ? error.message
          : 'Unexpected error communicating with WhatsApp Cloud API.',
    });
  }
});

app.post('/api/contact', (req: Request, res: Response) => {
  const body = (req.body || {}) as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    res.status(400).json({
      received: false,
      error: 'Name, email, and message are required.',
    });
    return;
  }

  const referenceId = `BD-INQ-${Date.now().toString().slice(-6)}`;
  res.json({
    received: true,
    referenceId,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bharath Delights server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
