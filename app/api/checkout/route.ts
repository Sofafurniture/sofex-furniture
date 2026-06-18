import { NextRequest, NextResponse } from 'next/server';
import { buildOrderDescription, calculatePrice } from '@/lib/pricing';
import { formatDeliverySlot, isDeliveryDateAllowed } from '@/lib/delivery-slots';
import { getDeliveryZone } from '@/lib/delivery-zone';
import { applyPercentDiscount, FIRST_ORDER_DISCOUNT_PERCENT, validateDiscountCode } from '@/lib/discount';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import type { SofaConfiguration } from '@/lib/sofa-data';

interface CheckoutBody {
  config: SofaConfiguration;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  postcode: string;
  deliveryDate: string;
  deliverySlot: string;
  deliveryRemarks?: string;
  checkoutMode: 'guest' | 'account';
  discountCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const {
      config,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      postcode,
      deliveryDate,
      deliverySlot,
      deliveryRemarks,
      checkoutMode,
      discountCode,
    } = body;

    if (
      !config ||
      !customerName?.trim() ||
      !customerEmail?.trim() ||
      !customerPhone?.trim() ||
      !shippingAddress?.trim() ||
      !postcode?.trim() ||
      !deliveryDate ||
      !deliverySlot
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isDeliveryDateAllowed(deliveryDate)) {
      return NextResponse.json(
        { error: 'Invalid delivery date', message: 'Please choose a delivery date at least 2 days from today.' },
        { status: 400 },
      );
    }

    const zone = await getDeliveryZone(postcode);
    if (zone.status === 'unknown') {
      return NextResponse.json(
        { error: 'Invalid postcode', message: zone.message || 'Please enter a valid UK postcode.' },
        { status: 400 },
      );
    }

    const prices = calculatePrice(config);
    let totalPence = prices.total * 100;
    const deliverySurchargePence = zone.surchargeGbp * 100;
    totalPence += deliverySurchargePence;
    let discountApplied = false;

    if (discountCode?.trim()) {
      const valid = await validateDiscountCode(discountCode);
      if (valid) {
        totalPence = applyPercentDiscount(totalPence, FIRST_ORDER_DISCOUNT_PERCENT);
        discountApplied = true;
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const fullAddress = `${shippingAddress.trim()}, ${postcode.trim().toUpperCase()}`;
    const deliveryLabel = formatDeliverySlot(deliveryDate, deliverySlot);

    const enrichedConfig = {
      ...config,
      customerPhone: customerPhone.trim(),
      postcode: postcode.trim().toUpperCase(),
      deliveryDate,
      deliverySlot,
      deliveryLabel,
      deliveryRemarks: deliveryRemarks?.trim() ?? '',
      checkoutMode,
      discountCode: discountCode?.trim().toUpperCase() ?? '',
      discountApplied,
      deliveryZone: zone.status,
      deliveryDistanceMiles: zone.distanceMiles,
      deliverySurchargeGbp: zone.surchargeGbp,
    };

    if (!isStripeConfigured || !isSupabaseConfigured) {
      return NextResponse.json(
        {
          error: 'Payment system not configured',
          message: 'Add Stripe keys to Netlify env vars — see README. Keys: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET.',
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
        shipping_address: fullAddress,
        configuration: enrichedConfig,
        total_pence: totalPence,
        status: 'pending',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    const stripe = getStripe();
    const description = `${buildOrderDescription(config)} · Delivery: ${deliveryLabel}${
      zone.surchargeGbp > 0 ? ` · Out-of-zone delivery +£${zone.surchargeGbp}` : ' · Free delivery'
    }`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail.trim(),
      payment_method_types: ['card', 'klarna', 'afterpay_clearpay'],
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['GB'] },
      phone_number_collection: { enabled: false },
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Bespoke Custom Sofa — Sofex Furniture',
              description: discountApplied
                ? `${description} · 15% first-order discount applied`
                : description,
            },
            unit_amount: totalPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: order.id,
        delivery_date: deliveryDate,
        delivery_slot: deliverySlot,
        delivery_remarks: deliveryRemarks?.trim() ?? '',
        customer_phone: customerPhone.trim(),
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel?order_id=${order.id}`,
    });

    await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
