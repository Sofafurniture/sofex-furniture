import Stripe from 'stripe';

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.');
  }
  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  });
}

export function stripeErrorMessage(error: unknown): string {
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Checkout failed';
}
