export interface ProductReview {
  id: string;
  author: string;
  title: string;
  body: string;
  rating: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CatalogProduct {
  slug: string;
  name: string;
  colour: string;
  price: number;
  monthlyPrice: number;
  sku: string;
  reviewCount: number;
  ratingBreakdown: { stars: number; count: number; percent: number }[];
  averageRating: number;
  images: { src: string; alt: string }[];
  description: {
    intro: string;
    sections: { heading: string; body: string }[];
    highlights: string[];
  };
  specs: ProductSpec[];
  delivery: { service: string; cost: string; timeframe: string }[];
  careInstructions: string[];
  reviews: ProductReview[];
  collectionItems: { name: string; price: number; image?: string; dimensions?: string }[];
}

const defaultDelivery = [
  { service: 'Medium Box Delivery (1-Man or 2-Man)', cost: '£19.99', timeframe: 'Choose your delivery day' },
  { service: 'Large Box Delivery (1-Man or 2-Man)', cost: '£29.99', timeframe: 'Choose your delivery day' },
  { service: 'X-Large Box Delivery (1-Man or 2-Man)', cost: '£39.99', timeframe: 'Choose your delivery day' },
];

export { defaultDelivery };
