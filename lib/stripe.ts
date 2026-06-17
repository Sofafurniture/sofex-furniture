import Stripe from 'stripe';

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.');
  }
  return new Stripe(key);
}
