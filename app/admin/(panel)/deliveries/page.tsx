import {
  fetchAllDrivers,
  fetchDeliveryJobsByDate,
  fetchUnscheduledPaidOrders,
} from '@/lib/delivery-db';
import { DeliveriesPageClient } from '@/components/admin/DeliveriesPageClient';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Order } from '@/lib/admin-types';
import type { DeliveryJob, Driver } from '@/lib/delivery-types';

export default async function AdminDeliveriesPage() {
  const date = new Date().toISOString().slice(0, 10);
  let drivers: Driver[] = [];
  let jobs: DeliveryJob[] = [];
  let unscheduledOrders: Order[] = [];

  if (isSupabaseConfigured) {
    try {
      [drivers, jobs, unscheduledOrders] = await Promise.all([
        fetchAllDrivers(),
        fetchDeliveryJobsByDate(date),
        fetchUnscheduledPaidOrders(),
      ]);
    } catch {
      drivers = [];
      jobs = [];
      unscheduledOrders = [];
    }
  }

  return (
    <DeliveriesPageClient
      initialDate={date}
      initialDrivers={drivers}
      initialJobs={jobs}
      initialUnscheduled={unscheduledOrders}
    />
  );
}
