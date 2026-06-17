import { createServiceClient } from '@/lib/supabase';
import type { Order, ProductWithRelations } from '@/lib/admin-types';

export async function fetchAllProducts(): Promise<ProductWithRelations[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_reviews(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductWithRelations[];
}

export async function fetchProductById(id: string): Promise<ProductWithRelations | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_reviews(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as ProductWithRelations;
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_reviews(*)')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data as ProductWithRelations;
}

export async function fetchAllOrders(): Promise<Order[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function fetchOrdersByDate(date: string): Promise<Order[]> {
  const supabase = createServiceClient();
  const start = `${date}T00:00:00.000Z`;
  const end = `${date}T23:59:59.999Z`;
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function getAdminStats() {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [products, orders, todayOrders] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', `${today}T00:00:00.000Z`),
  ]);

  return {
    productCount: products.count ?? 0,
    orderCount: orders.count ?? 0,
    todayOrderCount: todayOrders.count ?? 0,
  };
}

export function ordersToCsv(orders: Order[]): string {
  const headers = [
    'Order ID',
    'Date',
    'Customer Name',
    'Email',
    'Shipping Address',
    'Status',
    'Total (£)',
    'Sofa Model',
    'Sofa Size',
    'Fabric',
    'Colour',
    'Cushion',
    'Back Style',
    'Stripe Session',
  ];

  const rows = orders.map((o) => {
    const cfg = o.configuration as Record<string, string>;
    const date = new Date(o.created_at).toLocaleString('en-GB', { timeZone: 'Europe/London' });
    return [
      o.id,
      date,
      o.customer_name,
      o.customer_email,
      o.shipping_address,
      o.status,
      (o.total_pence / 100).toFixed(2),
      cfg.model ?? '',
      cfg.size ?? '',
      cfg.fabricQuality ?? '',
      cfg.fabricColorId ?? '',
      cfg.cushionType ?? '',
      cfg.backStyle ?? '',
      o.stripe_session_id ?? '',
    ];
  });

  const escape = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
  return [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
}
