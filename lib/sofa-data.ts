export type SofaModel = 'dylan' | 'carnaby' | 'lavencia' | 'brooklyn';
export type SofaSize = '2-seater' | '3-seater' | '3+2-seater' | 'l-shaped' | 'u-shaped';
export type FabricQuality = 'standard-linen' | 'premium-velvet' | 'luxury-boucle';
export type CushionType = 'foam-wrap' | 'feather-blend';
export type BackStyle = 'normal' | 'high-back';

export interface FabricColor {
  id: string;
  name: string;
  hex: string;
}

export interface SofaConfiguration {
  model: SofaModel;
  size: SofaSize;
  fabricQuality: FabricQuality;
  fabricColorId: string;
  cushionType: CushionType;
  backStyle: BackStyle;
}

export const MODEL_DETAILS: Record<SofaModel, { name: string; tag: string; desc: string; basePrice: number }> = {
  dylan: { name: 'The Dylan', tag: 'Sleek & Contemporary', desc: 'Low-slung geometric profiles with deep cushions and a clean minimalist silhouette. Premium chenille upholstery.', basePrice: 599 },
  carnaby: { name: 'The Carnaby', tag: 'Cinema U-Shape Living', desc: 'Luxurious U-shape with cinema layout, plush polyester and included footstool. Seats 5–6 for movie nights and entertaining.', basePrice: 999 },
  lavencia: { name: 'The Lavencia', tag: 'Curved Contemporary Elegance', desc: 'Soft sweeping curves with intricate fluted arms. Luxe chenille upholstery in 30 curated shades with gold or chrome trim.', basePrice: 1099 },
  brooklyn: { name: 'The Brooklyn', tag: 'Classic Deep-Seated Comfort', desc: 'Smooth clean lines with premium chenille fabric, fibre-filled back cushions and pocket sprung seats. Good Housekeeping approved.', basePrice: 799 },
};

export const SIZE_DETAILS: Record<SofaSize, { name: string; dimensions: string; priceMultiplier: number }> = {
  '2-seater': { name: '2 Seater Compact', dimensions: 'W: 165cm x D: 95cm x H: 82cm', priceMultiplier: 1.0 },
  '3-seater': { name: '3 Seater Grand', dimensions: 'W: 266cm x D: 98cm x H: 82.5cm', priceMultiplier: 1.25 },
  '3+2-seater': { name: '3 + 2 Seater Set', dimensions: 'Includes 1x Three Seater & 1x Two Seater suite', priceMultiplier: 2.1 },
  'l-shaped': { name: 'L-Shaped Chaise Lounge', dimensions: 'W: 255cm x D: 165cm x H: 82cm', priceMultiplier: 2.3 },
  'u-shaped': { name: 'U-Shaped Mega Corner', dimensions: 'W: 330cm x D: 210cm x H: 82cm', priceMultiplier: 3.0 },
};

export const FABRIC_DETAILS: Record<FabricQuality, { name: string; desc: string; premium: number; colors: FabricColor[] }> = {
  'standard-linen': {
    name: 'Standard Heritage Linen',
    desc: 'Breathable, durable crisp woven flax blend with organic texture matrices.',
    premium: 0,
    colors: [
      { id: 'lin-ivory', name: 'Ivory Cream', hex: '#F4F1EA' },
      { id: 'lin-oat', name: 'Toasted Oatmeal', hex: '#E1D9C6' },
      { id: 'lin-grey', name: 'Mineral Stone', hex: '#A8A49E' },
    ],
  },
  'premium-velvet': {
    name: 'Premium Performance Velvet',
    desc: 'Dense structural high-pile matte velvet engineered to resist stains and fluid spills.',
    premium: 150,
    colors: [
      { id: 'vel-olive', name: 'Moss Olive', hex: '#4A533C' },
      { id: 'vel-ink', name: 'Deep Sea Ink', hex: '#1C2E3D' },
      { id: 'vel-blush', name: 'Petal Blush', hex: '#E3C1B5' },
    ],
  },
  'luxury-boucle': {
    name: 'Luxury Italian Bouclé',
    desc: 'Ultra-plush hyper-textured looped yarn giving uncompromised warmth and high-fashion aesthetics.',
    premium: 320,
    colors: [
      { id: 'bou-chalk', name: 'Alabaster Chalk', hex: '#F9F8F4' },
      { id: 'bou-camel', name: 'Camel Suede', hex: '#C6A177' },
      { id: 'bou-charcoal', name: 'Charcoal Asphalt', hex: '#2F3032' },
    ],
  },
};

export const CUSHION_DETAILS: Record<CushionType, { name: string; desc: string; premium: number }> = {
  'foam-wrap': { name: 'Tailored Reflex Foam Wrap', desc: 'High-density memory core wrapped in fiber layers. Provides crisp posture recovery and structured crisp shapes.', premium: 0 },
  'feather-blend': { name: 'Cloud-Sink Feather Blend', desc: 'Sterilized goose down mixed with micro-fiber matrices. Offers an ultra-soft, lived-in sinkable luxury experience.', premium: 125 },
};

export const BACK_DETAILS: Record<BackStyle, { name: string; desc: string; premium: number }> = {
  normal: { name: 'Standard Sleek Profile Back', desc: 'Standard architectural profile heights aligned seamlessly to traditional minimalist living layout sightlines.', premium: 0 },
  'high-back': { name: 'Enhanced High-Back Lumbar Support', desc: 'Extended upper structure (+12cm) providing structural neck, head, and deep orthopedic lumbar support.', premium: 95 },
};

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'failed';

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  configuration: SofaConfiguration;
  total_pence: number;
  status: OrderStatus;
  stripe_session_id: string | null;
  created_at: string;
}
