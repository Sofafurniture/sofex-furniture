import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { fetchAllOrders } from '@/lib/admin-db';

export async function GET() {
  try {
    await requireAdminSession();
    const orders = await fetchAllOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
