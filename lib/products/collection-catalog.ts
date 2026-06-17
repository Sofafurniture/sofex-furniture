/** Shared collection categories — all four ranges use the same structure as Lavencia. */
export const COLLECTION_CATEGORIES = [
  { label: 'Chair', price: 799, dimensions: 'W129 x H94 x D95 cm' },
  { label: 'Loveseat', price: 899, dimensions: 'W157 x H94 x D95 cm' },
  { label: '2 Seater Sofa', price: 999, dimensions: 'W186 x H94 x D95 cm' },
  { label: '3 Seater Sofa', price: 1099, dimensions: 'W206 x H94 x D95 cm' },
  { label: '4 Seater Sofa', price: 1199, dimensions: 'W236 x H94 x D95 cm' },
  { label: 'Grande', price: 1299, dimensions: 'W264 x H94 x D95 cm' },
  { label: 'Left Corner (1C3)', price: 2299, dimensions: 'W198 x 275 x H94 x D95 cm' },
  { label: 'Right Corner (3C1)', price: 2299, dimensions: 'W275 x 198 x H94 x D95 cm' },
  { label: 'Large Corner (3C3)', price: 2499, dimensions: 'W275 x 275 x H94 x D95 cm' },
  { label: 'Small Designer Footstool', price: 349, dimensions: 'W80 x H37 x D80 cm' },
  { label: 'Large Designer Footstool', price: 399, dimensions: 'W102 x H50 x D102 cm' },
  { label: 'Small Storage Footstool', price: 349, dimensions: 'W60 x H43 x D55 cm' },
  { label: 'Large Storage Footstool', price: 399, dimensions: 'W74 x H43 x D55 cm' },
] as const;

export function buildCollectionItems(rangeName: string, imageSrcs: string[]) {
  return COLLECTION_CATEGORIES.map((cat, i) => ({
    name: `${rangeName} ${cat.label}`,
    price: cat.price,
    dimensions: cat.dimensions,
  image: imageSrcs.length ? imageSrcs[i % imageSrcs.length] : undefined,
  }));
}
