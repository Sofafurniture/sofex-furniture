import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { deleteDeliveryJob, fetchDeliveryJobById, updateDeliveryJob } from '@/lib/delivery-db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;

    const job = await updateDeliveryJob(id, {
      driver_id: body.driver_id as string | null | undefined,
      delivery_date: body.delivery_date as string | undefined,
      customer_name: body.customer_name as string | undefined,
      customer_email: body.customer_email as string | null | undefined,
      customer_phone: body.customer_phone as string | null | undefined,
      delivery_address: body.delivery_address as string | undefined,
      items_description: body.items_description as string | null | undefined,
      notes: body.notes as string | null | undefined,
      driver_remarks: body.driver_remarks as string | null | undefined,
      unable_to_deliver_notes: body.unable_to_deliver_notes as string | null | undefined,
      is_cash_order: body.is_cash_order as boolean | undefined,
      cash_received_pence: body.cash_received_pence as number | null | undefined,
      status: body.status as
        | 'scheduled'
        | 'out_for_delivery'
        | 'delivered'
        | 'cancelled'
        | 'unable_to_deliver'
        | undefined,
    });

    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const existing = await fetchDeliveryJobById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    await deleteDeliveryJob(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete delivery' }, { status: 500 });
  }
}
