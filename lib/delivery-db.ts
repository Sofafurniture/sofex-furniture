import { createServiceClient } from '@/lib/supabase';
import type { Order } from '@/lib/admin-types';
import type {
  CreateDeliveryJobInput,
  DeliveryJob,
  Driver,
  UpdateDeliveryJobInput,
} from '@/lib/delivery-types';

export function formatOrderDescription(configuration: Record<string, unknown>): string {
  const parts: string[] = [];
  if (configuration.model) parts.push(String(configuration.model));
  if (configuration.categoryIndex !== undefined) {
    parts.push(`category #${configuration.categoryIndex}`);
  } else if (configuration.size) {
    parts.push(String(configuration.size));
  }
  if (configuration.fabricQuality) parts.push(String(configuration.fabricQuality));
  if (configuration.fabricColorId) parts.push(String(configuration.fabricColorId));
  if (configuration.cushionType) parts.push(`${configuration.cushionType} cushions`);
  if (configuration.backStyle) parts.push(`${configuration.backStyle} back`);
  return parts.join(' · ') || 'Sofa order';
}

export async function ensureDriverRecord(email: string, name: string): Promise<Driver> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('drivers')
    .upsert({ email, name, active: true }, { onConflict: 'email' })
    .select()
    .single();

  if (error) throw error;
  return data as Driver;
}

export async function fetchAllDrivers(): Promise<Driver[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return (data ?? []) as Driver[];
}

export async function fetchDeliveryJobsByDate(date: string): Promise<DeliveryJob[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('delivery_jobs')
    .select('*, driver:drivers(*)')
    .eq('delivery_date', date)
    .neq('status', 'cancelled')
    .order('sort_order')
    .order('created_at');

  if (error) throw error;
  return (data ?? []) as DeliveryJob[];
}

export async function fetchDeliveryJobsForDriver(driverId: string, date: string): Promise<DeliveryJob[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('delivery_jobs')
    .select('*')
    .eq('driver_id', driverId)
    .eq('delivery_date', date)
    .neq('status', 'cancelled')
    .order('sort_order')
    .order('created_at');

  if (error) throw error;
  return (data ?? []) as DeliveryJob[];
}

export async function fetchUnscheduledPaidOrders(): Promise<Order[]> {
  const supabase = createServiceClient();
  const [{ data: orders, error: ordersError }, { data: jobs, error: jobsError }] = await Promise.all([
    supabase.from('orders').select('*').eq('status', 'paid').order('created_at', { ascending: false }),
    supabase.from('delivery_jobs').select('order_id').not('order_id', 'is', null),
  ]);

  if (ordersError) throw ordersError;
  if (jobsError) throw jobsError;

  const scheduledIds = new Set((jobs ?? []).map((j) => j.order_id).filter(Boolean));
  return ((orders ?? []) as Order[]).filter((o) => !scheduledIds.has(o.id));
}

export async function createDeliveryJob(input: CreateDeliveryJobInput): Promise<DeliveryJob> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('delivery_jobs')
    .insert({
      order_id: input.order_id ?? null,
      driver_id: input.driver_id ?? null,
      delivery_date: input.delivery_date,
      customer_name: input.customer_name,
      customer_email: input.customer_email ?? null,
      customer_phone: input.customer_phone ?? null,
      delivery_address: input.delivery_address,
      items_description: input.items_description ?? null,
      notes: input.notes ?? null,
      source: input.source,
      status: 'scheduled',
      updated_at: new Date().toISOString(),
    })
    .select('*, driver:drivers(*)')
    .single();

  if (error) throw error;
  return data as DeliveryJob;
}

export async function createDeliveryJobFromOrder(
  order: Order,
  deliveryDate: string,
  driverId?: string | null,
): Promise<DeliveryJob> {
  return createDeliveryJob({
    order_id: order.id,
    driver_id: driverId ?? null,
    delivery_date: deliveryDate,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    delivery_address: order.shipping_address,
    items_description: formatOrderDescription(order.configuration),
    notes: null,
    source: 'website',
  });
}

export async function updateDeliveryJob(id: string, input: UpdateDeliveryJobInput): Promise<DeliveryJob> {
  const supabase = createServiceClient();
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (input.driver_id !== undefined) payload.driver_id = input.driver_id;
  if (input.delivery_date !== undefined) payload.delivery_date = input.delivery_date;
  if (input.customer_name !== undefined) payload.customer_name = input.customer_name;
  if (input.customer_email !== undefined) payload.customer_email = input.customer_email;
  if (input.customer_phone !== undefined) payload.customer_phone = input.customer_phone;
  if (input.delivery_address !== undefined) payload.delivery_address = input.delivery_address;
  if (input.items_description !== undefined) payload.items_description = input.items_description;
  if (input.notes !== undefined) payload.notes = input.notes;
  if (input.status !== undefined) {
    payload.status = input.status;
    if (input.status === 'delivered') payload.delivered_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('delivery_jobs')
    .update(payload)
    .eq('id', id)
    .select('*, driver:drivers(*)')
    .single();

  if (error) throw error;
  return data as DeliveryJob;
}

export async function deleteDeliveryJob(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from('delivery_jobs').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchDeliveryJobById(id: string): Promise<DeliveryJob | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('delivery_jobs')
    .select('*, driver:drivers(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as DeliveryJob;
}
