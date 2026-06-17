import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { fetchOrdersByDate, ordersToCsv } from '@/lib/admin-db';

export async function GET(request: NextRequest) {
  try {
    await requireAdminSession();
    const date = request.nextUrl.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
    const orders = await fetchOrdersByDate(date);
    const csv = ordersToCsv(orders);
    const filename = `sofex-orders-${date}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
