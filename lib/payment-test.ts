import type { SofaConfiguration, SofaModel } from './sofa-data';

/** Brooklyn is priced at £1 while payment testing is active. */
export const PAYMENT_TEST_MODEL: SofaModel = 'brooklyn';
export const PAYMENT_TEST_PRICE_GBP = Number(process.env.PAYMENT_TEST_PRICE_GBP ?? '1');

export function isPaymentTestActive(model: SofaModel): boolean {
  if (process.env.PAYMENT_TEST_ENABLED === 'false') return false;
  return model === PAYMENT_TEST_MODEL && PAYMENT_TEST_PRICE_GBP > 0;
}

export function isPaymentTestOrder(config: SofaConfiguration): boolean {
  return isPaymentTestActive(config.model);
}

export function getPaymentTestPriceGbp(): number {
  return PAYMENT_TEST_PRICE_GBP;
}
