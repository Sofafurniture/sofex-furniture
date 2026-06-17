import { brooklynProduct } from './brooklyn';
import { carnabyProduct } from './carnaby';
import { dylanProduct } from './dylan';
import { lavenciaProduct } from './lavencia';
import type { CatalogProduct } from './types';

export type { CatalogProduct, ProductReview, ProductSpec } from './types';
export { brooklynProduct, dylanProduct, carnabyProduct, lavenciaProduct };

export const PRODUCT_CATALOG: Record<string, CatalogProduct> = {
  brooklyn: brooklynProduct,
  dylan: dylanProduct,
  carnaby: carnabyProduct,
  lavencia: lavenciaProduct,
};

export const PRODUCT_SLUGS = Object.keys(PRODUCT_CATALOG);

export function getStaticProduct(slug: string): CatalogProduct | null {
  return PRODUCT_CATALOG[slug] ?? null;
}

export function getAllStaticProducts(): CatalogProduct[] {
  return Object.values(PRODUCT_CATALOG);
}
