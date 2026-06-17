import { NextRequest, NextResponse } from 'next/server';
import { buildOrderDescription, calculatePrice } from '@/lib/pricing';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import type { SofaConfiguration } from '@/lib/sofa-data';

interface CheckoutBody {
  config: SofaConfiguration;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const { config, customerName, customerEmail, shippingAddress } = body;

    if (!config || !customerName?.trim() || !customerEmail?.trim() || !shippingAddress?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prices = calculatePrice(config);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

    if (!isStripeConfigured || !isSupabaseConfigured) {
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message: 'Add Stripe and Supabase keys to .env.local. See .env.example for details.',
          demoMode: true,
          total: prices.total,
        },
        { status: 503 },
      );
    }

    const supabase = createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: customerEmail.trim(),
        customer_name: customerName.trim(),
        shipping_address: shippingAddress.trim(),
        configuration: config,
        total_pence: prices.total * 100,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const stripe = getStripe();
    const description = buildOrderDescription(config);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail.trim(),
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Bespoke Custom Sofa',
              description,
              images: [],
            },
            unit_amount: prices.total * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: order.id,
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel?order_id=${order.id}`,
    });

    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
