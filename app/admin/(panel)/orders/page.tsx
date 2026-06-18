import { fetchAllOrders } from '@/lib/admin-db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { OrdersPageClient } from '@/components/admin/OrdersPageClient';

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof fetchAllOrders>> = [];

  if (isSupabaseConfigured) {
    try {
      orders = await fetchAllOrders();
    } catch (error) {
      console.error('[admin/orders] Failed to load orders:', error);
      orders = [];
    }
  }

  return <OrdersPageClient initialOrders={orders} />;
}
