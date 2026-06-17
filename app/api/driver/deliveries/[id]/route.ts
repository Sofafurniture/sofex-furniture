import { NextRequest, NextResponse } from 'next/server';
import { requireDriverSession } from '@/lib/driver-auth';
import { fetchDeliveryJobById, updateDeliveryJob } from '@/lib/delivery-db';
import type { DeliveryStatus } from '@/lib/delivery-types';

const DRIVER_ALLOWED: DeliveryStatus[] = ['out_for_delivery', 'delivered'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireDriverSession();
    const { id } = await params;
    const { status } = (await request.json()) as { status?: DeliveryStatus };

    if (!status || !DRIVER_ALLOWED.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await fetchDeliveryJobById(id);
    if (!existing || existing.driver_id !== session.driverId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const job = await updateDeliveryJob(id, { status });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
  }
}
