import type { CatalogProduct } from './types';
import { buildCollectionItems } from './collection-catalog';

const BQ = (n: number) =>
  `https://media.diy.com/is/image/Kingfisher/4378654093256_${String(n).padStart(2, '0')}`;
const HOL = (name: string) =>
  `https://homeandlove.louisinteriors.co.uk/wp-content/uploads/2024/04/${name}`;

export const carnabyProduct: CatalogProduct = {
  slug: 'carnaby',
  name: 'The Carnaby Cinema U-Shape Sofa',
  colour: 'Surrey Cream',
  price: 999,
  monthlyPrice: 34.45,
  sku: '20880712',
  reviewCount: 186,
  averageRating: 4.9,
  ratingBreakdown: [
    { stars: 5, count: 168, percent: 90 },
    { stars: 4, count: 14, percent: 8 },
    { stars: 3, count: 4, percent: 2 },
    { stars: 2, count: 0, percent: 0 },
    { stars: 1, count: 0, percent: 0 },
  ],
  images: [
    { src: BQ(1), alt: 'The Carnaby Cinema U-Shape Sofa — Surrey Cream front view' },
    { src: BQ(2), alt: 'The Carnaby U-Shape sofa — cinema layout with footstool' },
    { src: BQ(3), alt: 'The Carnaby U-Shape sofa — standard configuration' },
    { src: BQ(4), alt: 'The Carnaby sofa — plush cushion detail' },
    { src: BQ(5), alt: 'The Carnaby U-Shape sofa — angled view' },
    { src: BQ(6), alt: 'The Carnaby sofa — living room styled shot' },
    { src: BQ(7), alt: 'The Carnaby Cinema sofa — side profile' },
    { src: BQ(8), alt: 'The Carnaby U-Shape sofa — full room setting' },
  ],
  description: {
    intro:
      'This luxurious U-shaped sofa is designed to be the centrepiece of your living space. Generous dimensions provide ample seating for family and guests — perfect for cosy nights in or entertaining.',
    sections: [
      {
        heading: 'Cinema & standard U-shape',
        body: 'Measuring 160cm x 280cm x 160cm, the Carnaby operates as both a cinema-style U-shape and a standard U-shape sofa. Arrange the included footstool to create an extended cinema layout for movie nights, or configure a classic conversational U-shape for everyday lounging.',
      },
      {
        heading: 'Plush comfort, made in the UK',
        body: 'Upholstered in a soft toned plush polyester fabric with deep cushions and supportive backrests, the Carnaby invites you to sink in and stay. Removable back and seat cushions make everyday plumping and cleaning straightforward. Sturdy black feet provide lasting stability.',
      },
      {
        heading: 'Built for family living',
        body: 'The spacious U-shape configuration maximises seating and creates an inviting conversational area. Comfortably seats 5–6 people — the ultimate social hub for laughter, lounging and long movie nights. Handcrafted by Home & Love, specialists in beds and sofas from Huddersfield, West Yorkshire.',
      },
      {
        heading: 'Whole-sofa delivery & assembly',
        body: 'Unlike flat-pack retailers, Sofex delivers your Carnaby as a complete sofa and assembles it in your home. Our two-person team handles access, positioning and final setup — you never wrestle with boxes of parts.',
      },
    ],
    highlights: [
      'Cinema or standard U-shape layouts',
      'Matching footstool included',
      'Plush polyester fabric in Surrey Cream',
      'Removable back & seat cushions',
      'Seats 5–6 people comfortably',
      'Sturdy black feet',
      'Made in the UK by Home & Love',
      '160 x 280 x 160cm footprint',
    ],
  },
  specs: [
    { label: 'Product Code', value: '4378654093256' },
    { label: 'Fabric', value: 'Plush Polyester' },
    { label: 'Colour', value: 'Surrey Cream' },
    { label: 'Dimensions (W x D x H)', value: '280 x 160 x 95 cm' },
    { label: 'Seat Height', value: '45 cm' },
    { label: 'Back Rest Height', value: '50 cm' },
    { label: 'Seat Depth', value: '55 cm' },
    { label: 'Seating Capacity', value: '5–6 seats' },
    { label: 'Configuration', value: 'U-Shape / Cinema U-Shape' },
    { label: 'Footstool', value: 'Included — movable' },
    { label: 'Cushions', value: 'Removable back & seat cushions' },
    { label: 'Feet', value: 'Sturdy black feet' },
    { label: 'Assembly', value: 'Delivered whole — assembled on site by Sofex team' },
    { label: 'Origin', value: 'Made in the UK' },
  ],
  delivery: [
    { service: 'Standard Room Delivery', cost: '£49.99', timeframe: 'Choose your delivery day' },
    { service: 'Large Item Delivery (2-Man)', cost: '£79.99', timeframe: 'Delivered to your room of choice' },
    { service: '0% APR Finance', cost: 'From £34.45/mo', timeframe: 'Spread the cost interest-free' },
  ],
  careInstructions: [
    'Vacuum regularly with an upholstery attachment to prevent dust build-up.',
    'Plump removable cushions frequently to maintain shape and comfort.',
    'Blot spills immediately with a clean, dry cloth — do not rub.',
    'Professional clean recommended for stubborn stains.',
    'Keep away from direct sunlight and heat sources to prevent fading.',
  ],
  collectionItems: buildCollectionItems('Carnaby', [
    BQ(1),
    BQ(2),
    BQ(3),
    BQ(4),
    BQ(5),
    BQ(6),
    BQ(7),
    BQ(8),
    HOL('carnaby-sofa-beige-u-shape-corner-1.jpg'),
    HOL('carnaby-sofa-beige-u-shape-corner-5.jpg'),
    HOL('carnaby-sofa-grey-u-shape-corner-1.jpg'),
    HOL('carnaby-sofa-black-u-shape-corner-1.jpg'),
    HOL('carnaby-sofa-beige-u-shape-corner-8.jpg'),
  ]),
  reviews: [
    {
      id: '1',
      author: 'Michelle T.',
      title: 'Perfect family sofa',
      body: 'The cinema layout is brilliant for movie nights with the kids. Deep cushions, loads of space, and the cream fabric looks much more premium in person.',
      rating: 5,
    },
    {
      id: '2',
      author: 'Darren P.',
      title: 'Great value U-shape',
      body: 'Seats the whole family comfortably. Footstool is a nice bonus and the removable covers make cleaning much easier than our old sofa.',
      rating: 5,
    },
    {
      id: '3',
      author: 'Aisha K.',
      title: 'Centrepiece of our lounge',
      body: 'Exactly as pictured. Delivery was smooth, assembly straightforward, and the U-shape fills our open-plan room perfectly.',
      rating: 5,
    },
    {
      id: '4',
      author: 'Chris W.',
      title: 'Very comfortable',
      body: 'Supportive backrest and deep seats. Switched between cinema and standard layout depending on how many people are over — works great both ways.',
      rating: 5,
    },
    {
      id: '5',
      author: 'Helen R.',
      title: 'Lovely sofa',
      body: 'Soft fabric, solid build, and the black feet feel sturdy. Took a little while to assemble but worth it.',
      rating: 4,
    },
  ],
};
