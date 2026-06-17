import { NextRequest, NextResponse } from 'next/server';
import { requireDriverSession } from '@/lib/driver-auth';
import { fetchDeliveryJobsForDriver } from '@/lib/delivery-db';

export async function GET(request: NextRequest) {
  try {
    const session = await requireDriverSession();
    const date = request.nextUrl.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
    const jobs = await fetchDeliveryJobsForDriver(session.driverId, date);
    return NextResponse.json({ date, jobs });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
