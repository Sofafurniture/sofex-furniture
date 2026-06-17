export type DeliveryStatus = 'scheduled' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type DeliverySource = 'website' | 'manual';

export interface Driver {
  id: string;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export interface DeliveryJob {
  id: string;
  order_id: string | null;
  driver_id: string | null;
  delivery_date: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_address: string;
  items_description: string | null;
  notes: string | null;
  status: DeliveryStatus;
  source: DeliverySource;
  sort_order: number;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  driver?: Driver | null;
}

export interface CreateDeliveryJobInput {
  order_id?: string | null;
  driver_id?: string | null;
  delivery_date: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  delivery_address: string;
  items_description?: string | null;
  notes?: string | null;
  source: DeliverySource;
}

export interface UpdateDeliveryJobInput {
  driver_id?: string | null;
  delivery_date?: string;
  customer_name?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  delivery_address?: string;
  items_description?: string | null;
  notes?: string | null;
  status?: DeliveryStatus;
}
