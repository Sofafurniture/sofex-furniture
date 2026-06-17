import type { ProductWithRelations } from '@/lib/admin-types';
import type { CatalogProduct } from '@/lib/products/types';

export function dbProductToView(product: ProductWithRelations) {
  const images = (product.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({ src: img.url, alt: img.alt ?? product.name }));

  const reviews = (product.product_reviews ?? []).map((r) => ({
    id: r.id,
    author: r.author,
    title: r.title ?? '',
    body: r.body,
    rating: r.rating,
    imageUrls: r.image_urls ?? [],
  }));

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 5;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count, percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0 };
  });

  return {
    slug: product.slug,
    name: product.name,
    colour: product.colour ?? '',
    price: product.price_pence / 100,
    monthlyPrice: (product.monthly_price_pence ?? 0) / 100,
    sku: product.sku ?? '',
    reviewCount: reviews.length,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingBreakdown,
    images,
    description: {
      intro: product.description_intro ?? '',
      sections: product.description_sections ?? [],
      highlights: product.highlights ?? [],
    },
    specs: product.specs ?? [],
    delivery: product.delivery_options ?? [],
    careInstructions: product.care_instructions ?? [],
    collectionItems: product.collection_items ?? [],
    reviews,
  };
}

export type ProductView = ReturnType<typeof dbProductToView>;

export function staticProductToView(p: CatalogProduct): ProductView {
  return {
    slug: p.slug,
    name: p.name,
    colour: p.colour,
    price: p.price,
    monthlyPrice: p.monthlyPrice,
    sku: p.sku,
    reviewCount: p.reviewCount,
    averageRating: p.averageRating,
    ratingBreakdown: p.ratingBreakdown,
    images: p.images,
    description: p.description,
    specs: p.specs,
    delivery: p.delivery,
    careInstructions: p.careInstructions,
    collectionItems: p.collectionItems,
    reviews: p.reviews.map((r) => ({ ...r, imageUrls: [] as string[] })),
  };
}
