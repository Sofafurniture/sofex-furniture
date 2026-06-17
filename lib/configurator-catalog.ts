import { COLLECTION_CATEGORIES } from '@/lib/products/collection-catalog';
import { PRODUCT_CATALOG } from '@/lib/products';
import type { SofaModel } from '@/lib/sofa-data';

export interface ConfiguratorCategory {
  label: string;
  price: number;
  dimensions: string;
  /** Maps to collectionItems index when available */
  imageIndex: number;
  group: 'seating' | 'corner' | 'footstool';
}

/** All sofa categories available in the configurator (includes 3+2 set). */
export const CONFIGURATOR_CATEGORIES: ConfiguratorCategory[] = [
  { ...COLLECTION_CATEGORIES[0], imageIndex: 0, group: 'seating' },
  { ...COLLECTION_CATEGORIES[1], imageIndex: 1, group: 'seating' },
  { ...COLLECTION_CATEGORIES[2], imageIndex: 2, group: 'seating' },
  { ...COLLECTION_CATEGORIES[3], imageIndex: 3, group: 'seating' },
  {
    label: '3 + 2 Seater Set',
    price: COLLECTION_CATEGORIES[2].price + COLLECTION_CATEGORIES[3].price,
    dimensions: '1× 2 Seater & 1× 3 Seater suite',
    imageIndex: 3,
    group: 'seating',
  },
  { ...COLLECTION_CATEGORIES[4], imageIndex: 4, group: 'seating' },
  { ...COLLECTION_CATEGORIES[5], imageIndex: 5, group: 'seating' },
  { ...COLLECTION_CATEGORIES[6], imageIndex: 6, group: 'corner' },
  { ...COLLECTION_CATEGORIES[7], imageIndex: 7, group: 'corner' },
  { ...COLLECTION_CATEGORIES[8], imageIndex: 8, group: 'corner' },
  { ...COLLECTION_CATEGORIES[9], imageIndex: 9, group: 'footstool' },
  { ...COLLECTION_CATEGORIES[10], imageIndex: 10, group: 'footstool' },
  { ...COLLECTION_CATEGORIES[11], imageIndex: 11, group: 'footstool' },
  { ...COLLECTION_CATEGORIES[12], imageIndex: 12, group: 'footstool' },
];

export const DEFAULT_CATEGORY_INDEX = 3; // 3 Seater

export function getConfiguratorCategory(index: number): ConfiguratorCategory {
  return CONFIGURATOR_CATEGORIES[index] ?? CONFIGURATOR_CATEGORIES[DEFAULT_CATEGORY_INDEX];
}

export function getConfiguratorImage(model: SofaModel, categoryIndex: number): string {
  const product = PRODUCT_CATALOG[model];
  const category = getConfiguratorCategory(categoryIndex);
  const item = product.collectionItems[category.imageIndex];
  if (item?.image) return item.image;
  return product.images[0]?.src ?? '';
}

export function getModelPreviewImage(model: SofaModel): string {
  return PRODUCT_CATALOG[model].images[0]?.src ?? '';
}

export const DELIVERY_PROMISE = {
  headline: 'Custom sofa delivered within 7 days',
  subline: 'We deliver within 50 miles of London — whole sofa, assembled in your home',
  radius: '50-mile radius of London',
  assembly: 'Delivered as one piece and assembled on site — never flat-packed boxes',
};
