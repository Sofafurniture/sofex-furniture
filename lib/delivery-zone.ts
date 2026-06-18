/** Sofex delivery hub — Barking, East London */
export const DELIVERY_HUB_POSTCODE = 'IG11 0RG';
export const FREE_DELIVERY_RADIUS_MILES = 50;
export const OUT_OF_ZONE_DELIVERY_SURCHARGE_GBP = 50;

export type DeliveryZoneStatus = 'free' | 'surcharge' | 'unknown';

export interface DeliveryZoneResult {
  status: DeliveryZoneStatus;
  distanceMiles: number | null;
  message: string;
  surchargeGbp: number;
  hubPostcode: string;
}

interface PostcodeCoords {
  latitude: number;
  longitude: number;
}

function normalizePostcode(postcode: string): string {
  return postcode.replace(/\s+/g, '').toUpperCase();
}

function haversineMiles(a: PostcodeCoords, b: PostcodeCoords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function fetchPostcodeCoords(postcode: string): Promise<PostcodeCoords | null> {
  const normalized = normalizePostcode(postcode);
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: { latitude: number; longitude: number } };
  if (!data.result) return null;
  return { latitude: data.result.latitude, longitude: data.result.longitude };
}

export async function getDeliveryZone(postcode: string): Promise<DeliveryZoneResult> {
  const hub = normalizePostcode(DELIVERY_HUB_POSTCODE);
  const target = normalizePostcode(postcode);

  if (!target) {
    return {
      status: 'unknown',
      distanceMiles: null,
      message: '',
      surchargeGbp: 0,
      hubPostcode: DELIVERY_HUB_POSTCODE,
    };
  }

  try {
    const [hubCoords, targetCoords] = await Promise.all([
      fetchPostcodeCoords(hub),
      fetchPostcodeCoords(target),
    ]);

    if (!hubCoords || !targetCoords) {
      return {
        status: 'unknown',
        distanceMiles: null,
        message: 'We could not verify that postcode. Please check and try again.',
        surchargeGbp: 0,
        hubPostcode: DELIVERY_HUB_POSTCODE,
      };
    }

    const distanceMiles = Math.round(haversineMiles(hubCoords, targetCoords) * 10) / 10;

    if (distanceMiles <= FREE_DELIVERY_RADIUS_MILES) {
      return {
        status: 'free',
        distanceMiles,
        message: `You are eligible for free delivery (${distanceMiles} miles from our London hub).`,
        surchargeGbp: 0,
        hubPostcode: DELIVERY_HUB_POSTCODE,
      };
    }

    return {
      status: 'surcharge',
      distanceMiles,
      message:
        'Your address is outside our 50-mile delivery zone — extra delivery charges will apply (£50).',
      surchargeGbp: OUT_OF_ZONE_DELIVERY_SURCHARGE_GBP,
      hubPostcode: DELIVERY_HUB_POSTCODE,
    };
  } catch {
    return {
      status: 'unknown',
      distanceMiles: null,
      message: 'Unable to check delivery zone right now. Please try again.',
      surchargeGbp: 0,
      hubPostcode: DELIVERY_HUB_POSTCODE,
    };
  }
}
