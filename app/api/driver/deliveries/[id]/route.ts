import { NextRequest, NextResponse } from 'next/server';
import { sendOutForDeliveryEmail, sendUnableToDeliverEmail } from '@/lib/delivery-notifications';
import { requireDriverSession } from '@/lib/driver-auth';
import { fetchDeliveryJobById, updateDeliveryJob } from '@/lib/delivery-db';
import type { DriverDeliveryUpdateInput } from '@/lib/delivery-types';

const DRIVER_ALLOWED: DriverDeliveryUpdateInput['status'][] = [
  'out_for_delivery',
  'delivered',
  'unable_to_deliver',
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireDriverSession();
    const { id } = await params;
    const body = (await request.json()) as DriverDeliveryUpdateInput;

    if (!body.status || !DRIVER_ALLOWED.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (body.status === 'unable_to_deliver' && !body.unable_to_deliver_notes?.trim()) {
      return NextResponse.json(
        { error: 'Please explain why the delivery could not be completed.' },
        { status: 400 },
      );
    }

    const existing = await fetchDeliveryJobById(id);
    if (!existing || existing.driver_id !== session.driverId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (body.status === 'delivered' && existing.is_cash_order) {
      if (body.cash_received_pence == null || body.cash_received_pence < 0) {
        return NextResponse.json(
          { error: 'Please enter the cash amount received from the customer.' },
          { status: 400 },
        );
      }
    }

    const job = await updateDeliveryJob(id, {
      status: body.status,
      driver_remarks: body.driver_remarks?.trim() || null,
      unable_to_deliver_notes: body.unable_to_deliver_notes?.trim() || null,
      cash_received_pence: body.cash_received_pence ?? null,
    });

    if (body.status === 'out_for_delivery' && existing.status !== 'out_for_delivery') {
      try {
        await sendOutForDeliveryEmail(job);
      } catch (emailError) {
        console.error('[driver] Out for delivery email failed:', emailError);
      }
    }

    if (body.status === 'unable_to_deliver' && body.unable_to_deliver_notes?.trim()) {
      try {
        await sendUnableToDeliverEmail(job, body.unable_to_deliver_notes.trim());
      } catch (emailError) {
        console.error('[driver] Unable to deliver email failed:', emailError);
      }
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('[driver/deliveries] PATCH failed:', error);
    return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
  }
}
