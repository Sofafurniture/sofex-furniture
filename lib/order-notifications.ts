import { BRAND_NAME, STORE_EMAIL } from './brand';
import { sendEmail } from './email';
import {
  buildCustomerOrderEmail,
  buildStoreOrderEmail,
  type OrderEmailData,
} from './order-email-template';
import { buildOrderDescription } from './pricing';
import type { SofaConfiguration } from './sofa-data';

interface OrderRecord {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  configuration: SofaConfiguration & {
    deliveryLabel?: string;
    deliveryRemarks?: string;
    customerPhone?: string;
    deliveryDate?: string;
    deliverySlot?: string;
  };
  total_pence: number;
}

export interface OrderEmailResults {
  customer: Awaited<ReturnType<typeof sendEmail>>;
  store: Awaited<ReturnType<typeof sendEmail>>;
}

function formatGbp(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

function toEmailData(order: OrderRecord): OrderEmailData {
  const config = order.configuration;
  const delivery =
    config.deliveryLabel?.trim() ||
    [config.deliveryDate, config.deliverySlot].filter(Boolean).join(' ').trim() ||
    'To be confirmed';

  return {
    orderId: order.id,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: config.customerPhone?.trim() || '—',
    shippingAddress: order.shipping_address,
    sofaDescription: buildOrderDescription(config),
    deliveryWindow: delivery,
    deliveryNotes: config.deliveryRemarks?.trim() || undefined,
    totalPaid: formatGbp(order.total_pence),
  };
}

export async function sendOrderConfirmationEmails(order: OrderRecord): Promise<OrderEmailResults> {
  const data = toEmailData(order);
  const total = data.totalPaid;

  const customer = await sendEmail({
    to: order.customer_email,
    subject: `Your Sofex order is confirmed — ${total}`,
    replyTo: STORE_EMAIL,
    html: buildCustomerOrderEmail(data),
  });

  const store = await sendEmail({
    to: STORE_EMAIL,
    subject: `New paid order — ${order.customer_name} (${total})`,
    replyTo: order.customer_email,
    html: buildStoreOrderEmail(data),
  });

  if (!customer.ok) {
    console.error('[order-email] Customer email failed:', customer.error);
  }
  if (!store.ok) {
    console.error('[order-email] Store email failed:', store.error);
  }

  return { customer, store };
}
