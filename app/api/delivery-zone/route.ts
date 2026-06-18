import { NextRequest, NextResponse } from 'next/server';
import { getDeliveryZone } from '@/lib/delivery-zone';
import { looksLikeUkPostcode } from '@/lib/delivery-slots';

export async function GET(request: NextRequest) {
  const postcode = request.nextUrl.searchParams.get('postcode')?.trim() ?? '';

  if (!looksLikeUkPostcode(postcode)) {
    return NextResponse.json({ error: 'Invalid UK postcode' }, { status: 400 });
  }

  const zone = await getDeliveryZone(postcode);
  return NextResponse.json(zone);
}
