import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import {
  createDeliveryJob,
  createDeliveryJobFromOrder,
  fetchAllDrivers,
  fetchDeliveryJobsByDate,
  fetchUnscheduledPaidOrders,
} from '@/lib/delivery-db';
import { fetchAllOrders } from '@/lib/admin-db';

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
    const date = request.nextUrl.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);

    const [drivers, jobs, unscheduledOrders] = await Promise.all([
      fetchAllDrivers(),
      fetchDeliveryJobsByDate(date),
      fetchUnscheduledPaidOrders(),
    ]);

    return NextResponse.json({ date, drivers, jobs, unscheduledOrders });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = (await request.json()) as {
      type?: 'manual' | 'order';
      order_id?: string;
      driver_id?: string | null;
      delivery_date: string;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      delivery_address?: string;
      items_description?: string;
      notes?: string;
      is_cash_order?: boolean;
      cash_due_pence?: number | null;
    };

    if (!body.delivery_date) {
      return NextResponse.json({ error: 'Delivery date is required' }, { status: 400 });
    }

    if (body.type === 'order' && body.order_id) {
      const orders = await fetchAllOrders();
      const order = orders.find((o) => o.id === body.order_id);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      const job = await createDeliveryJobFromOrder(order, body.delivery_date, body.driver_id ?? null);
      return NextResponse.json(job, { status: 201 });
    }

    if (!body.customer_name || !body.delivery_address) {
      return NextResponse.json({ error: 'Customer name and address are required' }, { status: 400 });
    }

    if (body.is_cash_order && (body.cash_due_pence == null || body.cash_due_pence < 0)) {
      return NextResponse.json(
        { error: 'Please enter the cash amount the driver should collect.' },
        { status: 400 },
      );
    }

    const job = await createDeliveryJob({
      driver_id: body.driver_id ?? null,
      delivery_date: body.delivery_date,
      customer_name: body.customer_name,
      customer_email: body.customer_email ?? null,
      customer_phone: body.customer_phone ?? null,
      delivery_address: body.delivery_address,
      items_description: body.items_description ?? null,
      notes: body.notes ?? null,
      is_cash_order: body.is_cash_order ?? false,
      cash_due_pence: body.cash_due_pence ?? null,
      source: 'manual',
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error('[admin/deliveries] POST failed:', err);
    const message = err instanceof Error ? err.message : 'Failed to create delivery';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
