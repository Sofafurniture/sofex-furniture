import type { CatalogProduct } from './types';
import { buildCollectionItems } from './collection-catalog';

export const brooklynProduct: CatalogProduct = {
  slug: 'brooklyn',
  name: 'The Brooklyn 3 Seater Sofa',
  colour: 'Ivory',
  price: 799,
  monthlyPrice: 40.66,
  sku: 'MS3CI',
  reviewCount: 716,
  averageRating: 4.9,
  ratingBreakdown: [
    { stars: 5, count: 669, percent: 93 },
    { stars: 4, count: 44, percent: 6 },
    { stars: 3, count: 3, percent: 0 },
    { stars: 2, count: 0, percent: 0 },
    { stars: 1, count: 0, percent: 0 },
  ],
  images: [
    {
      src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-995870.jpg?v=1705428915',
      alt: 'Brooklyn 3 Seater Sofa - Ivory front view',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-140532.jpg?v=1706582986',
      alt: 'Brooklyn 3 Seater Sofa - Ivory styled living room',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-315184.jpg?v=1705428911',
      alt: 'Brooklyn 3 Seater Sofa - Ivory angle view',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-237542.jpg?v=1706548304',
      alt: 'Brooklyn 3 Seater Sofa - Ivory detail',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-928306.jpg?v=1706548304',
      alt: 'Brooklyn 3 Seater Sofa - Ivory cushion detail',
    },
    {
      src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-986961.jpg?v=1706548304',
      alt: 'Brooklyn 3 Seater Sofa - Ivory in room setting',
    },
  ],
  description: {
    intro:
      'Add a touch of contemporary style to your home with the Brooklyn 3-Seater sofa in Ivory Chenille.',
    sections: [
      {
        heading: 'Modern simplicity',
        body: 'Chic, elegant and stylish, the Brooklyn 3-seater Sofa boasts smooth, clean lines that will blend perfectly with any modern interior. Made with a premium textured chenille fabric in classic ivory, this sofa has fibre filled back cushions, and pocket sprung seats that provide exceptional comfort and lasting durability.',
      },
      {
        heading: 'Good Housekeeping approved',
        body: 'The Brooklyn Sofa Collection has been tried, tested and approved by the experts at Good Housekeeping, praised for its comfort, craftsmanship and timeless style.',
      },
      {
        heading: 'Built for everyday luxury',
        body: 'Lazy days with the family, movie nights with friends, or simply stretching out for an afternoon snooze — this is a sofa where you can enjoy every luxurious moment.',
      },
      {
        heading: 'Easy assembly',
        body: 'Your Brooklyn 3-seater sofa will be delivered in three separate pieces, and is very easy to assemble. Full instructions are included so you\'ll be ready to kick back and relax in no time at all.',
      },
    ],
    highlights: [
      'Premium textured chenille fabric',
      'Fibre-filled back cushions',
      'Pocket sprung seats',
      'Solid wood frame',
      'Delivered in 3 easy-to-assemble pieces',
      'Good Housekeeping approved collection',
    ],
  },
  specs: [
    { label: 'SKU', value: 'MS3CI' },
    { label: 'Fabric', value: 'Chenille' },
    { label: 'Fabric Composition', value: '100% Polyester' },
    { label: 'Dimensions', value: 'W: 266 x D: 98 x H: 82.5cm' },
    { label: 'Colour', value: 'Ivory' },
    { label: 'Frame Material', value: 'Solid Wood' },
    { label: 'Size', value: '3 Seater Sofa' },
    { label: 'Floor to Seat Height', value: '41cm' },
    { label: 'Seat Depth', value: '73cm' },
    { label: 'Assembly', value: 'Leg & additional attachment required' },
    { label: 'Box 1 Dimensions', value: 'W: 101 x D: 100 x H: 69cm' },
    { label: 'Box 2 Dimensions', value: 'W: 101 x D: 74 x H: 69cm' },
    { label: 'Box 3 Dimensions', value: 'W: 101 x D: 100 x H: 69cm' },
    { label: 'Weight', value: '77.6kg' },
  ],
  delivery: [
    { service: 'Medium Box Delivery (1-Man or 2-Man)', cost: '£19.99', timeframe: 'Choose your delivery day' },
    { service: 'Large Box Delivery (1-Man or 2-Man)', cost: '£29.99', timeframe: 'Choose your delivery day' },
    { service: 'X-Large Box Delivery (1-Man or 2-Man)', cost: '£39.99', timeframe: 'Choose your delivery day' },
    { service: 'XX-Large Delivery (1-Man or 2-Man)', cost: '£59.99', timeframe: 'Choose your delivery day' },
  ],
  careInstructions: [
    'Hand wash or professional clean only — no machine washing.',
    'Clean with your vacuum curtain attachment or a lint roller to stop dust build up.',
    'Keep away from direct sunlight and heat sources to prevent fading over time.',
    'Wipe spills quickly by gently dabbing with a dry cloth. For tougher stains, contact a specialist cleaning service.',
  ],
  collectionItems: buildCollectionItems(
    'Brooklyn',
    [
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-995870.jpg?v=1705428915',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-140532.jpg?v=1706582986',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-315184.jpg?v=1705428911',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-237542.jpg?v=1706548304',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-928306.jpg?v=1706548304',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/products/brooklyn-3-seater-sofa-ivory-986961.jpg?v=1706548304',
    ],
  ),
  reviews: [
    {
      id: '1',
      author: 'Tia Harding',
      title: 'Amazing quality!',
      body: 'Loveeee this sofa! So happy with the look, feel and quality.',
      rating: 5,
    },
    {
      id: '2',
      author: 'Leah',
      title: 'Fantastic sofa! Classy and good quality!',
      body: 'Really good quality sofa! We bought one in ivory colour last year and a year later bought another one but in black for our other room as we were so impressed by them! Really good quality and comfortable too! The sofas look classy and more expensive than they are! Really easy to clean too!',
      rating: 5,
    },
    {
      id: '3',
      author: 'Joanne',
      title: 'Ivory Brooklyn range',
      body: "I've been looking at this range for around a year. I saw all the reviews online and thought I'd take a chance and buy it. The ordering process was quick and easy. The items were delivered on the exact day scheduled and on time. The items were very well packaged and easy to handle for a single lady. I am so impressed by the quality. The fabric is gorgeous and the sofa, love seat and pouffe are so comfortable. I can't wait to enjoy them. I would definitely recommend.",
      rating: 5,
    },
    {
      id: '4',
      author: 'Daisy Munyanyi',
      title: 'Amazing quality',
      body: 'The sofa is bigger than how it looks in the picture. Very comfortable too.',
      rating: 5,
    },
    {
      id: '5',
      author: 'Alastair Dalton',
      title: 'Brooklyn sofa',
      body: 'Fantastic sofa quality — 10 out of 10 on the product itself. Very comfortable and looks great in the living room. Delivery experience could be improved but the sofa more than makes up for it.',
      rating: 4,
    },
  ],
};
