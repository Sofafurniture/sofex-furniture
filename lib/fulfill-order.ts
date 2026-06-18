import { createServiceClient } from './supabase';
import { sendOrderConfirmationEmails } from './order-notifications';
import type { SofaConfiguration } from './sofa-data';

export type OrderConfiguration = SofaConfiguration & {
  deliveryLabel?: string;
  deliveryRemarks?: string;
  customerPhone?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  confirmationEmailSent?: boolean;
};

interface OrderRow {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  configuration: OrderConfiguration;
  total_pence: number;
  status: string;
}

export interface FulfillOrderResult {
  ok: boolean;
  orderId?: string;
  status?: string;
  emailed: boolean;
  emailError?: string;
}

function asOrderConfiguration(value: unknown): OrderConfiguration {
  return (value ?? {}) as OrderConfiguration;
}

export async function fulfillOrder(orderId: string): Promise<FulfillOrderResult> {
  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from('orders')
    .select('id, customer_email, customer_name, shipping_address, configuration, total_pence, status')
    .eq('id', orderId)
    .single();

  if (fetchError || !existing) {
    console.error('[fulfill-order] Order not found:', orderId, fetchError);
    return { ok: false, emailed: false, emailError: 'Order not found' };
  }

  const order = existing as OrderRow;
  const configuration = asOrderConfiguration(order.configuration);

  if (order.status === 'pending') {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (updateError) {
      console.error('[fulfill-order] Failed to mark paid:', updateError);
      return { ok: false, orderId, status: order.status, emailed: false, emailError: 'Failed to update order' };
    }
    order.status = 'paid';
  }

  if (configuration.confirmationEmailSent) {
    return { ok: true, orderId, status: order.status, emailed: false };
  }

  const emailResults = await sendOrderConfirmationEmails({
    id: order.id,
    customer_email: order.customer_email,
    customer_name: order.customer_name,
    shipping_address: order.shipping_address,
    configuration,
    total_pence: order.total_pence,
  });

  if (!emailResults.customer.ok && !emailResults.store.ok) {
    const emailError = emailResults.customer.error ?? emailResults.store.error ?? 'Email send failed';
    console.error('[fulfill-order] Email failed:', emailError, emailResults);
    return { ok: true, orderId, status: order.status, emailed: false, emailError };
  }

  const { error: flagError } = await supabase
    .from('orders')
    .update({
      configuration: { ...configuration, confirmationEmailSent: true },
    })
    .eq('id', orderId);

  if (flagError) {
    console.error('[fulfill-order] Failed to flag email sent:', flagError);
  }

  return { ok: true, orderId, status: order.status, emailed: true };
}
