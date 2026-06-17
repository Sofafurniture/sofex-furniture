export interface ProductSpec {
  label: string;
  value: string;
}

export interface DescriptionSection {
  heading: string;
  body: string;
}

export interface DeliveryOption {
  service: string;
  cost: string;
  timeframe: string;
}

export interface CollectionItem {
  name: string;
  price: number;
  image?: string;
  dimensions?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  author: string;
  title: string | null;
  body: string;
  rating: number;
  image_urls: string[];
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  colour: string | null;
  price_pence: number;
  monthly_price_pence: number | null;
  sku: string | null;
  description_intro: string | null;
  description_sections: DescriptionSection[];
  highlights: string[];
  specs: ProductSpec[];
  care_instructions: string[];
  delivery_options: DeliveryOption[];
  collection_items: CollectionItem[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  product_images: ProductImage[];
  product_reviews: ProductReview[];
}

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  configuration: Record<string, unknown>;
  total_pence: number;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
}

export interface ProductFormData {
  slug: string;
  name: string;
  colour: string;
  price: number;
  monthlyPrice: number;
  sku: string;
  descriptionIntro: string;
  descriptionSections: DescriptionSection[];
  highlights: string[];
  specs: ProductSpec[];
  careInstructions: string[];
  deliveryOptions: DeliveryOption[];
  collectionItems: CollectionItem[];
  published: boolean;
  images: { url: string; alt: string }[];
  reviews: {
    id?: string;
    author: string;
    title: string;
    body: string;
    rating: number;
    imageUrls: string[];
  }[];
}

export function productToFormData(product: ProductWithRelations): ProductFormData {
  return {
    slug: product.slug,
    name: product.name,
    colour: product.colour ?? '',
    price: product.price_pence / 100,
    monthlyPrice: (product.monthly_price_pence ?? 0) / 100,
    sku: product.sku ?? '',
    descriptionIntro: product.description_intro ?? '',
    descriptionSections: product.description_sections ?? [],
    highlights: product.highlights ?? [],
    specs: product.specs ?? [],
    careInstructions: product.care_instructions ?? [],
    deliveryOptions: product.delivery_options ?? [],
    collectionItems: product.collection_items ?? [],
    published: product.published,
    images: (product.product_images ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ url: img.url, alt: img.alt ?? '' })),
    reviews: (product.product_reviews ?? []).map((r) => ({
      id: r.id,
      author: r.author,
      title: r.title ?? '',
      body: r.body,
      rating: r.rating,
      imageUrls: r.image_urls ?? [],
    })),
  };
}

export function formDataToDbPayload(data: ProductFormData) {
  return {
    slug: data.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    name: data.name.trim(),
    colour: data.colour.trim() || null,
    price_pence: Math.round(data.price * 100),
    monthly_price_pence: data.monthlyPrice ? Math.round(data.monthlyPrice * 100) : null,
    sku: data.sku.trim() || null,
    description_intro: data.descriptionIntro.trim() || null,
    description_sections: data.descriptionSections.filter((s) => s.heading || s.body),
    highlights: data.highlights.filter(Boolean),
    specs: data.specs.filter((s) => s.label && s.value),
    care_instructions: data.careInstructions.filter(Boolean),
    delivery_options: data.deliveryOptions.filter((d) => d.service),
    collection_items: data.collectionItems.filter((c) => c.name),
    published: data.published,
    updated_at: new Date().toISOString(),
  };
}
