import type { CatalogProduct } from './types';
import { defaultDelivery } from './types';
import { buildCollectionItems } from './collection-catalog';

export const dylanProduct: CatalogProduct = {
  slug: 'dylan',
  name: 'The Dylan 3 Seater Sofa',
  colour: 'Chenille Olive',
  price: 599,
  monthlyPrice: 38.12,
  sku: 'DY3COL',
  reviewCount: 29,
  averageRating: 4.8,
  ratingBreakdown: [
    { stars: 5, count: 24, percent: 83 },
    { stars: 4, count: 5, percent: 17 },
    { stars: 3, count: 0, percent: 0 },
    { stars: 2, count: 0, percent: 0 },
    { stars: 1, count: 0, percent: 0 },
  ],
  images: [
    { src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-9826818.jpg?v=1770566364', alt: 'The Dylan 3 Seater Sofa - contemporary olive chenille' },
    { src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-1425443.jpg?v=1770566366', alt: 'The Dylan sofa styled in modern living room' },
    { src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-5747000.jpg?v=1770566366', alt: 'The Dylan sofa angle view' },
    { src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-2754125.jpg?v=1770566367', alt: 'The Dylan sofa cushion detail' },
    { src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-6476229.jpg?v=1770566366', alt: 'The Dylan sofa wide shot' },
    { src: 'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-8900343.jpg?v=1770566367', alt: 'The Dylan sofa lifestyle' },
  ],
  description: {
    intro: 'Clean geometric profiles meet deep architectural low-slung seating. The Dylan 3-Seater is built for those who love to stretch out in laid-back contemporary style.',
    sections: [
      {
        heading: 'Sleek contemporary silhouette',
        body: 'Crafted with generous proportions and deep cushions, the Dylan boasts smooth clean lines and a minimalist edge. Wide arms and a gently supportive back make it ideal for everyday lounging while the low-slung profile anchors any modern interior.',
      },
      {
        heading: 'Effortless comfort',
        body: 'Upholstered in premium textured chenille for a soft, inviting finish. Deep seat cushions invite slow, restful moments — perfect for movie nights, afternoon naps, or curling up with a book.',
      },
      {
        heading: 'Modular versatility',
        body: 'Style the Dylan solo as a statement piece, or pair with matching loveseat and chaise modules to create a beautifully balanced living space tailored to your room.',
      },
    ],
    highlights: [
      'Low-slung contemporary silhouette',
      'Premium textured chenille upholstery',
      'Wide arms and deep seat cushions',
      'Clean minimalist profile',
      'Modular collection available',
      'Easy leg assembly',
    ],
  },
  specs: [
    { label: 'SKU', value: 'DY3COL' },
    { label: 'Fabric', value: 'Chenille' },
    { label: 'Dimensions', value: 'W: 267 x D: 94 x H: 84cm' },
    { label: 'Colour', value: 'Chenille Olive' },
    { label: 'Assembly', value: 'Leg assembly required' },
    { label: 'Type', value: '3 Seater Sofa' },
    { label: 'Box 1', value: 'W: 96 x D: 96 x H: 68cm' },
    { label: 'Box 2', value: 'W: 96 x D: 96 x H: 68cm' },
    { label: 'Box 3', value: 'W: 81 x D: 96 x H: 68cm' },
  ],
  delivery: defaultDelivery,
  careInstructions: [
    'Clean with a damp cloth or low-suction vacuum.',
    'Do not use abrasive chemicals.',
    'Keep away from direct sunlight to prevent fading.',
    'Rotate cushions periodically for even wear.',
  ],
  collectionItems: buildCollectionItems(
    'Dylan',
    [
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-9826818.jpg?v=1770566364',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-1425443.jpg?v=1770566366',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-5747000.jpg?v=1770566366',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-2754125.jpg?v=1770566367',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-6476229.jpg?v=1770566366',
      'https://cdn.shopify.com/s/files/1/0685/4010/5001/files/miami-3-seater-sofa-chenille-olive-8900343.jpg?v=1770566367',
    ],
  ),
  reviews: [
    { id: '1', author: 'Tom Burns', title: 'Really happy', body: 'Super happy with this sofa — looks great and very comfortable, and so easy to assemble.', rating: 5 },
    { id: '2', author: 'Monica Chowdhury', title: 'Beautiful sofa!', body: 'Exactly like the picture! So modern and chic. Really went well with our living room furniture. Delivery and customer service was brilliant too.', rating: 5 },
    { id: '3', author: 'Carlie Mccoy', title: 'In love', body: 'We got this along with the loveseat and so glad we did. Such a smooth process and delivery was quick. The colour is so nice and it is so comfortable. Would 100% recommend.', rating: 5 },
    { id: '4', author: 'Rebecca H', title: 'Very comfortable', body: 'I love this sofa so much. Very comfy and pleased the covers are removable. A beautiful addition to our home.', rating: 4 },
    { id: '5', author: 'Morgan Raiyat', title: 'Gorgeous!', body: 'Colour and fabric are exact to what they advertise. Super comfy and great for a small household. Easy assembly and quite light so easy to move around.', rating: 5 },
  ],
};
