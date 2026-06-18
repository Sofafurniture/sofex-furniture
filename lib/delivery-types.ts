export type DeliveryStatus =
  | 'scheduled'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'unable_to_deliver';
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
  driver_remarks: string | null;
  unable_to_deliver_notes: string | null;
  is_cash_order: boolean;
  cash_received_pence: number | null;
  distance_miles: number | null;
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
  is_cash_order?: boolean;
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
  driver_remarks?: string | null;
  unable_to_deliver_notes?: string | null;
  is_cash_order?: boolean;
  cash_received_pence?: number | null;
  distance_miles?: number | null;
  status?: DeliveryStatus;
}

export interface DriverDeliveryUpdateInput {
  status: 'out_for_delivery' | 'delivered' | 'unable_to_deliver';
  driver_remarks?: string | null;
  unable_to_deliver_notes?: string | null;
  cash_received_pence?: number | null;
}
