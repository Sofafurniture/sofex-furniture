import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '@/lib/fulfill-order';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

/** Confirms a paid order and sends confirmation emails (idempotent). */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { sessionId?: string; orderId?: string };

    let orderId = body.orderId?.trim();

    if (!orderId && body.sessionId?.trim()) {
      if (!isStripeConfigured) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
      }

      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(body.sessionId.trim());

      if (session.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
      }

      orderId = session.metadata?.order_id;
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order reference' }, { status: 400 });
    }

    const result = await fulfillOrder(orderId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[orders/confirm] Error:', error);
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 });
  }
}
