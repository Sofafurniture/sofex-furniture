import { BRAND_NAME, STORE_EMAIL } from './brand';
import { escapeHtml, sendEmail } from './email';
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

function formatGbp(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

function orderSummaryHtml(order: OrderRecord): string {
  const config = order.configuration;
  const description = buildOrderDescription(config);
  const delivery = config.deliveryLabel ?? `${config.deliveryDate ?? ''} ${config.deliverySlot ?? ''}`.trim();
  const phone = config.customerPhone ?? '—';
  const remarks = config.deliveryRemarks?.trim();

  return `
    <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
    <p><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Address:</strong> ${escapeHtml(order.shipping_address)}</p>
    <p><strong>Configuration:</strong> ${escapeHtml(description)}</p>
    <p><strong>Delivery:</strong> ${escapeHtml(delivery || '—')}</p>
    ${remarks ? `<p><strong>Delivery notes:</strong> ${escapeHtml(remarks)}</p>` : ''}
    <p><strong>Total paid:</strong> ${formatGbp(order.total_pence)}</p>
  `;
}

export async function sendOrderConfirmationEmails(order: OrderRecord): Promise<void> {
  const summary = orderSummaryHtml(order);
  const total = formatGbp(order.total_pence);

  await sendEmail({
    to: order.customer_email,
    subject: `Order confirmed — ${BRAND_NAME}`,
    replyTo: STORE_EMAIL,
    html: `
      <h2>Thank you for your order</h2>
      <p>Hi ${escapeHtml(order.customer_name)},</p>
      <p>We've received your payment of <strong>${total}</strong>. Our team will be in touch about your delivery slot.</p>
      ${summary}
      <p>Questions? Reply to this email or contact us at <a href="mailto:${STORE_EMAIL}">${STORE_EMAIL}</a>.</p>
      <p>— ${BRAND_NAME}</p>
    `,
  });

  await sendEmail({
    to: STORE_EMAIL,
    subject: `New paid order — ${order.customer_name} (${total})`,
    replyTo: order.customer_email,
    html: `
      <h2>New order received</h2>
      <p>A customer has completed checkout on the website.</p>
      ${summary}
    `,
  });
}
