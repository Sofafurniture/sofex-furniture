import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '@/lib/fulfill-order';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set on Netlify');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const result = await fulfillOrder(orderId);
      if (result.emailError) {
        console.error('[stripe-webhook] Fulfillment email issue:', result);
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      const supabase = createServiceClient();
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
    }
  }

  return NextResponse.json({ received: true });
}
