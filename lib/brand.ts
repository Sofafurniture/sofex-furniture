export const BRAND_NAME = 'Sofex Furniture';
export const BRAND_SHORT = 'SOFEX';
export const BRAND_TAGLINE = 'Furniture';

/** Official store inbox — all order and contact notifications go here. */
export const STORE_EMAIL = process.env.STORE_EMAIL ?? 'info@sofexfurniture.co.uk';

/** Sender address for transactional email (must be verified in Resend). */
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? `Sofex Furniture <${STORE_EMAIL}>`;
