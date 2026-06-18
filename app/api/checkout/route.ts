import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { buildOrderDescription, calculatePrice } from '@/lib/pricing';
import { formatDeliverySlot, isDeliveryDateAllowed } from '@/lib/delivery-slots';
import { getDeliveryZone } from '@/lib/delivery-zone';
import { lookupUkPostcode, toStripeAddress } from '@/lib/postcode';
import { applyPercentDiscount, FIRST_ORDER_DISCOUNT_PERCENT, validateDiscountCode } from '@/lib/discount';
import { getStripe, isStripeConfigured, stripeErrorMessage } from '@/lib/stripe';
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

    const postcodeLookup = await lookupUkPostcode(postcode);
    const stripeAddress = toStripeAddress(shippingAddress, postcode, postcodeLookup);
    const trimmedName = customerName.trim();
    const trimmedEmail = customerEmail.trim();
    const trimmedPhone = customerPhone.trim();

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

    const customer = await stripe.customers.create({
      email: trimmedEmail,
      name: trimmedName,
      phone: trimmedPhone,
      address: stripeAddress,
      shipping: {
        name: trimmedName,
        phone: trimmedPhone,
        address: stripeAddress,
      },
      metadata: { order_id: order.id },
    });

    const sessionBase: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      customer: customer.id,
      customer_update: {
        name: 'never',
        address: 'never',
        shipping: 'never',
      },
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      payment_intent_data: {
        shipping: {
          name: trimmedName,
          phone: trimmedPhone,
          address: stripeAddress,
        },
        metadata: {
          customer_phone: trimmedPhone,
        },
      },
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
    };

    let session: Stripe.Checkout.Session | null = null;
    const paymentMethodAttempts: Stripe.Checkout.SessionCreateParams.PaymentMethodType[][] = [
      ['card', 'klarna', 'afterpay_clearpay'],
      ['card'],
    ];

    for (const payment_method_types of paymentMethodAttempts) {
      try {
        session = await stripe.checkout.sessions.create({
          ...sessionBase,
          payment_method_types,
        });
        break;
      } catch (attemptError) {
        if (payment_method_types.length === 1) throw attemptError;
        console.warn('Stripe checkout retry with card only:', stripeErrorMessage(attemptError));
      }
    }

    if (!session?.url) {
      return NextResponse.json({ error: 'Checkout failed', message: 'Stripe did not return a checkout URL.' }, { status: 500 });
    }

    await supabase.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed', message: stripeErrorMessage(error) },
      { status: 500 },
    );
  }
}
